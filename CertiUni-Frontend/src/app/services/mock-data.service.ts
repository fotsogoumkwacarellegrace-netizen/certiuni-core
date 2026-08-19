import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { University } from '../models/university.model';
import { Certificate, VerificationResult, BulkVerificationResult } from '../models/certificate.model';
import { Student } from '../models/student.model';
import { Payment } from '../models/payment.model';
import { VerificationLog, Notification, SecurityAlert, DesignTheme } from '../models/log.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  // Local simulation data (mirrors mock-data.json)
  private universities: University[] = [
    {
      id: 'univ-douala-01',
      name: 'Université de Douala',
      acronym: 'UDs',
      official_email_domain: '@univ-douala.cm',
      logo_url: 'assets/logos/univ-douala.png',
      environment_mode: 'PRODUCTION',
      is_billing_student: true,
      created_at: '2026-01-15T09:00:00Z'
    },
    {
      id: 'univ-yaounde-02',
      name: 'Université de Yaoundé I',
      acronym: 'UY1',
      official_email_domain: '@univ-yaounde1.cm',
      logo_url: 'assets/logos/univ-yaounde1.png',
      environment_mode: 'SANDBOX',
      is_billing_student: false,
      created_at: '2026-03-20T10:30:00Z'
    }
  ];

  private students: Student[] = [
    {
      id: 'stud-ngo-89',
      email: 'marie.ngo@univ-douala.cm',
      first_name: 'Marie',
      last_name: 'Ngo',
      phone: '+237 690 123 456',
      created_at: '2026-05-10T08:00:00Z',
      certificates: [
        {
          id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
          university_id: 'univ-douala-01',
          student_id: 'stud-ngo-89',
          course_title: 'Master en Génie Logiciel',
          final_grade: '16.5/20 (Mention Très Bien)',
          issue_date: '2026-07-15',
          certificat_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: 'active',
          payment_state: 'PAID',
          pdf_url: 'assets/docs/diploma_marie_ngo.pdf',
          university_name: 'Université de Douala',
          student_name: 'Marie Ngo',
          program: 'Master',
          faculty: 'Faculté des Sciences',
          subjects: [
            { name: 'Algorithmique Avancée', grade: '17/20' },
            { name: 'Architecture Logicielle', grade: '16/20' },
            { name: 'Bases de Données', grade: '18/20' },
            { name: 'Génie Logiciel', grade: '15/20' }
          ]
        },
        {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          university_id: 'univ-douala-01',
          student_id: 'stud-ngo-89',
          course_title: 'Certification Expert Python',
          final_grade: '94% de réussite',
          issue_date: '2026-08-01',
          certificat_hash: '8f485f4728514589a1846b9a32c2563e41b2569c4f1589da41c25893e41c4589',
          status: 'active',
          payment_state: 'PENDING',
          pdf_url: null,
          university_name: 'CertiUni Academy',
          student_name: 'Marie Ngo',
          program: 'Certification',
          faculty: 'Informatique',
          subjects: [
            { name: 'Python Fondamentaux', grade: '95%' },
            { name: 'Programmation Orientée Objet', grade: '92%' },
            { name: 'Analyse de Données', grade: '94%' }
          ]
        }
      ]
    },
    {
      id: 'stud-modo-12',
      email: 'jean.modo@univ-yaounde1.cm',
      first_name: 'Jean',
      last_name: 'Modo',
      phone: '+237 677 890 123',
      created_at: '2026-05-22T09:15:00Z',
      certificates: [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          university_id: 'univ-yaounde-02',
          student_id: 'stud-modo-12',
          course_title: 'Licence en Sciences Économiques',
          final_grade: '12.0/20 (Mention Passable)',
          issue_date: '2026-07-20',
          certificat_hash: 'ca7f70c565bd256cb76e2ef3c8d1d86d654158cfc258df361c4581f216259d33',
          status: 'active',
          payment_state: 'EXEMPTED',
          pdf_url: 'assets/docs/diploma_jean_modo.pdf',
          university_name: 'Université de Yaoundé I',
          student_name: 'Jean Modo',
          program: 'Licence',
          faculty: 'Faculté des Sciences Économiques',
          subjects: [
            { name: 'Microéconomie', grade: '13/20' },
            { name: 'Macroéconomie', grade: '11/20' },
            { name: 'Statistiques', grade: '12/20' }
          ]
        }
      ]
    }
  ];

  private certificates: Certificate[] = [
    ...this.students.flatMap(s => s.certificates),
    {
      id: 'f0000000-0000-0000-0000-000000000000',
      university_id: null,
      student_id: null,
      course_title: 'Faux Diplôme',
      final_grade: 'N/A',
      issue_date: 'N/A',
      certificat_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      status: 'revoque',
      payment_state: 'EXEMPTED',
      student_name: 'Alain Tchakounté'
    }
  ];

  private bulkResults: BulkVerificationResult[] = [
    { uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', name: 'Marie Ngo', diploma: 'Master Génie Logiciel', status: 'VALID', university: 'Université de Douala', date: '2026-07-15' },
    { uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', name: 'Jean Modo', diploma: 'Licence Sc. Économiques', status: 'VALID', university: 'Université de Yaoundé I', date: '2026-07-20' },
    { uuid: 'c1a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', name: 'Pauline Etoundi', diploma: 'Master Droit des Affaires', status: 'VALID', university: 'Université de Douala', date: '2026-06-30' },
    { uuid: 'd2e3f4a5-b6c7-d8e9-f0a1-b2c3d4e5f6a7', name: 'Samuel Kamga', diploma: 'Licence Biologie', status: 'VALID', university: 'Université de Yaoundé I', date: '2026-07-10' },
    { uuid: 'f0000000-0000-0000-0000-000000000000', name: 'Alain Tchakounté', diploma: 'Faux Diplôme Détecté', status: 'REVOKED', university: 'Inconnu', date: 'N/A' },
    { uuid: 'e4444444-4444-4444-4444-444444444444', name: 'Inconnu', diploma: 'Code Inexistant', status: 'NOT_FOUND', university: 'Inconnu', date: 'N/A' }
  ];

  private logs: VerificationLog[] = [
    { id: 'log-001', time: '15:14:22', diploma: 'Master Génie Logiciel', student: 'Marie Ngo', status: 'VALID', location: 'Cameroun (Douala)', ip: '41.202.160.10', browser: 'Chrome 126', lat: 4.0511, lng: 9.7679 },
    { id: 'log-002', time: '14:30:05', diploma: 'Licence Sc. Économiques', student: 'Jean Modo', status: 'VALID', location: 'France (Paris)', ip: '90.63.120.45', browser: 'Firefox 127', lat: 48.8566, lng: 2.3522 },
    { id: 'log-003', time: '11:15:40', diploma: 'ID: f0000000...', student: 'Inconnu', status: 'NOT_FOUND', location: 'Canada (Montréal)', ip: '24.201.10.88', browser: 'Safari 17', lat: 45.5019, lng: -73.5674 }
  ];

  private notifications: Notification[] = [
    {
      id: 'notif-001',
      university_id: 'univ-douala-01',
      title: 'Paiement reçu — Marie Ngo',
      message: 'La transaction MTN MoMo de 1 000 FCFA pour le diplôme Master en Génie Logiciel a été validée.',
      category: 'FINANCIAL',
      is_read: false,
      created_at: '2026-07-15T14:22:10Z'
    },
    {
      id: 'notif-002',
      university_id: 'univ-douala-01',
      title: 'Alerte système — Pic de trafic',
      message: 'Détection d\'un volume inhabituel de vérifications (120 requêtes/minute) depuis une IP localisée à Douala.',
      category: 'SYSTEM',
      is_read: true,
      created_at: '2026-08-14T18:00:00Z'
    },
    {
      id: 'notif-003',
      university_id: 'univ-douala-01',
      title: 'Alerte sécurité — Tentative de force brute',
      message: 'Plus de 10 tentatives de vérification infructueuses détectées sur le diplôme de Marie Ngo depuis la Chine.',
      category: 'SECURITY',
      is_read: false,
      created_at: '2026-08-15T23:14:22Z'
    }
  ];

  private securityAlerts: SecurityAlert[] = [
    {
      id: 'alert-99',
      threat_type: 'Attaque par Force Brute (Brute Force)',
      target_uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      target_student: 'Marie Ngo',
      origin_ip: '198.51.100.42',
      estimated_location: 'Chine (Shenzhen)',
      severity: 'CRITICAL',
      timestamp: '2026-08-15T23:14:22Z'
    }
  ];

  private designThemes: DesignTheme[] = [
    { trigger_keyword: 'medecine', primary_color: '#065F46', border_style: '2px double #D97706', font_family: 'Georgia, serif', accent_color: '#D97706' },
    { trigger_keyword: 'informatique', primary_color: '#1E3A8A', border_style: '3px solid #1E3A8A', font_family: 'Inter, sans-serif', accent_color: '#3B82F6' },
    { trigger_keyword: 'droit', primary_color: '#7F1D1D', border_style: '3px double #B91C1C', font_family: 'Palatino, serif', accent_color: '#DC2626' }
  ];

  private payments: Payment[] = [
    {
      id: 'pay-001',
      certificate_id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      student_id: 'stud-ngo-89',
      amount: 1000,
      gateway: 'MTN_MOMO',
      transaction_reference: 'MTN-CU-2026-000125',
      is_successful: true,
      paid_at: '2026-07-15T14:22:10Z',
      status: 'PAID',
      receipt_pdf_url: 'assets/docs/receipt_pay_001.pdf',
      created_at: '2026-07-15T14:20:00Z'
    }
  ];

  // ============================================================
  // OBSERVABLE DATA METHODS (RxJS)
  // ============================================================

  getUniversities(): Observable<University[]> {
    return of([...this.universities]).pipe(delay(200));
  }

  getStudents(): Observable<Student[]> {
    return of([...this.students]).pipe(delay(200));
  }

  getCertificates(): Observable<Certificate[]> {
    return of([...this.certificates]).pipe(delay(200));
  }

  getCertificateById(id: string): Observable<Certificate | undefined> {
    return of(this.certificates.find(c => c.id === id)).pipe(delay(200));
  }

  getBulkResults(): Observable<BulkVerificationResult[]> {
    return of([...this.bulkResults]).pipe(delay(200));
  }

  getLogs(): Observable<VerificationLog[]> {
    return of([...this.logs]).pipe(delay(200));
  }

  getNotifications(): Observable<Notification[]> {
    return of([...this.notifications]).pipe(delay(200));
  }

  getSecurityAlerts(): Observable<SecurityAlert[]> {
    return of([...this.securityAlerts]).pipe(delay(200));
  }

  getDesignThemes(): Observable<DesignTheme[]> {
    return of([...this.designThemes]).pipe(delay(200));
  }

  getPayments(): Observable<Payment[]> {
    return of([...this.payments]).pipe(delay(200));
  }

  // ============================================================
  // SIMULATION HELPERS
  // ============================================================

  verifyCertificate(uuid: string): Observable<VerificationResult> {
    const cert = this.certificates.find(c => c.id === uuid);

    if (!cert) {
      const result: VerificationResult = {
        status: 'NOT_FOUND',
        message: 'CODE INCONNU — RISQUE ÉLEVÉ DE FALSIFICATION',
        code: uuid,
        data: null
      };
      return of(result).pipe(delay(500));
    }

    if (cert.status === 'revoque') {
      const result: VerificationResult = {
        status: 'REVOKED',
        message: 'CE DOCUMENT A ÉTÉ OFFICIELLEMENT ANNULÉ PAR L\'UNIVERSITÉ',
        code: uuid,
        data: cert
      };
      return of(result).pipe(delay(500));
    }

    const result: VerificationResult = {
      status: 'VALID',
      message: 'DOCUMENT CERTIFIÉ AUTHENTIQUE PAR L\'ÉTABLISSEMENT',
      code: uuid,
      data: cert
    };
    return of(result).pipe(delay(500));
  }

  getStudentByEmail(email: string): Observable<Student | undefined> {
    return of(this.students.find(s => s.email === email.toLowerCase())).pipe(delay(200));
  }
}