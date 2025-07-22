import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone, Banknote } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createReservation } from '../services/reservationService';
import { getSpaceInfo } from '../data/spacesData';

interface ReservationPageProps {
  language: 'fr' | 'en';
}

const CINETPAY_API_KEY = '17852597076873f647d76131.41366104';
const CINETPAY_SITE_ID = '105901836';

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
  // Ajout 'cash' ici
  const [paymentMethod, setPaymentMethod] = useState<'mobileMoney' | 'visa' | 'cash' | null>(null);

  // Nouveaux états pour paiement avancé
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Nouveaux états pour la gestion des réservations
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

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
        processing: 'Traitement du Paiement...',
        checking: 'Vérification du paiement en cours...',
        error: 'Erreur de paiement : ',
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
        processing: 'Processing Payment...',
        checking: 'Checking payment status...',
        error: 'Payment error: ',
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
        return paymentMethod !== null && !paymentProcessing;
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

  // ------------- DÉBUT intégration paiement CinetPay avancé -------------
  const initiatePayment = async () => {
    setPaymentProcessing(true);
    setPaymentError(null);

    const amount = calculateTotal();
    const currency = 'USD';
    const txId = `NzooImmo_${Date.now()}`;
    setTransactionId(txId);

    const channels = paymentMethod === 'visa' ? 'CARD' : 'MOBILE_MONEY';

    const payload = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id: txId,
      amount: amount,
      currency: currency,
      channels: channels,
      description: `Réservation ${spaceType}`,
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone_number: formData.phone,
      notify_url: 'https://ton-backend.com/api/cinetpay-notify', // à adapter à ton backend
      return_url: window.location.origin + '/reservation-complete',
    };

    try {
      const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.code !== '201') {
        setPaymentError(language === 'fr' ? "Erreur lors de l'initialisation du paiement." : 'Payment initialization error');
        setPaymentProcessing(false);
        return;
      }

      setPaymentToken(data.data.payment_token);

      const win = window.open(`https://payment.cinetpay.com/?payment_token=${data.data.payment_token}`, '_blank', 'width=600,height=700');
      if (!win) {
        setPaymentError(language === 'fr' ? "Impossible d'ouvrir la fenêtre de paiement. Autorisez les pop-ups." : 'Cannot open payment window. Allow pop-ups.');
        setPaymentProcessing(false);
        return;
      }
      setPaymentWindow(win);

      setCheckingPayment(true);
      checkPaymentStatus(txId, win);
    } catch (err) {
      setPaymentError(language === 'fr' ? 'Erreur de connexion au service de paiement.' : 'Payment service connection error');
      setPaymentProcessing(false);
    }
  };

  const checkPaymentStatus = (txId: string, win: Window | null) => {
    const intervalId = setInterval(async () => {
      if (win && win.closed) {
        clearInterval(intervalId);
        setPaymentProcessing(false);
        setCheckingPayment(false);
        setPaymentError(language === 'fr' ? "Paiement annulé par l'utilisateur." : 'Payment cancelled by user.');
        return;
      }

      try {
        const statusRes = await fetch(
          `https://api-checkout.cinetpay.com/v2/payment/check?apikey=${CINETPAY_API_KEY}&site_id=${CINETPAY_SITE_ID}&transaction_id=${txId}`
        );
        const statusData = await statusRes.json();

        if (statusData.code === '00' && statusData.data.status === 'ACCEPTED') {
          clearInterval(intervalId);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          if (win && !win.closed) win.close();
          setCurrentStep(4);
        } else if (statusData.data.status === 'REFUSED' || statusData.data.status === 'CANCELED') {
          clearInterval(intervalId);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          if (win && !win.closed) win.close();
          setPaymentError(language === 'fr' ? 'Paiement refusé ou annulé.' : 'Payment refused or cancelled.');
        }
      } catch (e) {
        // ignore network errors, continue checking
      }
    }, 5000);
  };

  // Modifié pour gérer paiement cash
  const handleReservation = () => {
    if (!paymentMethod) return;

    if (paymentMethod === 'cash') {
      handleCashPayment();
      return;
    }

    // Paiement en ligne via CinetPay
    initiatePayment();
  };

  const handleCashPayment = async () => {
    if (!selectedDates) return;

    setPaymentProcessing(true);
    setPaymentError(null);
    setReservationError(null);

    const transactionId = `CASH_${Date.now()}`;
    setTransactionId(transactionId);

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
        transactionId: transactionId,
      };

      const result = await createReservation(reservationData);
      
      if (result.success) {
        setReservationSuccess(true);
        setEmailSent(result.emailSent);
        setCurrentStep(4);
      }
    } catch (error) {
      setReservationError(error instanceof Error ? error.message : 'Erreur lors de la réservation');
    } finally {
      setPaymentProcessing(false);
    }
  };
  // ------------- FIN intégration paiement CinetPay avancé -------------

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg transform scale-110' 
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-7 h-7" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                currentStep > step 
                  ? 'bg-gradient-to-r from-secondary to-accent' 
                  : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-10">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 font-montserrat">{spaceInfo.title}</h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8 text-lg leading-relaxed">{spaceInfo.description}</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-lg font-montserrat">Équipements Inclus</h4>
            <div className="space-y-3">
              {spaceInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                  <span className="text-neutral-600 dark:text-neutral-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-lg font-montserrat">Tarifs</h4>
            <div className="space-y-3 bg-secondary/5 dark:bg-neutral-700 p-6 rounded-xl border border-secondary/20">
              {spaceInfo.dailyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-300">Journalier:</span>
                  <span className="font-bold text-secondary dark:text-neutral-200 text-lg font-montserrat">${spaceInfo.dailyPrice}</span>
                </div>
              )}
              {spaceInfo.monthlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-300">Mensuel:</span>
                  <span className="font-bold text-accent dark:text-neutral-200 text-lg font-montserrat">${spaceInfo.monthlyPrice}</span>
                </div>
              )}
              {spaceInfo.yearlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-300">Annuel:</span>
                  <span className="font-bold text-success dark:text-neutral-200 text-lg font-montserrat">${spaceInfo.yearlyPrice}</span>
                </div>
              )}
              {spaceInfo.hourlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-300">Horaire:</span>
                  <span className="font-bold text-warning dark:text-neutral-200 text-lg font-montserrat">${spaceInfo.hourlyPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
        <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-xl text-center font-montserrat">Sélectionner les Dates</h4>
        <div className="flex justify-center bg-secondary/5 dark:bg-neutral-700 p-6 rounded-xl border border-secondary/20">
          <ReactCalendar
            onChange={setSelectedDates}
            selectRange={true}
            value={selectedDates}
            minDate={new Date()}
            className="rounded-xl border-2 border-secondary/20 dark:border-neutral-600 shadow-lg"
          />
        </div>
        {!selectedDates && (
          <p className="text-danger mt-4 text-center font-medium">{t.validation.selectDates}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
      <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center font-montserrat">Informations Personnelles</h3>
      <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.fullName} *
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label htmlFor="activity" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.activity} *
        </label>
        <input
          type="text"
          name="activity"
          id="activity"
          value={formData.activity}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.company}
        </label>
        <input
          type="text"
          name="company"
          id="company"
          value={formData.company}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.phone} *
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.email} *
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
          required
        />
      </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
          {t.form.address}
        </label>
        <textarea
          name="address"
          id="address"
          rows={3}
          value={formData.address}
          onChange={handleInputChange}
          className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
        />
      </div>

      {spaceType !== 'salle-reunion' && (
        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-secondary/20 dark:border-neutral-600">
          <div>
            <label htmlFor="occupants" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
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
              className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
            />
            {formData.occupants > spaceInfo.maxOccupants && (
              <p className="text-danger mt-2 font-medium">{t.validation.maxOccupants}</p>
            )}
          </div>

          <div>
            <label htmlFor="subscriptionType" className="block text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
              {t.form.subscriptionType}
            </label>
            <select
              id="subscriptionType"
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              disabled={spaceType === 'bureau-prive'}
              className="block w-full rounded-xl border-2 border-secondary/20 dark:border-neutral-600 px-4 py-3 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-300"
            >
              <option value="daily">{t.form.daily}</option>
              <option value="monthly">{t.form.monthly}</option>
              <option value="yearly">{t.form.yearly}</option>
            </select>
            {spaceType === 'bureau-prive' && (
              <p className="mt-2 text-sm italic text-neutral-600 dark:text-neutral-400 bg-warning/10 dark:bg-warning/20 p-3 rounded-lg">
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
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100 font-montserrat">{t.payment.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Mobile Money Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('mobileMoney')}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              paymentMethod === 'mobileMoney'
                ? 'bg-gradient-to-br from-secondary to-accent text-white shadow-2xl ring-4 ring-secondary/20'
                : 'bg-secondary/5 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-secondary dark:text-neutral-300 hover:border-accent hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'mobileMoney'
                  ? 'bg-white/20'
                  : 'bg-secondary/10 dark:bg-accent/50 group-hover:bg-neutral-200'
              }`}>
                <Smartphone className={`w-10 h-10 ${
                  paymentMethod === 'mobileMoney' ? 'text-white' : 'text-secondary'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl font-montserrat">{t.payment.mobileMoney}</h3>
                <p className={`text-sm mt-2 ${
                  paymentMethod === 'mobileMoney' ? 'text-white/80' : 'text-neutral-500'
                }`}>
                  {language === 'fr' ? 'Orange Money, Airtel Money' : 'Orange Money, Airtel Money'}
                </p>
              </div>
            </div>
            {paymentMethod === 'mobileMoney' && (
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
              </div>
            )}
          </button>

          {/* Visa Card Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('visa')}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              paymentMethod === 'visa'
                ? 'bg-gradient-to-br from-success to-secondary text-white shadow-2xl ring-4 ring-success/20'
                : 'bg-success/5 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-success dark:text-neutral-300 hover:border-secondary hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'visa'
                  ? 'bg-white/20'
                  : 'bg-success/10 dark:bg-secondary/50 group-hover:bg-neutral-200'
              }`}>
                <CreditCard className={`w-10 h-10 ${
                  paymentMethod === 'visa' ? 'text-white' : 'text-success'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl font-montserrat">{t.payment.visa}</h3>
                <p className={`text-sm mt-2 ${
                  paymentMethod === 'visa' ? 'text-white/80' : 'text-neutral-500'
                }`}>
                  {language === 'fr' ? 'Visa, Mastercard' : 'Visa, Mastercard'}
                </p>
              </div>
            </div>
            {paymentMethod === 'visa' && (
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              </div>
            )}
          </button>

          {/* Cash Payment Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200 ${
              paymentMethod === 'cash'
                ? 'bg-gradient-to-br from-warning to-danger text-white shadow-2xl ring-4 ring-warning/20'
                : 'bg-warning/5 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 text-warning dark:text-neutral-300 hover:border-danger hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'cash'
                  ? 'bg-white/20'
                  : 'bg-warning/10 dark:bg-danger/50 group-hover:bg-neutral-200'
              }`}>
                <Banknote className={`w-10 h-10 ${
                  paymentMethod === 'cash' ? 'text-white' : 'text-warning'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl font-montserrat">{t.payment.cash}</h3>
                <p className={`text-sm mt-2 ${
                  paymentMethod === 'cash' ? 'text-white/80' : 'text-neutral-500'
                }`}>
                  {language === 'fr' ? 'Paiement sur place' : 'Pay on-site'}
                </p>
              </div>
            </div>
            {paymentMethod === 'cash' && (
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-warning" />
                </div>
              </div>
            )}
          </button>
        </div>

        {paymentMethod === 'cash' && (
          <div className="mt-6 p-4 bg-warning/10 dark:bg-warning/20 border border-warning/20 dark:border-warning/30 rounded-xl">
            <p className="text-warning dark:text-neutral-300 text-center font-medium">
            {language === 'fr'
              ? "Vous avez choisi de payer en espèces. Merci de régler sur place lors de votre arrivée."
              : "You have chosen to pay cash. Please pay on-site upon arrival."}
            </p>
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-r from-secondary/5 to-accent/5 dark:from-secondary/20 dark:to-accent/20 rounded-xl border border-secondary/20 dark:border-accent/30">
          <div className="text-center">
            <p className="text-neutral-600 dark:text-neutral-300 mb-2">Total à payer</p>
            <p className="text-3xl font-bold text-secondary dark:text-neutral-100 font-montserrat">
          {t.payment.total}: ${total}
            </p>
          </div>
        </div>

        {paymentError && (
          <div className="mt-6 p-4 bg-danger/10 dark:bg-danger/20 border border-danger/20 dark:border-danger/30 rounded-xl">
            <p className="text-danger dark:text-danger font-semibold text-center">{t.payment.error + paymentError}</p>
          </div>
        )}

        {reservationError && (
          <div className="mt-6 p-4 bg-danger/10 dark:bg-danger/20 border border-danger/20 dark:border-danger/30 rounded-xl">
            <p className="text-danger dark:text-danger font-semibold text-center">Erreur: {reservationError}</p>
          </div>
        )}

        {paymentProcessing && (
          <div className="mt-6 p-4 bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 rounded-xl">
            <p className="text-secondary dark:text-neutral-300 text-center font-medium">{t.payment.processing}</p>
          </div>
        )}
        {checkingPayment && (
          <div className="mt-4 p-4 bg-warning/10 dark:bg-warning/20 border border-warning/20 dark:border-warning/30 rounded-xl">
            <p className="text-warning dark:text-warning text-center font-medium">{t.payment.checking}</p>
          </div>
        )}

      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-8 p-12 bg-gradient-to-br from-success/5 to-secondary/5 dark:from-success/20 dark:to-secondary/20 rounded-2xl shadow-2xl border-2 border-success/20 dark:border-secondary/30">
      <div className="relative">
        <div className="absolute inset-0 bg-success/20 dark:bg-secondary/30 rounded-full blur-xl"></div>
        <CheckCircle className="relative mx-auto w-24 h-24 text-success" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 font-montserrat">{t.success.title}</h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">{t.success.message}</p>
      
      {emailSent && (
        <div className="bg-success/10 dark:bg-success/30 border border-success/20 dark:border-success/30 rounded-xl p-6">
          <p className="text-success dark:text-neutral-300 font-medium">
            ✅ Email de confirmation envoyé avec succès
          </p>
        </div>
      )}
      
      {!emailSent && (
        <div className="bg-warning/10 dark:bg-warning/30 border border-warning/20 dark:border-warning/30 rounded-xl p-6">
          <p className="text-warning dark:text-warning font-medium">
            ⚠️ Réservation confirmée, mais email non envoyé
          </p>
        </div>
      )}
      
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <p className="text-neutral-600 dark:text-neutral-300 mb-2">Référence de votre réservation</p>
        <p className="text-xl font-bold text-secondary dark:text-neutral-100 font-mono">{transactionId}</p>
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
          setPaymentMethod(null);
          setPaymentError(null);
          setTransactionId(null);
          setReservationError(null);
          setReservationSuccess(false);
          setEmailSent(false);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          setPaymentWindow(null);
        }}
        className="px-8 py-4 bg-gradient-to-r from-secondary to-accent text-white rounded-xl hover:from-accent hover:to-secondary transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-poppins">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-montserrat">
            {t.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

      {renderStepIndicator()}

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
          <div className="mt-12 flex justify-between items-center bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg border border-secondary/20 dark:border-neutral-700">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-secondary/5 dark:bg-neutral-700 text-secondary dark:text-neutral-300 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-300 font-medium"
                disabled={paymentProcessing}
              >
                {t.buttons.previous}
              </button>
            )}
            
            {currentStep !== 3 && (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-xl hover:from-accent hover:to-secondary ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                disabled={!validateStep(currentStep)}
              >
                {t.buttons.next}
              </button>
            )}
            
            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleReservation}
                className="px-8 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-xl hover:from-accent hover:to-secondary ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                disabled={paymentProcessing || !paymentMethod}
              >
                {paymentProcessing ? 
                  (language === 'fr' ? 'Traitement...' : 'Processing...') : 
                  (paymentMethod === 'cash' ? t.buttons.reserve : t.buttons.pay)
                }
              </button>
            )}
          </div>
        )}
      </form>
      </div>
    </main>
  );
};

export default ReservationPage;