import { useState, useEffect } from 'react'
import { supabase, type Reservation } from '../lib/supabase'

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservation])
        .select()
        .single()

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchReservations()
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchReservations()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    try {
      // Préparer les données pour Supabase (convertir les noms de champs)
      const supabaseData: any = {};
      
      if (data.full_name !== undefined) supabaseData.full_name = data.full_name;
      if (data.email !== undefined) supabaseData.email = data.email;
      if (data.phone !== undefined) supabaseData.phone = data.phone;
      if (data.company !== undefined) supabaseData.company = data.company;
      if (data.activity !== undefined) supabaseData.activity = data.activity;
      if (data.occupants !== undefined) supabaseData.occupants = data.occupants;
      if (data.amount !== undefined) supabaseData.amount = data.amount;
      if (data.status !== undefined) supabaseData.status = data.status;
      if (data.payment_method !== undefined) supabaseData.payment_method = data.payment_method;
      if (data.notes !== undefined) supabaseData.notes = data.notes;
      if (data.admin_notes !== undefined) supabaseData.admin_notes = data.admin_notes;
      
      // Ajouter updated_at
      supabaseData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('reservations')
        .update(supabaseData)
        .eq('id', id)

      if (error) throw error
      
      // Rafraîchir la liste
      await fetchReservations()
    } catch (err) {
      console.error('Erreur updateReservation:', err);
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservationStatus,
    updateReservation,
    refetch: fetchReservations
  }
}