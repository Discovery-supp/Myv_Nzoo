import { supabase } from '../lib/supabase';
import { sendReservationConfirmationEmail } from './emailService';

export interface ReservationData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  activity: string;
  address?: string;
  spaceType: string;
  startDate: string;
  endDate: string;
  occupants: number;
  subscriptionType: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export const createReservation = async (data: ReservationData) => {
  try {
    console.log('🔄 Création de réservation avec les données:', {
      ...data,
      email: data.email ? '***@***.***' : 'undefined' // Masquer l'email pour la sécurité
    });

    // Créer la réservation dans Supabase
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          activity: data.activity,
          address: data.address || null,
          space_type: data.spaceType,
          start_date: data.startDate,
          end_date: data.endDate,
          occupants: data.occupants,
          subscription_type: data.subscriptionType,
          amount: data.amount,
          status: data.paymentMethod === 'cash' ? 'confirmed' : 'pending',
          payment_status: data.paymentMethod === 'cash' ? 'pending' : 'pending',
          payment_method: data.paymentMethod,
          transaction_id: data.transactionId || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase lors de la création:', error);
      throw new Error(`Erreur lors de la création de la réservation: ${error.message}`);
    }

    console.log('✅ Réservation créée avec succès:', reservation.id);

    // Envoyer l'email de confirmation avec retry
    console.log('📧 Tentative d\'envoi d\'email de confirmation...');
    
    let emailSent = false;
    let emailAttempts = 0;
    const maxEmailAttempts = 3;
    
    while (!emailSent && emailAttempts < maxEmailAttempts) {
      emailAttempts++;
      console.log(`📧 Tentative d'envoi d'email ${emailAttempts}/${maxEmailAttempts}`);
      
      try {
        emailSent = await sendReservationConfirmationEmail({
          to_email: data.email,
          to_name: data.fullName,
          reservation_id: reservation.id,
          space_type: data.spaceType,
          start_date: data.startDate,
          end_date: data.endDate,
          amount: data.amount,
          payment_method: data.paymentMethod,
          company: data.company,
          activity: data.activity,
          occupants: data.occupants,
        });
        
        if (emailSent) {
          console.log(`✅ Email envoyé avec succès à la tentative ${emailAttempts}`);
          break;
        } else {
          console.warn(`⚠️ Échec de l'envoi d'email à la tentative ${emailAttempts}`);
          if (emailAttempts < maxEmailAttempts) {
            // Attendre 2 secondes avant la prochaine tentative
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (emailError) {
        console.error(`❌ Erreur lors de la tentative ${emailAttempts}:`, emailError);
        if (emailAttempts < maxEmailAttempts) {
          // Attendre 2 secondes avant la prochaine tentative
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!emailSent) {
      console.warn(`⚠️ Email de confirmation non envoyé après ${maxEmailAttempts} tentatives, mais réservation créée avec succès`);
      
      // Marquer dans la base de données que l'email n'a pas été envoyé
      try {
        const reason = !import.meta.env.VITE_EMAILJS_SERVICE_ID || 
                      !import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 
                      !import.meta.env.VITE_EMAILJS_PUBLIC_KEY 
                      ? 'Configuration EmailJS manquante' 
                      : 'Échec d\'envoi après plusieurs tentatives';
        
        await supabase
          .from('reservations')
          .update({ 
            admin_notes: `Email de confirmation non envoyé automatiquement (${reason}). Créé le ${new Date().toLocaleString('fr-FR')}` 
          })
          .eq('id', reservation.id);
      } catch (updateError) {
        console.error('❌ Erreur lors de la mise à jour des notes admin:', updateError);
      }
    }

    console.log('🎉 Processus de réservation terminé:', {
      reservationId: reservation.id,
      emailSent,
      emailAttempts
    });

    return {
      success: true,
      reservation,
      emailSent,
      emailAttempts
    };
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw error;
  }
};