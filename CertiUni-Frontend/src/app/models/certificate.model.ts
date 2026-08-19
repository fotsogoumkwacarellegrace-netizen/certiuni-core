export interface Certificate {
  id: string;
  university_id: string | null;
  student_id: string | null;
  course_title: string;
  final_grade: string;
  issue_date: string;
  certificat_hash: string;
  status: 'active' | 'revoque';
  payment_state: 'PENDING' | 'PAID' | 'EXEMPTED';
  pdf_url?: string | null;
  student_name?: string;
  university_name?: string;
  program?: string;
  faculty?: string;
  subjects?: Subject[];
}

export interface Subject {
  name: string;
  grade: string;
}

export interface VerificationResult {
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
  message: string;
  code: string;
  data: Certificate | null;
}

export interface BulkVerificationResult {
  uuid: string;
  status: string;
  name: string;
  diploma: string;
  university?: string;
  date?: string;
}