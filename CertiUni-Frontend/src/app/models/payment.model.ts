export interface Payment {
  id: string;
  certificate_id: string;
  student_id: string;
  amount: number;
  gateway: 'MTN_MOMO' | 'ORANGE_MONEY' | 'CARD' | 'EXEMPTED';
  transaction_reference: string;
  is_successful: boolean;
  paid_at: string | null;
  status: 'PENDING' | 'PAID';
  phone?: string | null;
  receipt_pdf_url?: string | null;
  created_at: string;
}

export interface PaymentInitiateRequest {
  certificate_id: string;
  student_id: string;
  gateway: string;
  phone?: string;
  amount?: number;
}

export interface PaymentConfirmRequest {
  payment_id: string;
  otp?: string;
}