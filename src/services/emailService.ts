import emailjs from '@emailjs/browser';

interface EmailData {
  to_email: string;
  to_name: string;
  reservation_id: string;
  space_type: string;
  start_date: string;
  end_date: string;
  amount: number;
  payment_method: string;
  company?: string;
  activity: string;
  occupants: number;
}

export const sendReservationConfirmationEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('🔄 Tentative d\'envoi d\'email avec les données:', {
      ...data,
      // Ne pas logger l'email complet pour la sécurité
      to_email: data.to_email ? '***@***.***' : 'undefined'
    });
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    console.log('🔑 Configuration EmailJS:', { serviceId, templateId, publicKey: publicKey ? 'Défini' : 'Non défini' });

    if (!serviceId || !templateId || !publicKey) {
      console.warn('⚠️ Configuration EmailJS manquante:', {
        serviceId: serviceId ? 'Défini' : 'Manquant',
        templateId: templateId ? 'Défini' : 'Manquant',
        publicKey: publicKey ? 'Défini' : 'Manquant'
      });
      console.warn('⚠️ EmailJS non configuré - l\'email de confirmation ne sera pas envoyé');
      return false;
    }

    // Validation des données requises
    if (!data.to_email || !data.to_name) {
      throw new Error('Email ou nom du destinataire manquant');
    }

    // Nettoyer et valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.to_email)) {
      throw new Error('Format d\'email invalide: ' + data.to_email);
    }

    const templateParams = {
      // Paramètres principaux
      to_email: data.to_email.trim(),
      to_name: data.to_name.trim(),
      user_email: data.to_email.trim(),
      user_name: data.to_name.trim(),
      
      // Détails de la réservation
      reservation_id: data.reservation_id,
      space_type: data.space_type || 'Non spécifié',
      start_date: new Date(data.start_date).toLocaleDateString('fr-FR'),
      end_date: new Date(data.end_date).toLocaleDateString('fr-FR'),
      amount: data.amount?.toString() || '0',
      payment_method: data.payment_method === 'cash' ? 'Paiement en espèces' : 
                     data.payment_method === 'mobile_money' ? 'Mobile Money' :
                     data.payment_method === 'visa' ? 'Carte VISA' : 
                     data.payment_method || 'Non spécifié',
      company: data.company || 'Non spécifiée',
      activity: data.activity || 'Non spécifiée',
      occupants: data.occupants?.toString() || '1',
      
      // Message personnalisé
      message: `Votre réservation a été confirmée avec succès.\n\nRéférence: ${data.reservation_id}\nEspace: ${data.space_type}\nDu ${new Date(data.start_date).toLocaleDateString('fr-FR')} au ${new Date(data.end_date).toLocaleDateString('fr-FR')}\nMontant: $${data.amount}`,
      
      // Ajout de champs supplémentaires pour compatibilité
      from_name: 'Nzoo Immo',
      reply_to: 'contact@nzooimmo.com'
    };

    console.log('📧 Paramètres du template:', templateParams);

    // Initialiser EmailJS avec retry
    try {
      emailjs.init(publicKey);
      console.log('✅ EmailJS initialisé avec succès');
    } catch (initError) {
      console.error('❌ Erreur d\'initialisation EmailJS:', initError);
      throw new Error('Impossible d\'initialiser EmailJS');
    }

    // Envoyer l'email avec timeout et retry
    console.log('📤 Envoi de l\'email en cours...');
    
    const sendPromise = emailjs.send(serviceId, templateId, templateParams, publicKey);
    
    // Ajouter un timeout de 30 secondes
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: L\'envoi d\'email a pris trop de temps')), 30000);
    });
    
    await Promise.race([sendPromise, timeoutPromise]);
    
    console.log('✅ Email de confirmation envoyé avec succès');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    // Si c'est une erreur EmailJS spécifique
    if (typeof error === 'object' && error !== null && 'status' in error) {
      console.error('Détails de l\'erreur EmailJS:', JSON.stringify(error, null, 2));
      
      // Gestion des erreurs spécifiques EmailJS
      const emailError = error as any;
      if (emailError.status === 400) {
        console.error('❌ Erreur 400: Paramètres invalides ou template introuvable');
      } else if (emailError.status === 401) {
        console.error('❌ Erreur 401: Clé API invalide ou service non autorisé');
      } else if (emailError.status === 402) {
        console.error('❌ Erreur 402: Quota d\'emails dépassé');
      } else if (emailError.status >= 500) {
        console.error('❌ Erreur serveur EmailJS:', emailError.status);
      }
    }
    
    // Ne pas faire échouer la réservation si l'email échoue
    console.warn('⚠️ L\'email n\'a pas pu être envoyé, mais la réservation reste valide');
    return false;
  }
};