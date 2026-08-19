import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudentCertificate {
  id: string;
  course_title: string;
  university_name: string;
  final_grade: string;
  issue_date: string;
  certificat_hash: string;
  payment_state: string;
  status: string;
  pdf_url?: string | null;
}

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="student-app">
      <!-- Header -->
      <header class="header">
        <div class="logo-brand">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
          <span class="brand-name">CertiUni</span>
        </div>
        <div class="header-info">
          <div>
            <h3>Bonjour, Marie Ngo</h3>
            <span class="text-sm text-gray">3 Titres sécurisés</span>
          </div>
          <div class="profile-menu">
            <div class="avatar">MN</div>
            <button class="btn btn-sm btn-ghost" (click)="logout()">🚪 Déconnexion</button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="content">
        <div class="certificates-list">
          @for (cert of certificates; track cert.id) {
            <div class="cert-card" [class.cert-locked]="cert.payment_state === 'PENDING'">
              <div class="card-top">
                <div class="card-icon">🎓</div>
                <div class="card-info">
                  <h3>{{ cert.course_title }}</h3>
                  <span class="text-sm text-gray">{{ cert.university_name }}</span>
                </div>
                <span [class]="'badge ' + (cert.payment_state === 'PAID' ? 'badge-paid' : cert.payment_state === 'PENDING' ? 'badge-pending' : 'badge-valid')">
                  {{ cert.payment_state === 'PAID' ? 'Débloqué' : cert.payment_state === 'PENDING' ? 'En attente' : 'Exempté' }}
                </span>
              </div>

              <div class="card-meta">
                <span>Mention: <strong>{{ cert.final_grade }}</strong></span>
                <span>Émis le: {{ cert.issue_date }}</span>
              </div>

              <div class="card-actions">
                @if (cert.payment_state === 'PAID') {
                  <button class="btn btn-sm btn-primary" (click)="downloadCert(cert.id)">⬇ Télécharger</button>
                  <button class="btn btn-sm btn-outline" (click)="shareLinkedin(cert.id)">LinkedIn</button>
                  <button class="btn btn-sm btn-ghost" (click)="exportOptions(cert.id)">Format d'export...</button>
                }
                @if (cert.payment_state === 'PENDING') {
                  <button class="btn btn-sm btn-success" (click)="showPaymentHub(cert)">
                    🔓 Débloquer (1 000 FCFA)
                  </button>
                }
                @if (cert.payment_state === 'EXEMPTED') {
                  <button class="btn btn-sm btn-primary" (click)="downloadCert(cert.id)">⬇ Télécharger</button>
                }
              </div>
            </div>
          }
        </div>

        <!-- Quick stats -->
        <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-icon">📜</div>
            <strong>{{ certificates.length }}</strong>
            <span>Diplômes</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <strong>{{ paidCount }}</strong>
            <span>Débloqués</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔒</div>
            <strong>{{ pendingCount }}</strong>
            <span>En attente</span>
          </div>
        </div>

        <button class="btn btn-outline btn-block mt-4" (click)="router.navigate(['/student/archive'])">
          📁 Voir mon archive financière
        </button>
      </div>

      <!-- Payment Hub (Screen 14) -->
      @if (showPaymentHubFlag && selectedCert) {
        <div class="modal-overlay" (click)="closePaymentHub()"></div>
        <div class="bottom-sheet">
          <div class="sheet-handle"></div>
          <h3 class="text-center mb-2">Débloquer « {{ selectedCert.course_title }} »</h3>
          <p class="text-center text-gray mb-4">Frais de délivrance: 1 000 FCFA</p>

          <button class="payment-option momo" (click)="selectGateway('MTN_MOMO')">
            <span class="operator-logo">📱</span>
            <div>
              <strong>MTN Mobile Money</strong>
              <p>Paiement via numéro MoMo</p>
            </div>
            <span class="arrow">→</span>
          </button>
          <button class="payment-option orange" (click)="selectGateway('ORANGE_MONEY')">
            <span class="operator-logo">🟠</span>
            <div>
              <strong>Orange Money</strong>
              <p>Paiement via numéro OM</p>
            </div>
            <span class="arrow">→</span>
          </button>
          <button class="payment-option card" (click)="selectGateway('CARD')">
            <span class="operator-logo">💳</span>
            <div>
              <strong>Carte Bancaire Visa / Mastercard</strong>
              <p>Paiement sécurisé par carte</p>
            </div>
            <span class="arrow">→</span>
          </button>
        </div>
      }

      <!-- Mobile Money phone input (Screen 15) -->
      @if (showPhoneInput) {
        <div class="modal-overlay" (click)="closePhoneInput()"></div>
        <div class="bottom-sheet">
          <div class="sheet-handle"></div>
          <div class="op-header">
            <span class="operator-logo big">{{ paymentGateway === 'MTN_MOMO' ? '📱' : '🟠' }}</span>
            <h3>{{ paymentGateway === 'MTN_MOMO' ? 'MTN Mobile Money' : 'Orange Money' }}</h3>
          </div>

          <div class="form-group mt-4">
            <label class="form-label">Numéro de téléphone</label>
            <div class="phone-input-group">
              <span class="phone-prefix">+237</span>
              <input type="tel" class="form-input" [(ngModel)]="phoneNumber" placeholder="6XX XX XX XX" />
            </div>
          </div>

          <button class="btn btn-primary btn-lg btn-block" (click)="startPayment()" [disabled]="phoneNumber.length < 9">
            Suivant : Lancer le prélèvement
          </button>
          <button class="btn btn-ghost btn-block mt-2" (click)="closePhoneInput()">← Retour</button>
        </div>
      }

      <!-- Card form (Screen 16) -->
      @if (showCardForm) {
        <div class="modal-overlay" (click)="closeCardForm()"></div>
        <div class="bottom-sheet">
          <div class="sheet-handle"></div>
          <div class="op-header">
            <span class="operator-logo big">💳</span>
            <h3>Carte Bancaire</h3>
          </div>

          <div class="form-group mt-4">
            <label class="form-label">Numéro de carte</label>
            <input type="text" class="form-input" [(ngModel)]="cardNumber" placeholder="4242 4242 4242 4242"
              (input)="detectCardType()" />
            <div class="card-type-indicator">
              <span [class.active]="cardType === 'VISA'">💳 VISA</span>
              <span [class.active]="cardType === 'MASTERCARD'">💳 MASTERCARD</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Expiration</label>
              <input type="text" class="form-input" [(ngModel)]="cardExpiry" placeholder="MM/AA" maxlength="5" />
            </div>
            <div class="form-group">
              <label class="form-label">CVV</label>
              <input type="password" class="form-input" [(ngModel)]="cardCvv" placeholder="•••" maxlength="3" />
            </div>
          </div>

          <button class="btn btn-primary btn-lg btn-block" (click)="startCardPayment()" [disabled]="cardNumber.length < 16">
            Payer en toute sécurité (1 000 FCFA)
          </button>
          <button class="btn btn-ghost btn-block mt-2" (click)="closeCardForm()">← Retour</button>
        </div>
      }

      <!-- Payment processing / Countdown (Screen 17) -->
      @if (paymentProcessing) {
        <div class="modal-overlay"></div>
        <div class="bottom-sheet processing-sheet">
          <div class="processing-spinner spinner">⏳</div>
          <h3 class="text-center mt-3">Prélèvement en cours...</h3>
          <p class="text-center text-gray mt-2">Composez le code PIN sur votre téléphone</p>

          <div class="countdown-display" [class.critical]="countdown <= 10">
            {{ countdown }}
          </div>

          <div class="progress-track">
            <div class="progress-bar" [style.width.%]="(60 - countdown) * 100 / 60"></div>
          </div>

          <p class="text-center text-gray text-sm mt-2">
            Code USSD: *133# pour MTN · #150# pour Orange
          </p>
        </div>
      }

      <!-- OTP 3D Secure (Screen 18) -->
      @if (showOtpForm) {
        <div class="modal-overlay"></div>
        <div class="bottom-sheet">
          <div class="op-header">
            <span class="shield-icon">🛡️</span>
            <h3>Validation Sécurisée 3D Secure</h3>
          </div>
          <p class="text-center text-gray mt-2 mb-4">Entrez le code OTP reçu par SMS</p>
          <div class="otp-input-row">
            @for (i of [0,1,2,3,4,5]; track i) {
              <input type="password" class="otp-box" maxlength="1" (input)="onOtpInput($event, i)" inputmode="numeric" />
            }
          </div>
          <button class="btn btn-primary btn-lg btn-block mt-4" (click)="verifyOtp()" [disabled]="otpCode.length < 6">
            Valider le paiement
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .student-app { min-height: 100vh; background: #F9FAFB; }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px; background: #1E3A8A; color: white;
    }
    .logo-brand { display: flex; align-items: center; gap: 10px; }
    .logo-brand img { width: 36px; height: 36px; border-radius: 8px; }
    .brand-name { font-weight: 800; font-size: 20px; }
    .header-info { display: flex; align-items: center; gap: 16px; }
    .header-info h3 { font-size: 16px; }
    .profile-menu { display: flex; align-items: center; gap: 12px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
    }
    .content { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    .certificates-list { display: flex; flex-direction: column; gap: 16px; }
    .cert-card {
      background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid #E5E7EB; transition: all 0.2s;
    }
    .cert-card.cert-locked { opacity: 0.75; }
    .card-top { display: flex; align-items: center; gap: 16px; }
    .card-icon {
      width: 48px; height: 48px; border-radius: 12px; background: #EFF6FF;
      display: flex; align-items: center; justify-content: center; font-size: 24px;
    }
    .card-info { flex: 1; }
    .card-info h3 { font-size: 17px; font-weight: 700; }
    .card-meta { display: flex; gap: 24px; margin-top: 12px; font-size: 13px; color: #6B7280; }
    .card-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .quick-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
    .stat-card {
      background: white; border-radius: 12px; padding: 20px; text-align: center;
      border: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 4px;
    }
    .stat-icon { font-size: 24px; }
    .stat-card strong { font-size: 24px; color: #1E3A8A; }
    .stat-card span { font-size: 13px; color: #6B7280; }
    .sheet-handle { width: 48px; height: 4px; background: #D1D5DB; border-radius: 2px; margin: 0 auto 16px; }
    .payment-option {
      display: flex; align-items: center; gap: 16px; width: 100%; padding: 16px;
      border-radius: 12px; border: 2px solid #E5E7EB; margin-bottom: 12px;
      background: white; cursor: pointer; transition: all 0.2s;
      text-align: left;
    }
    .payment-option:hover { border-color: #1E3A8A; transform: translateX(4px); }
    .payment-option.momo .operator-logo { background: #FEF3C7; }
    .payment-option.orange .operator-logo { background: #FFF7ED; }
    .payment-option.card .operator-logo { background: #EFF6FF; }
    .operator-logo {
      width: 48px; height: 48px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
    }
    .operator-logo.big { width: 56px; height: 56px; font-size: 28px; }
    .payment-option div { flex: 1; }
    .payment-option strong { font-size: 15px; display: block; }
    .payment-option p { font-size: 13px; color: #6B7280; }
    .arrow { color: #9CA3AF; font-weight: 700; }
    .op-header { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .op-header h3 { font-size: 18px; }
    .phone-input-group { display: flex; align-items: stretch; }
    .phone-prefix {
      display: flex; align-items: center; background: #F3F4F6; border: 1.5px solid #E5E7EB;
      border-right: none; border-radius: 12px 0 0 12px; padding: 0 12px; font-weight: 600; color: #6B7280;
    }
    .phone-input-group .form-input { border-radius: 0 12px 12px 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card-type-indicator { display: flex; gap: 8px; margin-top: 8px; }
    .card-type-indicator span { font-size: 12px; color: #9CA3AF; padding: 4px 8px; border-radius: 4px; }
    .card-type-indicator span.active { color: #1E3A8A; background: #EFF6FF; font-weight: 600; }
    .processing-sheet { text-align: center; }
    .processing-spinner { font-size: 40px; }
    .countdown-display {
      width: 80px; height: 80px; border-radius: 50%; border: 4px solid #EF4444;
      display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800;
      color: #EF4444; margin: 24px auto; animation: pulse-red 1s ease infinite;
    }
    .countdown-display.critical { border-color: #DC2626; color: #DC2626; }
    .progress-track { height: 6px; background: #E5E7EB; border-radius: 3px; overflow: hidden; max-width: 400px; margin: 0 auto; }
    .progress-bar { height: 100%; background: #10B981; transition: width 1s linear; }
    .shield-icon { font-size: 36px; }
    .otp-input-row { display: flex; gap: 8px; justify-content: center; }
    .otp-box {
      width: 44px; height: 52px; border: 2px solid #D1D5DB; border-radius: 8px;
      text-align: center; font-size: 20px; font-weight: 700;
    }
    .otp-box:focus { border-color: #1E3A8A; outline: none; box-shadow: 0 0 0 3px rgba(30,58,138,0.1); }
    @media (max-width: 768px) {
      .header { padding: 12px 16px; flex-direction: column; gap: 12px; }
      .content { padding: 16px; }
      .card-meta { flex-direction: column; gap: 8px; }
      .quick-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    }
  `]
})
export class StudentDashboardComponent {
  certificates: StudentCertificate[] = [
    {
      id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      course_title: 'Master en Génie Logiciel',
      university_name: 'Université de Douala',
      final_grade: '16.5/20 (Mention Très Bien)',
      issue_date: '2026-07-15',
      certificat_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      payment_state: 'PAID',
      status: 'active',
      pdf_url: 'assets/docs/diploma_marie_ngo.pdf'
    },
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      course_title: 'Certification Expert Python',
      university_name: 'CertiUni Academy',
      final_grade: '94% de réussite',
      issue_date: '2026-08-01',
      certificat_hash: '8f485f4728514589a1846b9a32c2563e41b2569c4f1589da41c25893e41c4589',
      payment_state: 'PENDING',
      status: 'active',
      pdf_url: null
    }
  ];

  showPaymentHubFlag = false;
  showPhoneInput = false;
  showCardForm = false;
  paymentProcessing = false;
  showOtpForm = false;
  selectedCert: StudentCertificate | null = null;
  paymentGateway: string = '';
  phoneNumber = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardType = '';
  otpCode = '';
  countdown = 60;
  private timers: any[] = [];

  constructor(public router: Router) {}

  get paidCount(): number {
    return this.certificates.filter(c => c.payment_state === 'PAID' || c.payment_state === 'EXEMPTED').length;
  }

  get pendingCount(): number {
    return this.certificates.filter(c => c.payment_state === 'PENDING').length;
  }

  showPaymentHub(cert: StudentCertificate): void {
    this.selectedCert = cert;
    this.showPaymentHubFlag = true;
  }

  closePaymentHub(): void {
    this.showPaymentHubFlag = false;
    this.selectedCert = null;
  }

  selectGateway(gateway: string): void {
    this.paymentGateway = gateway;
    this.showPaymentHubFlag = false;

    if (gateway === 'CARD') {
      this.showCardForm = true;
    } else {
      this.showPhoneInput = true;
    }
  }

  closePhoneInput(): void {
    this.showPhoneInput = false;
    this.showPaymentHubFlag = true;
  }

  closeCardForm(): void {
    this.showCardForm = false;
    this.showPaymentHubFlag = true;
  }

  detectCardType(): void {
    const digits = this.cardNumber.replace(/\s/g, '');
    if (digits.startsWith('4')) {
      this.cardType = 'VISA';
    } else if (digits.startsWith('5')) {
      this.cardType = 'MASTERCARD';
    } else {
      this.cardType = '';
    }
  }

  startPayment(): void {
    this.showPhoneInput = false;
    this.paymentProcessing = true;
    this.countdown = 60;

    // USSD countdown simulation
    const countdownTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);

    // Simulate network success after 5 seconds (as per spec)
    const successTimer = setTimeout(() => {
      clearInterval(countdownTimer);
      this.paymentProcessing = false;
      this.completePayment();
    }, 5000);

    this.timers.push(countdownTimer, successTimer);
  }

  startCardPayment(): void {
    this.showCardForm = false;
    this.showOtpForm = true;
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (this.otpCode.length < 6) {
      this.otpCode += value;
    }

    if (index < 5 && value) {
      const next = (input.parentElement?.children[index + 1] as HTMLInputElement);
      if (next) next.focus();
    }
  }

  verifyOtp(): void {
    this.showOtpForm = false;
    this.completePayment();
  }

  completePayment(): void {
    if (this.selectedCert) {
      this.selectedCert.payment_state = 'PAID';
      const cert = this.certificates.find(c => c.id === this.selectedCert!.id);
      if (cert) cert.payment_state = 'PAID';
    }

    // Navigate to receipt screen
    const certId = this.selectedCert?.id || 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
    this.selectedCert = null;
    this.router.navigate(['/student/receipt', certId]);
  }

  downloadCert(id: string): void {
    const cert = this.certificates.find(c => c.id === id);
    window.open(cert?.pdf_url || 'assets/docs/diploma_marie_ngo.pdf', '_blank');
  }

  shareLinkedin(id: string): void {
    const cert = this.certificates.find(c => c.id === id);
    const certName = encodeURIComponent(cert?.course_title || 'Diplôme');
    const uniName = encodeURIComponent(cert?.university_name || 'Université');
    const certId = encodeURIComponent(cert?.id || '');
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=http://localhost:4200/verify/${certId}&title=${certName}%20-%20${uniName}`;
    window.open(url, '_blank');
  }

  exportOptions(id: string): void {
    // Screen 22 - Export format menu
    this.router.navigate(['/student/print', id]);
  }

  logout(): void {
    this.router.navigate(['/student/login']);
  }
}