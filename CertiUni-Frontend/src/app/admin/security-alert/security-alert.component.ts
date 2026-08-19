import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-alert',
  imports: [CommonModule],
  template: `
    <div class="security-alert-page">
      <!-- RED FLASH ALERT full screen overlay -->
      <div class="red-alert-overlay">
        <!-- Pulsing red borders -->
        <div class="alert-borders"></div>

        <!-- Central alert box -->
        <div class="alert-box">
          <div class="broken-shield">🛡️</div>
          <h1>ALERTE DE CYBERSÉCURITÉ</h1>
          <p class="diagnosis">
            Attaque brute-force détectée sur le diplôme de <strong>Marie Ngo</strong><br>
            Origine IP: <strong class="ip">198.51.100.42</strong> — <strong class="location">Chine (Shenzhen)</strong>
          </p>
          <div class="attack-details">
            <div class="detail-item">
              <span>Type d'attaque</span>
              <strong>Force Brute (Brute Force)</strong>
            </div>
            <div class="detail-item">
              <span>Diplôme ciblé</span>
              <strong class="mono">f81d4fae-7dec-11d0-a765-00a0c91e6bf6</strong>
            </div>
            <div class="detail-item">
              <span>Sévérité</span>
              <strong class="critical">CRITIQUE</strong>
            </div>
            <div class="detail-item">
              <span>Heure détectée</span>
              <strong>{{ attackTime }}</strong>
            </div>
          </div>

          <!-- Emergency actions -->
          <div class="emergency-actions">
            <button class="btn btn-danger btn-lg" (click)="suspendAccess()">
              🚫 Suspendre l'accès au Diplôme Cible
            </button>
            <button class="btn btn-primary btn-lg" (click)="banIp()">
              🚷 Bannir définitivement l'Adresse IP
            </button>
          </div>

          <button class="btn btn-ghost dismiss" (click)="dismissAlert()">+ Rétablir le système</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-alert-page { min-height: 100vh; background: #111827; position: relative; }
    .red-alert-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; }
    .alert-borders { position: absolute; inset: 0; border: 8px solid #EF4444; animation: alert-border-pulse 1s ease infinite; pointer-events: none; }
    @keyframes alert-border-pulse { 0%, 100% { opacity: 1; border-width: 8px; } 50% { opacity: 0.3; border-width: 12px; } }
    .alert-box { max-width: 600px; width: 90%; background: #111827; border: 1px solid #374151; border-radius: 16px; padding: 40px; text-align: center; position: relative; box-shadow: 0 20px 80px rgba(239, 68, 68, 0.2); }
    .broken-shield { font-size: 72px; filter: grayscale(0.5); }
    .alert-box h1 { font-size: 28px; font-weight: 800; color: #FCA5A5; margin: 16px 0; letter-spacing: 1px; animation: pulse-red 1s ease infinite; }
    .diagnosis { color: #E2E8F0; font-size: 15px; line-height: 1.6; }
    .diagnosis .ip { color: #FCA5A5; font-family: monospace; }
    .diagnosis .location { color: #FBBF24; }
    .attack-details { margin: 24px 0; text-align: left; background: #1E293B; border-radius: 8px; padding: 16px 20px; }
    .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #334155; font-size: 13px; }
    .detail-item:last-child { border-bottom: none; }
    .detail-item span { color: #94A3B8; }
    .detail-item .critical { color: #EF4444; font-weight: 700; }
    .detail-item .mono { font-family: monospace; font-size: 11px; color: #FCA5A5; word-break: break-all; margin-left: 12px; text-align: right; }
    .emergency-actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
    .emergency-actions .btn { flex: 1; }
    .dismiss { color: #94A3B8; margin-top: 24px; font-size: 13px; }
    @media (max-width: 768px) {
      .alert-box { padding: 24px; }
      .emergency-actions { flex-direction: column; }
      .alert-box h1 { font-size: 20px; }
      .detail-item { flex-direction: column; gap: 4px; }
    }
  `]
})
export class SecurityAlertComponent implements OnInit, OnDestroy {
  attackTime = new Date().toLocaleTimeString('fr-FR');
  private timer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.attackTime = new Date().toLocaleTimeString('fr-FR');
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  suspendAccess(): void {
    alert('🚫 Accès au diplôme suspendu. Le document f81d4fae est maintenant verrouillé.');
    this.router.navigate(['/admin/dashboard']);
  }

  banIp(): void {
    alert('🚷 L\'adresse IP 198.51.100.42 a été bannie définitivement.');
    this.router.navigate(['/admin/dashboard']);
  }

  dismissAlert(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}