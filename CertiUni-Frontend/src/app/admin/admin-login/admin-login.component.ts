import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-login-page">
      <div class="login-panel card">
        <div class="login-header">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
          <h2>Espace Université</h2>
          <p>Connectez-vous à votre tableau de bord institutionnel</p>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" [(ngModel)]="email" placeholder="admin@univ-douala.cm" />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <input type="password" class="form-input" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()" />
        </div>

        @if (error) {
          <div class="error-box">{{ error }}</div>
        }

        <button class="btn btn-primary btn-lg btn-block" (click)="login()">Se connecter</button>

        <div class="login-footer">
          <p>Pas encore inscrit?</p>
          <button class="btn btn-outline btn-block" (click)="router.navigate(['/admin/register'])">
            🏫 Inscrire mon institution
          </button>
          <p class="demo-hint">Démo: admin@univ-douala.cm / admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-page { min-height: 100vh; background: linear-gradient(135deg, #F9FAFB 50%, #EFF6FF 100%); display: flex; align-items: center; justify-content: center; padding: 24px; }
    .login-panel { max-width: 440px; width: 100%; padding: 40px; }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-header img { width: 56px; height: 56px; border-radius: 14px; margin-bottom: 12px; }
    .login-header h2 { font-size: 24px; font-weight: 800; color: #111827; }
    .login-header p { font-size: 14px; color: #6B7280; margin-top: 8px; }
    .error-box { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .login-footer { margin-top: 24px; text-align: center; }
    .login-footer p { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
    .demo-hint { font-size: 12px; color: #9CA3AF; margin-top: 16px; }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(public router: Router) {}

  login(): void {
    // Demo credentials
    if (this.email === 'admin@univ-douala.cm' && this.password === 'admin123') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = 'Identifiants invalides. Pour la démo: admin@univ-douala.cm / admin123';
    }
  }
}