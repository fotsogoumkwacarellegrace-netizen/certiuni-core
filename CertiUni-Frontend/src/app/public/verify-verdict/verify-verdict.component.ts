import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CertificateData {
  id: string;
  course_title: string;
  university_name?: string;
  final_grade: string;
  issue_date: string;
  certificat_hash: string;
  payment_state: string;
  status: string;
  pdf_url?: string | null;
  program?: string;
  faculty?: string;
  student_name?: string;
}

@Component({
  selector: 'app-verify-verdict',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="verdict-container">
      <!-- CASE 1: GREEN - VALID -->
      @if (verdict === 'VALID') {
        <div class="verdict-valid">
          <div class="banner-valid">
            <span class="banner-icon">✓</span>
            <h1>DOCUMENT CERTIFIÉ AUTHENTIQUE PAR L'ÉTABLISSEMENT</h1>
          </div>

          <div class="certificate-panel">
            <!-- University header -->
            <div class="uni-header">
              <img src="assets/logos/univ-douala.png" alt="Logo Université" class="uni-logo"
                onerror="this.style.display='none'">
              <h2>{{ certificate?.university_name || 'Université de Douala' }}</h2>
              <span class="badge badge-valid">Authentique</span>
            </div>

            <!-- Student info -->
            <div class="student-info">
              <div class="info-row">
                <span class="label">Nom:</span>
                <span class="value">{{ certificate?.student_name || 'Marie Ngo' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Diplôme:</span>
                <span class="value">{{ certificate?.course_title || 'Master en Génie Logiciel' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Mention:</span>
                <span class="value">{{ certificate?.final_grade || '16.5/20 (Mention Très Bien)' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date d'émission:</span>
                <span class="value">{{ certificate?.issue_date || '2026-07-15' }}</span>
              </div>
              <div class="info-row">
                <span class="label">UUID:</span>
                <span class="value mono">{{ certificate?.id || uuid }}</span>
              </div>
              <div class="info-row">
                <span class="label">Hash SHA-256:</span>
                <span class="value mono small">{{ certificate?.certificat_hash }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button class="btn btn-primary btn-lg" (click)="downloadOriginal()">
                ⬇ Télécharger la copie conforme d'origine
              </button>
              <button class="btn btn-outline" (click)="viewPdf()">📄 Voir PDF</button>
            </div>
          </div>
        </div>
      }

      <!-- CASE 2: RED - REVOKED -->
      @if (verdict === 'REVOKED') {
        <div class="verdict-revoked">
          <div class="banner-revoked">
            <span class="banner-icon">⚠</span>
            <h1>CE DOCUMENT A ÉTÉ OFFICIELLEMENT ANNULÉ PAR L'UNIVERSITÉ</h1>
          </div>

          <div class="certificate-panel">
            <div class="blur-privacy">
              <div class="uni-header">
                <img src="assets/logos/univ-douala.png" alt="Logo Université" class="uni-logo"
                  onerror="this.style.display='none'">
                <h2>Université de Douala</h2>
              </div>
              <div class="student-info">
                <div class="info-row"><span class="label">Nom:</span><span class="value">Alain Tchakounté</span></div>
                <div class="info-row"><span class="label">Diplôme:</span><span class="value">Faux Diplôme Détecté</span></div>
                <div class="info-row"><span class="label">Statut:</span><span class="value text-danger font-bold">RÉVOQUÉ</span></div>
              </div>
            </div>

            <div class="actions">
              <a class="btn btn-danger" href="mailto:rectorat@univ-douala.cm">
                ✉ Contacter le Secrétariat Émetteur
              </a>
            </div>
          </div>
        </div>
      }

      <!-- CASE 3: GRAY - NOT FOUND -->
      @if (verdict === 'NOT_FOUND') {
        <div class="verdict-notfound">
          <div class="banner-notfound">
            <span class="banner-icon">?</span>
            <h1>CODE INCONNU — RISQUE ÉLEVÉ DE FALSIFICATION</h1>
          </div>

          <div class="certificate-panel">
            <div class="notfound-icon">🔍</div>
            <h2>Aucun diplôme trouvé avec ce code</h2>
            <p class="code-searched">
              Code recherché: <code>{{ uuid }}</code>
            </p>

            <div class="not-partner-box">
              <h3>🏫 ÉCOLE NON PARTENAIRE</h3>
              <p>
                L'établissement émetteur de ce document n'est pas encore abonné à la plateforme CertiUni.
                Vérification manuelle requise par nos services.
              </p>
            </div>

            <div class="actions">
              <button class="btn btn-lg btn-lg-manual" (click)="showPaymentSheet = true">
                Lancer une vérification administrative manuelle (2 000 FCFA)
              </button>
            </div>
          </div>

          <!-- Bottom Sheet - Mobile Money Public (Screen 8) -->
          @if (showPaymentSheet) {
            <div class="modal-overlay" (click)="showPaymentSheet = false"></div>
            <div class="bottom-sheet">
              <div class="sheet-handle"></div>
              <h3 class="text-center mb-4">Paiement de la vérification manuelle</h3>
              <p class="text-center text-gray mb-4">
                Montant: <strong>2 000 FCFA</strong><br>
                Un agent CertiUni vérifiera manuellement le document dans un délai de 48h.
              </p>
              <div class="form-group">
                <input type="tel" [(ngModel)]="phoneNumber" class="form-input" placeholder="+237 6XX XX XX XX" />
              </div>
              <div class="payment-buttons">
                <button class="btn btn-momo" (click)="payPublic()">📱 MTN MoMo</button>
                <button class="btn btn-om" (click)="payPublic()">🟠 Orange Money</button>
              </div>
              <button class="btn btn-ghost btn-block mt-3" (click)="showPaymentSheet = false">Annuler</button>
            </div>
          }
        </div>
      }

      <!-- Loading state -->
      @if (!verdict) {
        <div class="loading-state">
          <div class="loading-spinner spinner">⏳</div>
          <p>Vérification en cours...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .verdict-container { min-height: 100vh; background: #F9FAFB; display: flex; justify-content: center; padding: 32px 16px; }
    .banner-valid, .banner-revoked, .banner-notfound {
      display: flex; align-items: center; justify-content: center; gap: 16px;
      padding: 28px 24px; color: white; border-radius: 12px; margin-bottom: 24px;
      width: 100%; max-width: 800px;
    }
    .banner-valid { background: #10B981; }
    .banner-revoked { background: #EF4444; animation: pulse-red 1s ease infinite; }
    .banner-notfound { background: #374151; }
    .banner-icon { font-size: 32px; font-weight: 800; }
    .banner h1 { font-size: 20px; font-weight: 700; text-align: center; }
    .certificate-panel {
      background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 32px; max-width: 800px; width: 100%; position: relative;
    }
    .certificate-panel::before {
      content: 'CertiUni'; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg);
      font-size: 80px; font-weight: 800; color: #1E3A8A; opacity: 0.04; pointer-events: none; white-space: nowrap;
    }
    .uni-header { display: flex; align-items: center; gap: 16px; padding-bottom: 20px; border-bottom: 2px solid #F3F4F6; margin-bottom: 24px; }
    .uni-logo { width: 48px; height: 48px; border-radius: 8px; }
    .uni-header h2 { font-size: 20px; color: #1E3A8A; flex: 1; }
    .student-info { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .info-row { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #F9FAFB; }
    .label { min-width: 140px; font-weight: 600; color: #6B7280; font-size: 14px; }
    .value { font-size: 15px; color: #111827; }
    .value.mono { font-family: monospace; font-size: 13px; color: #6B7280; word-break: break-all; }
    .value.mono.small { font-size: 11px; }
    .actions { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
    .notfound-icon { font-size: 56px; text-align: center; margin: 16px 0; }
    .certificate-panel h2 { text-align: center; color: #374151; margin-bottom: 8px; }
    .code-searched { text-align: center; color: #6B7280; margin-bottom: 24px; }
    .code-searched code { background: #F3F4F6; padding: 4px 8px; border-radius: 4px; font-size: 13px; }
    .not-partner-box {
      background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px;
      padding: 20px; margin: 24px 0; text-align: center;
    }
    .not-partner-box h3 { color: #92400E; margin-bottom: 8px; }
    .not-partner-box p { color: #78350F; font-size: 14px; }
    .btn-lg-manual { background: #F97316; color: white; width: 100%; }
    .btn-lg-manual:hover { background: #EA580C; }
    .sheet-handle { width: 48px; height: 4px; background: #D1D5DB; border-radius: 2px; margin: 0 auto 16px; }
    .payment-buttons { display: flex; gap: 12px; margin-bottom: 12px; }
    .payment-buttons .btn { flex: 1; font-size: 15px; }
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
    .loading-spinner { font-size: 48px; }
    .loading-state p { color: #6B7280; }
    @media (max-width: 768px) {
      .banner-valid, .banner-revoked, .banner-notfound { flex-direction: column; text-align: center; }
      .banner h1 { font-size: 16px; }
      .certificate-panel { padding: 20px; }
      .info-row { flex-direction: column; gap: 4px; }
      .label { min-width: auto; }
      .actions { flex-direction: column; }
    }
  `]
})
export class VerifyVerdictComponent implements OnInit {
  uuid: string = '';
  verdict: 'VALID' | 'REVOKED' | 'NOT_FOUND' | null = null;
  certificate: CertificateData | null = null;
  showPaymentSheet = false;
  phoneNumber = '';

  // Mock certificate database
  private certificates: Record<string, CertificateData> = {
    'f81d4fae-7dec-11d0-a765-00a0c91e6bf6': {
      id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      course_title: 'Master en Génie Logiciel',
      university_name: 'Université de Douala',
      final_grade: '16.5/20 (Mention Très Bien)',
      issue_date: '2026-07-15',
      certificat_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      payment_state: 'PAID',
      status: 'active',
      pdf_url: 'assets/docs/diploma_marie_ngo.pdf',
      student_name: 'Marie Ngo',
      program: 'Master',
      faculty: 'Faculté des Sciences'
    },
    '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d': {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      course_title: 'Licence en Sciences Économiques',
      university_name: 'Université de Yaoundé I',
      final_grade: '12.0/20 (Mention Passable)',
      issue_date: '2026-07-20',
      certificat_hash: 'ca7f70c565bd256cb76e2ef3c8d1d86d654158cfc258df361c4581f216259d33',
      payment_state: 'EXEMPTED',
      status: 'active',
      pdf_url: 'assets/docs/diploma_jean_modo.pdf',
      student_name: 'Jean Modo',
      program: 'Licence',
      faculty: 'Faculté des Sciences Économiques'
    },
    'f0000000-0000-0000-0000-000000000000': {
      id: 'f0000000-0000-0000-0000-000000000000',
      course_title: 'Faux Diplôme',
      university_name: 'Université de Douala',
      final_grade: 'N/A',
      issue_date: 'N/A',
      certificat_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      payment_state: 'EXEMPTED',
      status: 'revoque',
      student_name: 'Alain Tchakounté'
    }
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('id') || '';
      this.checkCertificate();
    });
  }

  checkCertificate(): void {
    const cert = this.certificates[this.uuid];

    if (!cert) {
      this.verdict = 'NOT_FOUND';
      this.certificate = null;
      return;
    }

    if (cert.status === 'revoque') {
      this.verdict = 'REVOKED';
      this.certificate = cert;
      return;
    }

    this.verdict = 'VALID';
    this.certificate = cert;
  }

  downloadOriginal(): void {
    // For demo, open the PDF in a new tab
    const url = this.certificate?.pdf_url || 'assets/docs/diploma_marie_ngo.pdf';
    window.open(url, '_blank');
  }

  viewPdf(): void {
    // Mock S3 viewer - open PDF in new tab
    window.open('assets/docs/diploma_marie_ngo.pdf', '_blank');
  }

  payPublic(): void {
    this.showPaymentSheet = false;
    alert('Demande enregistrée ! Un agent CertiUni vous contactera dans les 48h pour la vérification manuelle.');
  }
}