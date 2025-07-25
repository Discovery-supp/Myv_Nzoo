import React, { useState } from 'react';
import { Edit, Save, X, CheckCircle, XCircle, Clock, AlertCircle, Mail, Phone, Eye, Trash2 } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { type Reservation } from '../lib/supabase';

interface ReservationManagementProps {
  language: 'fr' | 'en';
}

const ReservationManagement: React.FC<ReservationManagementProps> = ({ language }) => {
  const { reservations, loading, error, updateReservationStatus, updateReservation, deleteReservation } = useReservations();
  const [editingReservation, setEditingReservation] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Reservation>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    fr: {
      title: 'Gestion des Réservations',
      search: 'Rechercher...',
      filter: 'Filtrer par statut',
      all: 'Toutes',
      pending: 'En attente',
      confirmed: 'Confirmées',
      cancelled: 'Annulées',
      completed: 'Terminées',
      edit: 'Modifier',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      view: 'Voir',
      contact: 'Contacter',
      status: 'Statut',
      client: 'Client',
      space: 'Espace',
      period: 'Période',
      amount: 'Montant',
      actions: 'Actions',
      noReservations: 'Aucune réservation trouvée',
      editReservation: 'Modifier la réservation',
      fullName: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      activity: 'Activité',
      occupants: 'Occupants',
      amount: 'Montant',
      paymentMethod: 'Méthode de paiement',
      notes: 'Notes',
      adminNotes: 'Notes admin'
    },
    en: {
      title: 'Reservation Management',
      search: 'Search...',
      filter: 'Filter by status',
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      view: 'View',
      contact: 'Contact',
      status: 'Status',
      client: 'Client',
      space: 'Space',
      period: 'Period',
      amount: 'Amount',
      actions: 'Actions',
      noReservations: 'No reservations found',
      editReservation: 'Edit reservation',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      activity: 'Activity',
      occupants: 'Occupants',
      amount: 'Amount',
      paymentMethod: 'Payment method',
      notes: 'Notes',
      adminNotes: 'Admin notes'
    }
  };

  const t = translations[language];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSpaceType = (spaceType: string) => {
    const types = {
      'coworking': 'Coworking',
      'bureau-prive': 'Bureau Privé',
      'salle-reunion': 'Salle Réunion'
    };
    return types[spaceType as keyof typeof types] || spaceType;
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation.id);
    setEditFormData({
      full_name: reservation.full_name,
      email: reservation.email,
      phone: reservation.phone,
      company: reservation.company,
      activity: reservation.activity,
      occupants: reservation.occupants,
      amount: reservation.amount,
      status: reservation.status,
      payment_method: reservation.payment_method,
      notes: reservation.notes || '',
      admin_notes: reservation.admin_notes || ''
    });
  };

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = async () => {
    if (!editingReservation) return;
    
    try {
      console.log('💾 Sauvegarde des données:', editFormData);
      await updateReservation(editingReservation, editFormData);
      showNotification('success', 'Réservation mise à jour avec succès');
      setEditingReservation(null);
      setEditFormData({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('error', 'Erreur lors de la sauvegarde: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleCancel = () => {
    setEditingReservation(null);
    setEditFormData({});
  };

  const handleStatusChange = async (reservationId: string, newStatus: Reservation['status']) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      showNotification('success', 'Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showNotification('error', 'Erreur lors du changement de statut');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      reservation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
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
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
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
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t.all}</option>
              <option value="pending">{t.pending}</option>
              <option value="confirmed">{t.confirmed}</option>
              <option value="completed">{t.completed}</option>
              <option value="cancelled">{t.cancelled}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>{t.noReservations}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.client}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.space}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.period}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.amount}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reservation.full_name}</div>
                        <div className="text-sm text-gray-500">{reservation.email}</div>
                        <div className="text-sm text-gray-500">{reservation.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatSpaceType(reservation.space_type)}</div>
                      <div className="text-sm text-gray-500">{reservation.occupants} personnes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.start_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        au {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${reservation.amount}</div>
                      <div className="text-sm text-gray-500">{reservation.payment_method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation.id, e.target.value as Reservation['status'])}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}
                      >
                        <option value="pending">{t.pending}</option>
                        <option value="confirmed">{t.confirmed}</option>
                        <option value="completed">{t.completed}</option>
                        <option value="cancelled">{t.cancelled}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{t.editReservation}</h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.fullName}
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_name || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.company}
                    </label>
                    <input
                      type="text"
                      value={editFormData.company || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.activity}
                    </label>
                    <input
                      type="text"
                      value={editFormData.activity || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, activity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.occupants}
                    </label>
                    <input
                      type="number"
                      value={editFormData.occupants || 1}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, occupants: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.amount}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.amount || 0}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.status}
                    </label>
                    <select
                      value={editFormData.status || 'pending'}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as Reservation['status'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">{t.pending}</option>
                      <option value="confirmed">{t.confirmed}</option>
                      <option value="completed">{t.completed}</option>
                      <option value="cancelled">{t.cancelled}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.notes}
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.adminNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.admin_notes || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;