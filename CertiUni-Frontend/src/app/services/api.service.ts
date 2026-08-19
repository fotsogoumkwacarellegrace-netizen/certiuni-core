import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, delay, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { University, UniversityRegistration } from '../models/university.model';
import { Certificate, VerificationResult, BulkVerificationResult } from '../models/certificate.model';
import { Student, StudentLoginResponse } from '../models/student.model';
import { Payment, PaymentInitiateRequest, PaymentConfirmRequest } from '../models/payment.model';
import { VerificationLog, Notification, SecurityAlert, DesignTheme, DashboardStats } from '../models/log.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  // Reactive state management with RxJS BehaviorSubject
  private attackDetectedSubject = new BehaviorSubject<boolean>(false);
  attackDetected$ = this.attackDetectedSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ============================================================
  // HEALTH & SYSTEM
  // ============================================================
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // UNIVERSITIES (Multi-Tenant)
  // ============================================================
  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}/universities`).pipe(
      catchError(this.handleError)
    );
  }

  getUniversity(id: string): Observable<University> {
    return this.http.get<University>(`${this.apiUrl}/universities/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  registerUniversity(data: UniversityRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/universities/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // CERTIFICATES & VERIFICATION
  // ============================================================
  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/certificates`).pipe(
      catchError(this.handleError)
    );
  }

  getCertificate(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  verifyCertificate(uuid: string): Observable<VerificationResult> {
    this.loadingSubject.next(true);
    return this.http.post<VerificationResult>(`${this.apiUrl}/verify`, { uuid }).pipe(
      delay(300), // Simulate network latency
      tap(() => this.loadingSubject.next(false)),
      catchError((error) => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  verifyBulk(uuids: string[]): Observable<{ results: BulkVerificationResult[] }> {
    return this.http.post<{ results: BulkVerificationResult[] }>(`${this.apiUrl}/verify/bulk`, { uuids }).pipe(
      catchError(this.handleError)
    );
  }

  revokeCertificate(id: string, reason: string, mfaCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/certificates/${id}/revoke`, { reason, mfa_code: mfaCode }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // STUDENTS & AUTH
  // ============================================================
  studentLogin(email: string): Observable<StudentLoginResponse> {
    return this.http.post<StudentLoginResponse>(`${this.apiUrl}/students/login`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getStudentCertificates(studentId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/students/${studentId}/certificates`).pipe(
      catchError(this.handleError)
    );
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // PAYMENTS & MONETIC
  // ============================================================
  initiatePayment(data: PaymentInitiateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/initiate`, data).pipe(
      catchError(this.handleError)
    );
  }

  confirmPayment(data: PaymentConfirmRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/confirm`, data).pipe(
      catchError(this.handleError)
    );
  }

  getStudentPayments(studentId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/student/${studentId}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // LOGS & ANALYTICS
  // ============================================================
  getLogs(): Observable<VerificationLog[]> {
    return this.http.get<VerificationLog[]>(`${this.apiUrl}/logs`).pipe(
      catchError(this.handleError)
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`).pipe(
      catchError(this.handleError)
    );
  }

  markNotificationRead(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // AI DESIGN STUDIO
  // ============================================================
  getDesignThemes(): Observable<DesignTheme[]> {
    return this.http.get<DesignTheme[]>(`${this.apiUrl}/design/themes`).pipe(
      catchError(this.handleError)
    );
  }

  generateDesign(prompt: string, templateName?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/design/generate`, { prompt, templateName }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // EXCEL IMPORT & IA QUALITY
  // ============================================================
  validateExcel(rows: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/excel/validate`, { rows }).pipe(
      catchError(this.handleError)
    );
  }

  importExcel(rows: any[], universityId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/excel/import`, { rows, university_id: universityId }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // SECURITY & CYBERSECURITY
  // ============================================================
  getSecurityAlerts(): Observable<{ attack_detected: boolean; alerts: SecurityAlert[] }> {
    return this.http.get<{ attack_detected: boolean; alerts: SecurityAlert[] }>(`${this.apiUrl}/security/alerts`).pipe(
      catchError(this.handleError)
    );
  }

  simulateAttack(): Observable<any> {
    return this.http.post(`${this.apiUrl}/security/simulate-attack`, {}).pipe(
      tap(() => this.attackDetectedSubject.next(true)),
      catchError(this.handleError)
    );
  }

  resolveAttack(action?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/security/resolve`, { action }).pipe(
      tap(() => this.attackDetectedSubject.next(false)),
      catchError(this.handleError)
    );
  }

  // ============================================================
  // SUPERADMIN
  // ============================================================
  getSuperAdminDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/superadmin/dashboard`).pipe(
      catchError(this.handleError)
    );
  }

  validateUniversity(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/superadmin/universities/${id}/validate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  banUniversity(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/superadmin/universities/${id}/ban`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================
  // ERROR HANDLING
  // ============================================================
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Erreur serveur (${error.status}): ${error.error?.error || error.message}`;
    }

    console.error('[CertiUni API]', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}