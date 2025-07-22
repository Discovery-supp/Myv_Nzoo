// Service CinetPay pour les paiements au Congo
export interface CinetPayConfig {
  apiKey: string;
  siteId: string;
  environment: 'sandbox' | 'production';
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  transactionId: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
  channels: string; // 'MOBILE_MONEY' | 'CARD' | 'ALL'
}

export interface PaymentResponse {
  code: string;
  message: string;
  data: {
    payment_token: string;
    payment_url: string;
  };
}

export interface PaymentStatusResponse {
  code: string;
  message: string;
  data: {
    cpm_trans_id: string;
    cpm_trans_date: string;
    cpm_amount: number;
    cpm_currency: string;
    cpm_payid: string;
    signature: string;
    payment_method: string;
    cel_phone_num: string;
    cpm_phone_prefixe: string;
    cpm_language: string;
    cpm_version: string;
    cpm_payment_config: string;
    cpm_page_action: string;
    cpm_custom: string;
    cpm_designation: string;
    buyer_name: string;
    status: 'ACCEPTED' | 'REFUSED' | 'CANCELED' | 'PENDING';
  };
}

class CinetPayService {
  private config: CinetPayConfig;
  private baseUrl: string;

  constructor(config: CinetPayConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api-checkout.cinetpay.com/v2'
      : 'https://api-checkout.cinetpay.com/v2';
  }

  /**
   * Initier un paiement
   */
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        apikey: this.config.apiKey,
        site_id: this.config.siteId,
        transaction_id: paymentData.transactionId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        channels: paymentData.channels,
        description: paymentData.description,
        customer_name: paymentData.customerName,
        customer_email: paymentData.customerEmail,
        customer_phone_number: paymentData.customerPhone,
        notify_url: paymentData.notifyUrl,
        return_url: paymentData.returnUrl,
        lang: 'fr'
      };

      console.log('🔄 Initiation du paiement CinetPay:', payload);

      const response = await fetch(`${this.baseUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaymentResponse = await response.json();
      
      if (data.code !== '201') {
        throw new Error(`CinetPay Error: ${data.message}`);
      }

      console.log('✅ Paiement initié avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initiation du paiement:', error);
      throw error;
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      const url = `${this.baseUrl}/payment/check?apikey=${this.config.apiKey}&site_id=${this.config.siteId}&transaction_id=${transactionId}`;
      
      console.log('🔍 Vérification du statut du paiement:', transactionId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaymentStatusResponse = await response.json();
      console.log('📊 Statut du paiement:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du statut:', error);
      throw error;
    }
  }

  /**
   * Obtenir les moyens de paiement disponibles
   */
  getAvailableChannels() {
    return {
      MOBILE_MONEY: {
        name: 'Mobile Money',
        providers: ['Orange Money', 'Airtel Money', 'M-Pesa'],
        icon: '📱'
      },
      CARD: {
        name: 'Carte Bancaire',
        providers: ['Visa', 'Mastercard'],
        icon: '💳'
      }
    };
  }

  /**
   * Formater le montant pour CinetPay
   */
  formatAmount(amount: number): number {
    // CinetPay accepte les montants en centimes pour certaines devises
    return Math.round(amount * 100) / 100;
  }

  /**
   * Générer un ID de transaction unique
   */
  generateTransactionId(prefix: string = 'NZOO'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}`;
  }
}

// Configuration par défaut pour le Congo
export const cinetPayConfig: CinetPayConfig = {
  apiKey: import.meta.env.VITE_CINETPAY_API_KEY || '',
  siteId: import.meta.env.VITE_CINETPAY_SITE_ID || '',
  environment: import.meta.env.VITE_CINETPAY_ENV === 'production' ? 'production' : 'sandbox'
};

// Instance singleton du service
export const cinetPayService = new CinetPayService(cinetPayConfig);

// Devises supportées au Congo
export const CONGO_CURRENCIES = {
  CDF: 'Franc Congolais',
  USD: 'Dollar Américain',
  EUR: 'Euro'
};

// Moyens de paiement populaires au Congo
export const CONGO_PAYMENT_METHODS = {
  ORANGE_MONEY: {
    name: 'Orange Money',
    code: 'MOBILE_MONEY',
    color: 'orange',
    icon: '📱'
  },
  AIRTEL_MONEY: {
    name: 'Airtel Money',
    code: 'MOBILE_MONEY', 
    color: 'red',
    icon: '📱'
  },
  MPESA: {
    name: 'M-Pesa',
    code: 'MOBILE_MONEY',
    color: 'green', 
    icon: '📱'
  },
  VISA: {
    name: 'Carte Visa',
    code: 'CARD',
    color: 'blue',
    icon: '💳'
  },
  MASTERCARD: {
    name: 'Mastercard',
    code: 'CARD',
    color: 'red',
    icon: '💳'
  }
};