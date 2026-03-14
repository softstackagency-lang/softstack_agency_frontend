"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Eye, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await userApi.getAllUsers();

      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
    } catch (error) {
      setError(error.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    // Create a fresh copy of user data to avoid state mutation
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user'
    });
    setEditModal({ show: true, user: { ...user } });
  };

  const closeEditModal = () => {
    setEditModal({ show: false, user: null });
    setEditFormData({ name: '', email: '', role: '' });
  };

  const handleUpdateUser = async () => {
    if (!editModal.user) return;

    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`/api/users/${editModal.user._id || editModal.user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update user');
      }

      // Update the users array with the new data, ensuring proper immutability
      setUsers(prevUsers =>
        prevUsers.map(user =>
          (user._id || user.id) === (editModal.user._id || editModal.user.id)
            ? { ...user, ...editFormData }
            : user
        )
      );

      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeEditModal();
    } catch (error) {
      setError(error.message || 'Failed to update user');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
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
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400">Manage your platform users</p>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Total: {users.length} users
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
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
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100/10 text-green-400' :
                          user.status === 'inactive' ? 'bg-gray-100/10 text-gray-400' :
                            user.status === 'suspended' ? 'bg-red-100/10 text-red-400' :
                              'bg-green-100/10 text-green-400'
                        }`}>
                        {user.status || 'Active'}
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
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        >
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
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
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

      {/* ══════════ EDIT USER MODAL ══════════ */}
      {editModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] w-full max-w-md">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                Edit User
              </h3>
              <button
                onClick={closeEditModal}
                disabled={updating}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-white/5 border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm"
                  placeholder="Enter user name"
                  disabled={updating}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-white/5 border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm"
                  placeholder="Enter email"
                  disabled={updating}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-[#0a0f23] border border-blue-500/30 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-sm"
                  disabled={updating}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleUpdateUser}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base text-white flex-1 justify-center"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={closeEditModal}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base text-white"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SUCCESS TOAST ══════════ */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
          <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-green-500/30 rounded-2xl px-4 py-3.5 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Success!</p>
              <p className="text-green-400 text-xs">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ERROR TOAST ══════════ */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(90vw,360px)]">
          <div className="bg-[#0a0f23]/95 backdrop-blur-xl border border-red-500/30 rounded-2xl px-4 py-3.5 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-center gap-3">
            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Error!</p>
              <p className="text-red-400 text-xs">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewUserModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f23] border border-blue-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">User Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Name</label><p className="text-white">{user.name || 'N/A'}</p></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Email</label><p className="text-white">{user.email || 'N/A'}</p></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Role</label><p className="text-white">{user.role || 'User'}</p></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Status</label><p className="text-white">{user.status || 'Active'}</p></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Joined</label><p className="text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p></div>
        </div>
      </div>
    </div>
  );
}

function EditUserModal({ user, form, setForm, isOpen, onClose, onSave }) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f23] border border-blue-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"><option value="user">User</option><option value="admin">Admin</option></select></div>
          <div><label className="block text-sm font-medium text-gray-400 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Save className="w-4 h-4" />Save Changes</button>
          <button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DeleteUserModal({ user, isOpen, onClose, onConfirm }) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f23] border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-600/20 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-400" /></div><h3 className="text-xl font-semibold text-white">Delete User</h3></div>
        <p className="text-gray-300 mb-6">Are you sure you want to delete <span className="text-white font-medium">{user.name}</span>? This action cannot be undone.</p>
        <div className="flex gap-3"><button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete User</button><button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">Cancel</button></div>
      </div>
    </div>
  );
}

function RoleModal({ user, role, setRole, isOpen, onClose, onSave }) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f23] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-600/20 rounded-lg"><Shield className="w-6 h-6 text-purple-400" /></div><h3 className="text-xl font-semibold text-white">Change User Role</h3></div>
        <p className="text-gray-300 mb-4">Change role for <span className="text-white font-medium">{user.name}</span></p>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-400 mb-2">Select Role</label><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"><option value="user">User</option><option value="admin">Admin</option><option value="moderator">Moderator</option></select></div>
        <div className="flex gap-3"><button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"><Save className="w-4 h-4" />Update Role</button><button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">Cancel</button></div>
      </div>
    </div>
  );
}

function StatusModal({ user, status, setStatus, isOpen, onClose, onSave }) {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0f23] border border-green-500/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-green-600/20 rounded-lg"><UserCheck className="w-6 h-6 text-green-400" /></div><h3 className="text-xl font-semibold text-white">Change User Status</h3></div>
        <p className="text-gray-300 mb-4">Change status for <span className="text-white font-medium">{user.name}</span></p>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-400 mb-2">Select Status</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option><option value="pending">Pending</option></select></div>
        <div className="flex gap-3"><button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><Save className="w-4 h-4" />Update Status</button><button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">Cancel</button></div>
      </div>
    </div>
  );
}