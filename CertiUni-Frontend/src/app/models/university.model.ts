export interface University {
  id: string;
  name: string;
  acronym: string;
  official_email_domain: string;
  logo_url: string;
  environment_mode: 'SANDBOX' | 'PRODUCTION' | 'BANNED';
  is_billing_student: boolean;
  ministerial_decree?: string;
  doan_signature?: string;
  created_at: string;
}

export interface UniversityRegistration {
  name: string;
  acronym: string;
  email: string;
  official_email_domain: string;
  logo_url?: string;
}