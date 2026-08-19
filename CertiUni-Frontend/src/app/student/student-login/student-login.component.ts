import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <!-- Left branding side -->
      <div class="brand-side">
        <div class="brand-content">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" class="brand-logo"
            onerror="this.style.display='none'">
          <h1>Portefeuille Étudiant</h1>
          <p>Accédez à vos diplômes numériques certifiés</p>
          <div class="security-badge">🔒 Connexion sécurisée par lien magique</div>
        </div>
      </div>

      <!-- Right form side -->
      <div class="form-side">
        @if (!emailSent) {
          <div class="login-form fade-in">
            <h2>Connexion</h2>
            <p class="subtitle">Entrez votre email institutionnel pour recevoir votre lien d'accès</p>

            <div class="form-group mt-6">
              <label class="form-label">Email institutionnel</label>
              <input
                type="email"
                class="form-input"
                [(ngModel)]="studentEmail"
                placeholder="ex: marie.ngo@univ-douala.cm"
                (keyup.enter)="sendMagicLink()"
              />
            </div>

            <button class="btn btn-primary btn-lg btn-block" (click)="sendMagicLink()" [disabled]="!studentEmail">
              Recevoir mon lien d'accès sécurisé →
            </button>

            <p class="help-text">
              ℹ️ En mode démonstration, le lien est simulé en local.
            </p>
          </div>
        } @else {
          <!-- Screen 12: Email success animation -->
          <div class="email-success fade-in">
            <div class="envelope-anim float-anim">✉️</div>
            <h2>Email envoyé !</h2>
            <p class="subtitle">
              Un lien d'accès sécurisé a été envoyé à<br>
              <strong>{{ studentEmail }}</strong>
            </p>

            <div class="mail-status">
              <div class="status-check">✓</div>
              <span>Cliquez sur l'enveloppe pour ouvrir votre session (démo)</span>
            </div>

            <button class="btn btn-primary btn-lg btn-block mt-4" (click)="continueToDashboard()">
              Ouvrir ma session (Simulation)
            </button>

            <button class="btn btn-ghost btn-block mt-2" (click)="resendEmail()" [disabled]="resendCooldown > 0">
              Renvoyer l'email ({{ resendCooldown }}s)
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: flex; }
    .brand-side {
      flex: 1; background: linear-gradient(135deg, #1E3A8A 0%, #172554 100%);
      color: white; display: flex; align-items: center; justify-content: center; padding: 40px;
    }
    .brand-content { text-align: center; max-width: 400px; }
    .brand-logo { width: 80px; height: 80px; margin-bottom: 24px; border-radius: 20px; }
    .brand-content h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
    .brand-content p { font-size: 16px; opacity: 0.9; margin-bottom: 24px; }
    .security-badge {
      display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1);
      padding: 12px 20px; border-radius: 999px; font-size: 14px;
    }
    .form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #F9FAFB; }
    .login-form, .email-success { width: 100%; max-width: 420px; }
    .login-form h2, .email-success h2 { font-size: 28px; font-weight: 800; color: #111827; }
    .subtitle { color: #6B7280; margin-top: 8px; font-size: 14px; }
    .help-text { font-size: 12px; color: #9CA3AF; margin-top: 16px; text-align: center; }
    .envelope-anim { font-size: 64px; text-align: center; margin-bottom: 16px; }
    .mail-status {
      display: flex; align-items: center; gap: 12px; background: #F0FDF4;
      border: 1px solid #86EFAC; border-radius: 12px; padding: 16px; margin-top: 24px;
    }
    .status-check {
      width: 28px; height: 28px; border-radius: 50%; background: #10B981; color: white;
      display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;
    }
    .mail-status span { font-size: 13px; color: #065F46; }
    @media (max-width: 768px) {
      .brand-side { display: none; }
      .form-side { padding: 24px; }
    }
  `]
})
export class StudentLoginComponent {
  studentEmail = '';
  emailSent = false;
  resendCooldown = 59;
  private cooldownTimer: any;

  constructor(private router: Router) {}

  sendMagicLink(): void {
    if (!this.studentEmail) return;
    this.emailSent = true;
    this.startCooldown();
    // In production, this calls the backend to send a real email
    console.log(`[SIMULATION] Lien magique généré pour ${this.studentEmail}`);
  }

  continueToDashboard(): void {
    this.router.navigate(['/student/dashboard']);
  }

  resendEmail(): void {
    if (this.resendCooldown <= 0) {
      this.resendCooldown = 59;
      this.startCooldown();
    }
  }

  private startCooldown(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }
}