import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/verify', pathMatch: 'full' },

  // ============================================================
  // MODULE 1: PORTAIL PUBLIC & ANONYME (/verify)
  // ============================================================
  {
    path: 'verify',
    loadComponent: () => import('./public/verify-home/verify-home.component')
      .then(m => m.VerifyHomeComponent),
  },
  {
    path: 'verify/scan',
    loadComponent: () => import('./public/scan-camera/scan-camera.component')
      .then(m => m.ScanCameraComponent),
  },
  {
    path: 'verify/ocr',
    loadComponent: () => import('./public/scanner-ocr/scanner-ocr.component')
      .then(m => m.ScannerOcrComponent),
  },
  {
    path: 'verify/bulk',
    loadComponent: () => import('./public/bulk-verification/bulk-verification.component')
      .then(m => m.BulkVerificationComponent),
  },
  {
    path: 'verify/:id',
    loadComponent: () => import('./public/verify-verdict/verify-verdict.component')
      .then(m => m.VerifyVerdictComponent),
  },

  // ============================================================
  // MODULE 2: PORTEFEUILLE ÉTUDIANT (/student)
  // ============================================================
  {
    path: 'student/login',
    loadComponent: () => import('./student/student-login/student-login.component')
      .then(m => m.StudentLoginComponent),
  },
  {
    path: 'student/dashboard',
    loadComponent: () => import('./student/student-dashboard/student-dashboard.component')
      .then(m => m.StudentDashboardComponent),
  },
  {
    path: 'student/receipt/:id',
    loadComponent: () => import('./student/payment-receipt/payment-receipt.component')
      .then(m => m.PaymentReceiptComponent),
  },
  {
    path: 'student/archive',
    loadComponent: () => import('./student/student-archive/student-archive.component')
      .then(m => m.StudentArchiveComponent),
  },
  {
    path: 'student/print/:id',
    loadComponent: () => import('./student/pdf-print/pdf-print.component')
      .then(m => m.PdfPrintComponent),
  },

  // ============================================================
  // MODULE 3: ADMINISTRATION UNIVERSITÉ (/admin)
  // ============================================================
  {
    path: 'admin/register',
    loadComponent: () => import('./admin/uni-register/uni-register.component')
      .then(m => m.UniRegisterComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/admin-login/admin-login.component')
      .then(m => m.AdminLoginComponent),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
  },
  {
    path: 'admin/templates',
    loadComponent: () => import('./admin/design-studio/design-studio.component')
      .then(m => m.DesignStudioComponent),
  },
  {
    path: 'admin/integrations',
    loadComponent: () => import('./admin/school-center/school-center.component')
      .then(m => m.SchoolCenterComponent),
  },
  {
    path: 'admin/messages',
    loadComponent: () => import('./admin/message-center/message-center.component')
      .then(m => m.MessageCenterComponent),
  },
  {
    path: 'admin/security',
    loadComponent: () => import('./admin/security-alert/security-alert.component')
      .then(m => m.SecurityAlertComponent),
  },

  // ============================================================
  // MODULE 4: SUPERADMIN (/superadmin)
  // ============================================================
  {
    path: 'superadmin/console',
    loadComponent: () => import('./superadmin/console/console.component')
      .then(m => m.ConsoleComponent),
  },
  {
    path: 'superadmin/emergency',
    loadComponent: () => import('./superadmin/emergency/emergency.component')
      .then(m => m.EmergencyComponent),
  },

  // ============================================================
  // FALLBACK
  // ============================================================
  { path: '**', redirectTo: '/verify' },
];
