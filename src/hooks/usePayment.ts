import { useState, useCallback } from 'react';
import { cinetPayService, type PaymentRequest, type PaymentResponse } from '../services/cinetpayService';

export interface PaymentHookState {
  isLoading: boolean;
  isProcessing: boolean;
  isChecking: boolean;
  error: string | null;
  paymentUrl: string | null;
  paymentToken: string | null;
  transactionId: string | null;
  paymentStatus: 'idle' | 'initiated' | 'processing' | 'success' | 'failed' | 'cancelled';
}

export const usePayment = () => {
  const [state, setState] = useState<PaymentHookState>({
    isLoading: false,
    isProcessing: false,
    isChecking: false,
    error: null,
    paymentUrl: null,
    paymentToken: null,
    transactionId: null,
    paymentStatus: 'idle'
  });

  const resetPayment = useCallback(() => {
    setState({
      isLoading: false,
      isProcessing: false,
      isChecking: false,
      error: null,
      paymentUrl: null,
      paymentToken: null,
      transactionId: null,
      paymentStatus: 'idle'
    });
  }, []);

  const initiatePayment = useCallback(async (paymentData: Omit<PaymentRequest, 'transactionId'>) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      paymentStatus: 'initiated' 
    }));

    try {
      const transactionId = cinetPayService.generateTransactionId('NZOO');
      
      const response: PaymentResponse = await cinetPayService.initiatePayment({
        ...paymentData,
        transactionId
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        paymentUrl: response.data.payment_url,
        paymentToken: response.data.payment_token,
        transactionId,
        paymentStatus: 'processing'
      }));

      return {
        success: true,
        paymentUrl: response.data.payment_url,
        paymentToken: response.data.payment_token,
        transactionId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'initiation du paiement';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        paymentStatus: 'failed'
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const checkPaymentStatus = useCallback(async (transactionId: string) => {
    setState(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const statusResponse = await cinetPayService.checkPaymentStatus(transactionId);
      
      let newStatus: PaymentHookState['paymentStatus'] = 'processing';
      
      switch (statusResponse.data.status) {
        case 'ACCEPTED':
          newStatus = 'success';
          break;
        case 'REFUSED':
        case 'CANCELED':
          newStatus = 'failed';
          break;
        case 'PENDING':
          newStatus = 'processing';
          break;
      }

      setState(prev => ({
        ...prev,
        isChecking: false,
        paymentStatus: newStatus
      }));

      return {
        success: true,
        status: statusResponse.data.status,
        data: statusResponse.data
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la vérification du paiement';
      
      setState(prev => ({
        ...prev,
        isChecking: false,
        error: errorMessage
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const openPaymentWindow = useCallback((paymentUrl: string) => {
    const paymentWindow = window.open(
      paymentUrl,
      'cinetpay_payment',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    if (!paymentWindow) {
      setState(prev => ({
        ...prev,
        error: 'Impossible d\'ouvrir la fenêtre de paiement. Veuillez autoriser les pop-ups.'
      }));
      return null;
    }

    setState(prev => ({ ...prev, isProcessing: true }));
    return paymentWindow;
  }, []);

  const startPaymentPolling = useCallback((transactionId: string, paymentWindow: Window | null) => {
    const pollInterval = setInterval(async () => {
      // Vérifier si la fenêtre est fermée
      if (paymentWindow && paymentWindow.closed) {
        clearInterval(pollInterval);
        setState(prev => ({
          ...prev,
          isProcessing: false,
          paymentStatus: 'cancelled',
          error: 'Paiement annulé par l\'utilisateur'
        }));
        return;
      }

      // Vérifier le statut du paiement
      const result = await checkPaymentStatus(transactionId);
      
      if (result.success && result.status && ['ACCEPTED', 'REFUSED', 'CANCELED'].includes(result.status)) {
        clearInterval(pollInterval);
        setState(prev => ({ ...prev, isProcessing: false }));
        
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
        }
      }
    }, 3000); // Vérifier toutes les 3 secondes

    return pollInterval;
  }, [checkPaymentStatus]);

  return {
    ...state,
    initiatePayment,
    checkPaymentStatus,
    openPaymentWindow,
    startPaymentPolling,
    resetPayment
  };
};