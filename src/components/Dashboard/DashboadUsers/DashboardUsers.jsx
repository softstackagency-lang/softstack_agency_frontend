"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const usersArray = Array.isArray(data.users) ? data.users : [];
        setUsers(usersArray);
      } else {
        setError(data.message || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-red-400 mb-4 text-sm sm:text-base">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-600/20 rounded-lg">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Users Management</h1>
            <p className="text-xs sm:text-sm text-gray-400">Manage your platform users</p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-400 ml-auto">
          Total: {users.length} users
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
          />
        </div>
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors text-sm sm:text-base whitespace-nowrap">
          <Filter className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Filter</span>
        </button>
      </div>

      {/* ── DESKTOP TABLE (md and up) ── */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id || user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name || 'N/A'}</div>
                          <div className="text-gray-400 text-sm">{user.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100/10 text-blue-400">
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100/10 text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE / TABLET CARDS (below md) ── */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-10 text-center text-gray-400 text-sm">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id || user._id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors"
            >
              {/* Top row: avatar + info + actions */}
              <div className="flex items-start justify-between gap-3">
                {/* Avatar + name/email */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-sm truncate">{user.name || 'N/A'}</div>
                    <div className="text-gray-400 text-xs truncate">{user.email || 'N/A'}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom row: role, status, joined */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100/10 text-blue-400">
                  {user.role || 'User'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100/10 text-green-400">
                  Active
                </span>
                <span className="text-gray-500 text-xs ml-auto">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs sm:text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs sm:text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}