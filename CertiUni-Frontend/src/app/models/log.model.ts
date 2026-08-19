export interface VerificationLog {
  id: string;
  time: string;
  diploma: string;
  student: string;
  status: 'VALID' | 'REVOKED' | 'NOT_FOUND';
  location: string;
  ip: string;
  browser: string;
  lat: number;
  lng: number;
}

export interface Notification {
  id: string;
  university_id: string;
  title: string;
  message: string;
  category: 'FINANCIAL' | 'SYSTEM' | 'SECURITY';
  is_read: boolean;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  threat_type: string;
  target_uuid: string;
  target_student: string;
  origin_ip: string;
  estimated_location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

export interface DesignTheme {
  trigger_keyword: string;
  primary_color: string;
  border_style: string;
  font_family: string;
  accent_color?: string;
}

export interface DashboardStats {
  total_certificates: number;
  total_scans: number;
  total_frauds: number;
  total_payments: number;
  total_revenue: number;
  weekly_activity: { day: string; scans: number; certificates: number }[];
}