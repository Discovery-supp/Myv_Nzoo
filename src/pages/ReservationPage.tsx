import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone, Banknote, AlertCircle, Clock } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createReservation } from '../services/reservationService';
import { getSpaceInfo } from '../data/spacesData';
import { motion } from 'framer-motion';
import { usePayment } from '../hooks/usePayment';
import CongoPaymentMethods from '../components/CongoPaymentMethods';
import { CONGO_PAYMENT_METHODS } from '../services/cinetpayService';

interface ReservationPageProps {
  language: 'fr' | 'en';
}

const ReservationPage: React.FC<ReservationPageProps> = ({ language }) => {
  const { spaceType } = useParams();
  const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    activity: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    occupants: 1,
    subscriptionType: 'daily',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  // Nouveaux états pour la gestion des réservations
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Hook de paiement CinetPay
  const {
    isLoading: paymentLoading,
    isProcessing: paymentProcessing,
    isChecking: checkingPayment,
    error: paymentError,
    paymentStatus,
    transactionId,
    initiatePayment,
    openPaymentWindow,
    startPaymentPolling,
    resetPayment
  } = usePayment();

  // --- Ajout useEffect pour forcer subscriptionType si bureau-prive ---
  useEffect(() => {
    if (spaceType === 'bureau-prive' && formData.subscriptionType === 'daily') {
      setFormData((prev) => ({ ...prev, subscriptionType: 'monthly' }));
    }
  }, [spaceType, formData.subscriptionType]);
  // --------------------------------------------------------------------

  const translations = {
    fr: {
      title: "Réservation d'Espace",
      steps: {
        selection: 'Sélection',
        details: 'Détails',
        payment: 'Paiement',
        confirmation: 'Confirmation',
      },
      form: {
        fullName: 'Nom Complet',
        activity: 'Activité',
        company: 'Entreprise',
        phone: 'Téléphone',
        email: 'Email',
        address: 'Adresse Physique',
        occupants: "Nombre d'Occupants",
        period: 'Période Souhaitée',
        subscriptionType: "Type d'Abonnement",
        daily: 'Journalier',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        hourly: 'Horaire',
      },
      payment: {
        title: 'Paiement Sécurisé',
        methods: 'Moyens de Paiement',
        mobileMoney: 'Mobile Money',
        visa: 'Carte VISA',
        cash: "Paiement en espèces",
        total: 'Total à Payer',
        processing: 'Traitement en cours...',
        checking: 'Vérification du paiement en cours...',
        error: 'Erreur de paiement : ',
        success: 'Paiement réussi !',
        failed: 'Paiement échoué',
        cancelled: 'Paiement annulé'
      },
      buttons: {
        next: 'Suivant',
        previous: 'Précédent',
        reserve: 'Réserver',
        pay: 'Payer Maintenant',
        newReservation: 'Nouvelle Réservation',
      },
      validation: {
        selectDates: 'Veuillez sélectionner les dates',
        fillRequired: 'Veuillez remplir tous les champs obligatoires',
        maxOccupants: "Nombre maximum d'occupants dépassé",
      },
      success: {
        title: 'Réservation Confirmée !',
        message:
          'Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation.',
        reference: 'Référence',
      },
    },
    en: {
      title: 'Space Reservation',
      steps: {
        selection: 'Selection',
        details: 'Details',
        payment: 'Payment',
        confirmation: 'Confirmation',
      },
      form: {
        fullName: 'Full Name',
        activity: 'Activity',
        company: 'Company',
        phone: 'Phone',
        email: 'Email',
        address: 'Physical Address',
        occupants: 'Number of Occupants',
        period: 'Desired Period',
        subscriptionType: 'Subscription Type',
        daily: 'Daily',
        monthly: 'Monthly',
        yearly: 'Yearly',
        hourly: 'Hourly',
      },
      payment: {
        title: 'Secure Payment',
        methods: 'Payment Methods',
        mobileMoney: 'Mobile Money',
        visa: 'VISA Card',
        cash: 'Cash Payment',
        total: 'Total to Pay',
        processing: 'Processing...',
        checking: 'Checking payment status...',
        error: 'Payment error: ',
        success: 'Payment successful!',
        failed: 'Payment failed',
        cancelled: 'Payment cancelled'
      },
      buttons: {
        next: 'Next',
        previous: 'Previous',
        reserve: 'Reserve',
        pay: 'Pay Now',
        newReservation: 'New Reservation',
      },
      validation: {
        selectDates: 'Please select dates',
        fillRequired: 'Please fill all required fields',
        maxOccupants: 'Maximum occupants exceeded',
      },
      success: {
        title: 'Reservation Confirmed!',
        message:
          'Your reservation has been successfully confirmed. You will receive a confirmation email.',
        reference: 'Reference',
      },
    },
  };

  const t = translations[language];
  
  // Obtenir les informations de l'espace depuis le fichier de données
  const spaceInfo = getSpaceInfo(spaceType || 'coworking', language);
  
  if (!spaceInfo) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {language === 'fr' ? 'Espace non trouvé' : 'Space not found'}
          </h1>
          <p className="mt-4">
            {language === 'fr' 
              ? 'L\'espace demandé n\'existe pas.' 
              : 'The requested space does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!selectedDates) return 0;

    const [startDate, endDate] = selectedDates;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (spaceType === 'salle-reunion') {
      return (spaceInfo.hourlyPrice || 0) * 8 * days; // 8 hours per day
    }

    switch (formData.subscriptionType) {
      case 'daily':
        return (spaceInfo.dailyPrice || 0) * days;
      case 'monthly':
        const months = Math.ceil(days / 30);
        return (spaceInfo.monthlyPrice || 0) * months;
      case 'yearly':
        const years = Math.ceil(days / 365);
        return (spaceInfo.yearlyPrice || 0) * years;
      default:
        return 0;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'occupants' ? Number(value) : value,
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedDates !== null;
      case 2:
        return (
          formData.fullName !== '' &&
          formData.email !== '' &&
          formData.phone !== '' &&
          formData.activity !== ''
        );
      case 3:
        return selectedPaymentMethod !== null && !paymentProcessing;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Gestion des paiements avec CinetPay
  const handleOnlinePayment = async () => {
    if (!selectedPaymentMethod || !selectedDates) return;
    
    const amount = calculateTotal();
    const currency = 'USD'; // CinetPay supporte USD pour le Congo
    
    // Déterminer le canal de paiement
    const paymentMethodData = CONGO_PAYMENT_METHODS[selectedPaymentMethod as keyof typeof CONGO_PAYMENT_METHODS];
    const channels = paymentMethodData?.code || 'ALL';
    
    const paymentData = {
      amount,
      currency,
      channels,
      description: `Réservation ${spaceInfo?.title} - ${spaceType}`,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      returnUrl: `${window.location.origin}/#/reservation/${spaceType}`,
      notifyUrl: `${window.location.origin}/webhook/cinetpay`
    };
    
    const result = await initiatePayment(paymentData);
    
    if (result.success && result.paymentUrl) {
      const payWindow = openPaymentWindow(result.paymentUrl);
      if (payWindow && result.transactionId) {
        setPaymentWindow(payWindow);
        startPaymentPolling(result.transactionId, payWindow);
      }
    }
  };

  const handleCashPayment = async () => {
    if (!selectedDates) return;

    setReservationError(null);

    const cashTransactionId = `CASH_${Date.now()}`;

    try {
      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        activity: formData.activity,
        address: formData.address,
        spaceType: spaceType || 'coworking',
        startDate: selectedDates[0].toISOString().split('T')[0],
        endDate: selectedDates[1].toISOString().split('T')[0],
        occupants: formData.occupants,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal(),
        paymentMethod: 'cash',
        transactionId: cashTransactionId,
      };

      const result = await createReservation(reservationData);
      
      if (result.success) {
        setReservationSuccess(true);
        setEmailSent(result.emailSent || false);
        setCurrentStep(4);
        
        // Afficher une notification si l'email n'a pas été envoyé
        if (!result.emailSent) {
          console.warn('⚠️ Email de confirmation non envoyé pour la réservation:', result.reservation?.id);
        }
      }
    } catch (error) {
      setReservationError(error instanceof Error ? error.message : 'Erreur lors de la réservation');
      console.error('❌ Erreur lors de la réservation cash:', error);
    }
  };

  // Gestion principale des réservations
  const handleReservation = () => {
    if (!selectedPaymentMethod) return;

    if (selectedPaymentMethod === 'CASH') {
      handleCashPayment();
    } else {
      handleOnlinePayment();
    }
  };

  // Effet pour gérer le succès du paiement
  useEffect(() => {
    if (paymentStatus === 'success') {
      setCurrentStep(4);
      setReservationSuccess(true);
    }
  }, [paymentStatus]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-7 h-7" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                currentStep > step 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-10">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{spaceInfo.title}</h3>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">{spaceInfo.description}</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Équipements Inclus</h4>
            <div className="space-y-3">
              {spaceInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Tarifs</h4>
            <div className="space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-200">
              {spaceInfo.dailyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Journalier:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.dailyPrice}</span>
                </div>
              )}
              {spaceInfo.monthlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mensuel:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.monthlyPrice}</span>
                </div>
              )}
              {spaceInfo.yearlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annuel:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.yearlyPrice}</span>
                </div>
              )}
              {spaceInfo.hourlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Horaire:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.hourlyPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-6 text-xl text-center">Sélectionner les Dates</h4>
        <div className="flex justify-center bg-gray-50 p-6 rounded-xl border border-gray-200">
          <ReactCalendar
            onChange={setSelectedDates}
            selectRange={true}
            value={selectedDates}
            minDate={new Date()}
            className="rounded-xl border-2 border-blue-200 shadow-lg"
          />
        </div>
        {!selectedDates && (
          <p className="text-red-600 mt-4 text-center font-medium">{t.validation.selectDates}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Informations Personnelles</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.fullName} *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label htmlFor="activity" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.activity} *
          </label>
          <input
            type="text"
            name="activity"
            id="activity"
            value={formData.activity}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.company}
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.phone} *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.email} *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="address" className="block text-sm font-semibold text-gray-600 mb-2">
          {t.form.address}
        </label>
        <textarea
          name="address"
          id="address"
          rows={3}
          value={formData.address}
          onChange={handleInputChange}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
        />
      </div>

      {spaceType !== 'salle-reunion' && (
        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 mt-6">
          <div>
            <label htmlFor="occupants" className="block text-sm font-semibold text-gray-600 mb-2">
              {t.form.occupants}
            </label>
            <input
              type="number"
              min={1}
              max={spaceInfo.maxOccupants}
              name="occupants"
              id="occupants"
              value={formData.occupants}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            {formData.occupants > spaceInfo.maxOccupants && (
              <p className="text-red-600 mt-2 font-medium">{t.validation.maxOccupants}</p>
            )}
          </div>

          <div>
            <label htmlFor="subscriptionType" className="block text-sm font-semibold text-gray-600 mb-2">
              {t.form.subscriptionType}
            </label>
            <select
              id="subscriptionType"
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              disabled={spaceType === 'bureau-prive'}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            >
              <option value="daily">{t.form.daily}</option>
              <option value="monthly">{t.form.monthly}</option>
              <option value="yearly">{t.form.yearly}</option>
            </select>
            {spaceType === 'bureau-prive' && (
              <p className="mt-2 text-sm italic text-gray-600 bg-orange-50 p-3 rounded-lg">
                {language === 'fr'
                  ? "Pour les bureaux privés, seul l'abonnement mensuel est disponible."
                  : "For private offices, only monthly subscription is available."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();

    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{t.payment.title}</h2>

        {/* Composant des moyens de paiement du Congo */}
        <CongoPaymentMethods
          selectedMethod={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
          language={language}
        />

        {/* Option paiement en espèces */}
        <div className="mt-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('CASH')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 ${
                selectedPaymentMethod === 'CASH'
                  ? 'bg-green-600 text-white border-green-600 shadow-xl ring-4 ring-green-200'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-green-600 hover:border-green-300 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className={`p-3 rounded-full transition-colors ${
                  selectedPaymentMethod === 'CASH'
                    ? 'bg-white/20'
                    : 'bg-green-100 dark:bg-green-900/20'
                }`}>
                  <Banknote className={`w-8 h-8 ${
                    selectedPaymentMethod === 'CASH' ? 'text-white' : 'text-green-600'
                  }`} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xl">{t.payment.cash}</h3>
                  <p className={`text-sm mt-1 ${
                    selectedPaymentMethod === 'CASH' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {language === 'fr' ? 'Paiement sur place' : 'Pay on-site'}
                  </p>
                </div>
                {selectedPaymentMethod === 'CASH' && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {selectedPaymentMethod === 'CASH' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 text-center font-medium">
              {language === 'fr'
                ? "Vous avez choisi de payer en espèces. Merci de régler sur place lors de votre arrivée."
                : "You have chosen to pay cash. Please pay on-site upon arrival."}
            </p>
          </div>
        )}

        {/* Statut du paiement */}
        {paymentStatus !== 'idle' && (
          <div className="mt-6">
            {paymentStatus === 'processing' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-blue-700 font-medium">{t.payment.processing}</p>
              </div>
            )}
            
            {paymentStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium">{t.payment.success}</p>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">{t.payment.failed}</p>
              </div>
            )}
            
            {paymentStatus === 'cancelled' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-orange-700 font-medium">{t.payment.cancelled}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Total à payer</p>
            <p className="text-3xl font-bold text-blue-600">
              {t.payment.total}: ${total}
            </p>
          </div>
        </div>

        {paymentError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold text-center">{t.payment.error + paymentError}</p>
          </div>
        )}

        {reservationError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold text-center">Erreur: {reservationError}</p>
          </div>
        )}

        {paymentProcessing && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-center font-medium">{t.payment.processing}</p>
          </div>
        )}
        {checkingPayment && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-700 text-center font-medium">{t.payment.checking}</p>
          </div>
        )}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-8 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <CheckCircle className="mx-auto w-24 h-24 text-green-500" />
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.success.title}</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{t.success.message}</p>
      
      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-green-700 font-medium">
            ✅ {language === 'fr' ? 'Email de confirmation envoyé avec succès' : 'Confirmation email sent successfully'}
          </p>
        </div>
      )}
      
      {!emailSent && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-orange-700 font-medium">
            ⚠️ {language === 'fr' 
              ? 'Réservation confirmée, mais email de confirmation non envoyé. Veuillez noter votre référence de réservation.' 
              : 'Reservation confirmed, but confirmation email not sent. Please note your reservation reference.'}
          </p>
          <p className="text-orange-600 text-sm mt-2">
            {language === 'fr' 
              ? 'Vous pouvez contacter notre support si vous avez besoin d\'une confirmation par email.' 
              : 'You can contact our support if you need an email confirmation.'}
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-gray-600 mb-2">Référence de votre réservation</p>
        <p className="text-xl font-bold text-blue-600 font-mono">{transactionId}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setCurrentStep(1);
          setSelectedDates(null);
          setFormData({
            fullName: '',
            activity: '',
            company: '',
            phone: '',
            email: '',
            address: '',
            occupants: 1,
            subscriptionType: 'daily',
          });
          setSelectedPaymentMethod(null);
          setReservationError(null);
          setReservationSuccess(false);
          setEmailSent(false);
          setPaymentWindow(null);
          resetPayment();
        }}
        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-700 font-sans">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Réservez votre espace de travail en quelques étapes simples
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 3) {
              handleReservation();
            } else {
              nextStep();
            }
          }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep !== 4 && (
            <div className="mt-12 flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
                  disabled={paymentProcessing}
                >
                  {t.buttons.previous}
                </button>
              )}
              
              {currentStep !== 3 && (
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                  disabled={!validateStep(currentStep) || paymentLoading}
                >
                  {t.buttons.next}
                </button>
              )}
              
              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleReservation}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                  disabled={paymentProcessing || paymentLoading || !selectedPaymentMethod}
                >
                  {paymentProcessing || paymentLoading ? 
                    (language === 'fr' ? 'Traitement...' : 'Processing...') : 
                    (selectedPaymentMethod === 'CASH' ? t.buttons.reserve : t.buttons.pay)
                  }
                </button>
              )}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ReservationPage;