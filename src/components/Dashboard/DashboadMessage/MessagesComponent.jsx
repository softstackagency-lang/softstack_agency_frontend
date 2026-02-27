"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, MoreVertical, Eye, Trash2, Mail, MailOpen, Archive, Clock, User, Phone, AlertCircle } from 'lucide-react';
import { contactApi } from '@/lib/api';

export default function MessagesComponent() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [stats, setStats] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAllContacts();
      
      if (response.success) {
        const contactsArray = Array.isArray(response.data) ? response.data : [];
        setContacts(contactsArray);
        // Calculate stats from contacts
        calculateStats(contactsArray);
      } else {
        setError(response.message || 'Failed to fetch contacts');
        setContacts([]);
      }
    } catch (error) {
      setError(error.userMessage || 'Failed to load messages. Please try again.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (contactsList) => {
    const statusCounts = {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0
    };
    
    contactsList.forEach(contact => {
      if (statusCounts.hasOwnProperty(contact.status)) {
        statusCounts[contact.status]++;
      }
    });
    
    setStats({ statusCounts });
  };

  const fetchStats = async () => {
    try {
      const response = await contactApi.getContactStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      // Fallback to calculating from local contacts
      if (contacts.length > 0) {
        calculateStats(contacts);
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactApi.updateContactStatus(id, status);
      
      // Update contacts list locally without refetching
      const updatedContacts = contacts.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      );
      setContacts(updatedContacts);
      
      // Recalculate stats from updated contacts
      calculateStats(updatedContacts);
      
      // Update selected contact if it's the one being modified
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      alert(error.userMessage || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactApi.deleteContact(id);
      
      // Remove contact from local state without refetching
      const updatedContacts = contacts.filter(contact => contact._id !== id);
      setContacts(updatedContacts);
      
      // Recalculate stats from updated contacts
      calculateStats(updatedContacts);
      
      setShowDeleteConfirm(null);
      
      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      alert(error.userMessage || 'Failed to delete message');
    }
  };
  const handleViewDetails = async (contact) => {
    setViewLoading(true);
    setSelectedContact(contact);
    // Mark as read if it's new
    if (contact.status === 'new') {
      await handleUpdateStatus(contact._id, 'read');
    }
    setViewLoading(false);
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }) : [];

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      read: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      replied: 'bg-green-500/20 text-green-400 border-green-500/30',
      archived: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.new}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <div className="text-red-400 mb-4">{error}</div>
        <button 
          onClick={fetchContacts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
            <p className="text-gray-400">Manage customer inquiries and messages</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          Total: {contacts.length} messages
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="New" value={stats.statusCounts?.new || 0} color="blue" />
          <StatCard label="Read" value={stats.statusCounts?.read || 0} color="gray" />
          <StatCard label="Replied" value={stats.statusCounts?.replied || 0} color="green" />
          <StatCard label="Archived" value={stats.statusCounts?.archived || 0} color="yellow" />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No messages found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => handleViewDetails(contact)}
                className={`p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer ${
                  selectedContact?._id === contact._id ? 'ring-2 ring-blue-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {contact.status === 'new' ? (
                      <Mail className="w-4 h-4 text-blue-400" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-gray-400" />
                    )}
                    <h3 className="font-semibold text-white">{contact.name}</h3>
                  </div>
                  {getStatusBadge(contact.status)}
                </div>
                
                <p className="text-sm text-gray-400 mb-2">{contact.email}</p>
                <p className="text-sm font-medium text-gray-300 mb-2">{contact.subject}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{contact.message}</p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(contact._id);
                    }}
                    className="p-1 text-red-400 hover:bg-red-500/10 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Details */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          {viewLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedContact ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-white">Message Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-white">{selectedContact.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-400 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-400 hover:underline">
                      {selectedContact.phone || 'N/A'}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Subject</label>
                  <p className="text-white mt-1 font-medium">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Message</label>
                  <p className="text-white mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Date Received</label>
                  <p className="text-white mt-1">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'read', 'replied', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedContact._id, status)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                          selectedContact.status === status
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowDeleteConfirm(selectedContact._id)}
                  className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Message
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Eye className="w-12 h-12 mb-4" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-[#0a1628] border border-white/10 rounded-lg p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    gray: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}
