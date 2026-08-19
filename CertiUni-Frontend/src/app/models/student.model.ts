import { Certificate } from './certificate.model';

export interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  certificates: Certificate[];
}

export interface StudentLoginResponse {
  success: boolean;
  message: string;
  magic_link: string;
  student: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}