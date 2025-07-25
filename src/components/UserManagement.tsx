import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, User, Shield, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
  created_at: string;
  is_active: boolean;
}

interface UserManagementProps {
  language: 'fr' | 'en';
}

const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'user',
    full_name: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Charger les utilisateurs depuis la base de données
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  const translations = {
    fr: {
      title: 'Gestion des Utilisateurs',
      addUser: 'Ajouter un Utilisateur',
      editUser: 'Modifier l\'Utilisateur',
      form: {
        username: 'Nom d\'utilisateur',
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        role: 'Rôle',
        fullName: 'Nom complet',
        isActive: 'Utilisateur actif'
      },
      roles: {
        admin: 'Administrateur',
        user: 'Utilisateur'
      },
      actions: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        add: 'Ajouter'
      },
      messages: {
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        usernameRequired: 'Le nom d\'utilisateur est requis',
        emailRequired: 'L\'email est requis',
        emailExists: 'Cet email est déjà utilisé par un autre utilisateur',
        passwordRequired: 'Le mot de passe est requis',
        fullNameRequired: 'Le nom complet est requis',
        userCreated: 'Utilisateur créé avec succès',
        userUpdated: 'Utilisateur mis à jour avec succès',
        userDeleted: 'Utilisateur supprimé avec succès'
      },
      table: {
        username: 'Nom d\'utilisateur',
        email: 'Email',
        role: 'Rôle',
        fullName: 'Nom complet',
        status: 'Statut',
        created: 'Créé le',
        actions: 'Actions'
      },
      status: {
        active: 'Actif',
        inactive: 'Inactif'
      }
    },
    en: {
      title: 'User Management',
      addUser: 'Add User',
      editUser: 'Edit User',
      form: {
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        role: 'Role',
        fullName: 'Full Name',
        isActive: 'Active User'
      },
      roles: {
        admin: 'Administrator',
        user: 'User'
      },
      actions: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add'
      },
      messages: {
        confirmDelete: 'Are you sure you want to delete this user?',
        passwordMismatch: 'Passwords do not match',
        usernameRequired: 'Username is required',
        emailRequired: 'Email is required',
        emailExists: 'This email is already used by another user',
        passwordRequired: 'Password is required',
        fullNameRequired: 'Full name is required',
        userCreated: 'User created successfully',
        userUpdated: 'User updated successfully',
        userDeleted: 'User deleted successfully'
      },
      table: {
        username: 'Username',
        email: 'Email',
        role: 'Role',
        fullName: 'Full Name',
        status: 'Status',
        created: 'Created',
        actions: 'Actions'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      }
    }
  };

  const t = translations[language];

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      full_name: '',
      is_active: true
    });
    setFormErrors({});
    setEditingUser(null);
  };

  const validateForm = async () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = t.messages.usernameRequired;
    }

    if (!formData.email.trim()) {
      errors.email = t.messages.emailRequired;
    } else {
      // Check for duplicate email only when creating a new user or when email has changed
      try {
        const { data: existingUser, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', formData.email.trim())
          .neq('id', editingUser?.id || '')
          .limit(1);

        if (error) {
          console.error('Error checking email:', error);
        } else if (existingUser && existingUser.length > 0) {
          // Only show error if it's a different user with the same email
          if (!editingUser || existingUser[0].id !== editingUser.id) {
            errors.email = t.messages.emailExists;
          }
        }
      } catch (err) {
        console.error('Error validating email:', err);
      }
    }

    if (!editingUser && !formData.password.trim()) {
      errors.password = t.messages.passwordRequired;
    }

    if (!formData.full_name.trim()) {
      errors.fullName = t.messages.fullNameRequired;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t.messages.passwordMismatch;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    handleDatabaseOperation();
  };

  const handleDatabaseOperation = async () => {
    try {
      if (editingUser) {
        // Mettre à jour l'utilisateur existant
        const updateData: any = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          full_name: formData.full_name,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        };

        // Only update password if a new one is provided
        if (formData.password && formData.password.trim()) {
          updateData.password_hash = `temp_${formData.password}`;
        }

        console.log('🔄 Updating user with data:', updateData);

        const { error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('id', editingUser.id);

        if (error) {
          console.error('❌ Supabase update error:', error);
          throw error;
        }
        
        console.log('✅ User updated successfully');
        showNotification('success', t.messages.userUpdated);
      } else {
        // Créer un nouvel utilisateur
        // Note: En production, le mot de passe devrait être hashé côté serveur
        console.log('🔄 Creating new user with data:', formData);
        
        const { error } = await supabase
          .from('admin_users')
          .insert([{
            username: formData.username,
            email: formData.email,
            password_hash: `temp_${formData.password}`, // Temporaire pour le développement
            role: formData.role,
            full_name: formData.full_name,
            is_active: formData.is_active
          }]);

        if (error) {
          console.error('❌ Supabase insert error:', error);
          throw error;
        }
        
        console.log('✅ User created successfully');
        showNotification('success', t.messages.userCreated);
      }

      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'opération';
      console.error('❌ Database operation error:', err);
      showNotification('error', 'Erreur: ' + errorMessage);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      full_name: user.full_name,
      is_active: user.is_active
    });
    setFormErrors({}); // Clear any existing form errors
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(t.messages.confirmDelete)) {
      handleDeleteUser(user.id);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      showNotification('success', t.messages.userDeleted);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      showNotification('error', 'Erreur: ' + errorMessage);
      console.error('Erreur suppression:', err);
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        </div>
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Erreur de chargement</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-700' 
            : notification.type === 'error'
            ? 'bg-red-50 border-red-400 text-red-700'
            : 'bg-blue-50 border-blue-400 text-blue-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5 mr-2" />}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.addUser}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.username}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.email}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.fullName}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.role}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.created}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {t.roles[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.is_active)}`}>
                      {user.is_active ? t.status.active : t.status.inactive}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        disabled={user.username === 'admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingUser ? t.editUser : t.addUser}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.username} *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.username && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.email} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.fullName} *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.password} {!editingUser && '*'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required={!editingUser}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.confirmPassword} {!editingUser && '*'}
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required={!editingUser}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.role}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">{t.roles.user}</option>
                    <option value="admin">{t.roles.admin}</option>
                  </select>
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    {t.form.isActive}
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.actions.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t.actions.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;