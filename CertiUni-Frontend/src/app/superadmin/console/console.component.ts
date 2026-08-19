import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface University {
  id: string;
  name: string;
  acronym: string;
  environment_mode: string;
  official_email_domain: string;
}

@Component({
  selector: 'app-console',
  imports: [CommonModule],
  template: `
    <div class="console-page">
      <!-- Header -->
      <header class="console-header">
        <div class="header-left">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
          <h1>Console Maître — Réseau National</h1>
        </div>
        <div class="yubikey-status" [class.connected]="yubikeyConnected" (click)="toggleYubikey()">
          <span class="key-icon">🔑</span>
          <div>
            <strong>Jeton FIDO2/YubiKey</strong>
            <p>{{ yubikeyConnected ? 'Connecté ✓' : 'Non connecté' }}</p>
          </div>
        </div>
      </header>

      <!-- 3-column layout -->
      <div class="console-grid">
        <!-- Left: Tenants list -->
        <div class="panel tenants-panel">
          <div class="panel-header">
            <h2>🏫 Locataires (Universités)</h2>
            <span class="badge badge-production">{{ universities.length }} actives</span>
          </div>
          <div class="tenant-list">
            @for (uni of universities; track uni.id) {
              <div class="tenant-item">
                <div class="tenant-info">
                  <strong>{{ uni.name }}</strong>
                  <p>{{ uni.acronym }} · {{ uni.official_email_domain }}</p>
                </div>
                <span [class]="'badge ' + (uni.environment_mode === 'PRODUCTION' ? 'badge-production' : uni.environment_mode === 'SANDBOX' ? 'badge-sandbox' : 'badge-revoked')">
                  {{ uni.environment_mode }}
                </span>
                <div class="tenant-actions">
                  <button class="btn btn-sm btn-success" [disabled]="!yubikeyConnected" (click)="validateUniversity(uni)">
                    Valider
                  </button>
                  <button class="btn btn-sm btn-danger" [disabled]="!yubikeyConnected" (click)="banUniversity(uni)">
                    Bannir
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Center: Legal validator -->
        <div class="panel validator-panel">
          <div class="panel-header">
            <h2>⚖️ Validateur Juridique</h2>
          </div>
          <div class="validator-content">
            <div class="decree-box">
              <span class="decree-icon">📄</span>
              <h3>Arrêté du MINESUP</h3>
              <p class="mono">ARRETE_2024_UDs.pdf</p>
              <div class="decree-status">
                <span class="badge badge-valid">✓ Vérifié</span>
              </div>
            </div>
            <div class="signature-box">
              <span class="sig-icon">✍️</span>
              <h3>Signature du Doyen</h3>
              <div class="sig-preview">
                <svg width="120" height="60" viewBox="0 0 120 60">
                  <path d="M10,40 C20,20 30,50 40,30 C50,10 60,45 70,25 C80,10 90,40 100,20" fill="none" stroke="#1E3A8A" stroke-width="2"/>
                </svg>
              </div>
              <span class="badge badge-valid">✓ Authentique</span>
            </div>
            <div class="validation-actions">
              <button class="btn btn-primary btn-block" [disabled]="!yubikeyConnected" (click)="validateDecree()">
                Valider le dossier juridique
              </button>
              @if (!yubikeyConnected) {
                <p class="lock-hint">🔒 Connectez la clé YubiKey pour activer les actions</p>
              }
            </div>
          </div>
        </div>

        <!-- Right: Firewall logs -->
        <div class="panel firewall-panel">
          <div class="panel-header">
            <h2>🛡️ Pare-feu — Logs</h2>
            <span class="live-dot">●</span>
          </div>
          <div class="firewall-logs">
            @for (log of firewallLogs; track log.time) {
              <div class="log-line">
                <span class="log-time">{{ log.time }}</span>
                <span [class]="'log-event ' + (log.event === 'ALLOW' ? 'allow' : 'block')">{{ log.event }}</span>
                <span class="log-source">{{ log.source }}</span>
                <span class="log-target">{{ log.target }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .console-page { min-height: 100vh; background: #0B0F19; color: #E2E8F0; }
    .console-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 24px; background: #111827; border-bottom: 1px solid #1F2937;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-left img { width: 36px; height: 36px; border-radius: 8px; }
    .header-left h1 { font-size: 18px; font-weight: 700; }
    .yubikey-status {
      display: flex; align-items: center; gap: 12px; background: #1F2937;
      padding: 10px 16px; border-radius: 10px; cursor: pointer; border: 2px solid #374151;
      transition: all 0.3s;
    }
    .yubikey-status.connected { border-color: #10B981; background: rgba(16,185,129,0.1); }
    .key-icon { font-size: 24px; }
    .yubikey-status strong { font-size: 13px; display: block; }
    .yubikey-status p { font-size: 11px; color: #94A3B8; }
    .yubikey-status.connected p { color: #10B981; }
    .console-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 24px; }
    .panel { background: #111827; border: 1px solid #1F2937; border-radius: 12px; overflow: hidden; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #1F2937; }
    .panel-header h2 { font-size: 15px; font-weight: 700; }
    .tenant-list { padding: 12px; max-height: 600px; overflow-y: auto; }
    .tenant-item { padding: 12px; border-bottom: 1px solid #1F2937; }
    .tenant-item:last-child { border-bottom: none; }
    .tenant-info strong { font-size: 14px; display: block; }
    .tenant-info p { font-size: 12px; color: #94A3B8; margin-top: 4px; }
    .tenant-actions { display: flex; gap: 8px; margin-top: 12px; }
    .validator-content { padding: 20px; }
    .decree-box, .signature-box {
      background: #1F2937; border-radius: 10px; padding: 16px; margin-bottom: 16px; text-align: center;
    }
    .decree-icon, .sig-icon { font-size: 32px; }
    .decree-box h3, .signature-box h3 { font-size: 14px; margin: 8px 0; }
    .mono { font-family: monospace; font-size: 12px; color: #94A3B8; }
    .decree-status { margin-top: 12px; }
    .sig-preview { background: white; border-radius: 8px; padding: 8px; margin: 12px 0; }
    .validation-actions { margin-top: 16px; }
    .lock-hint { font-size: 12px; color: #FBBF24; text-align: center; margin-top: 12px; }
    .firewall-logs { padding: 12px; font-family: 'Courier New', monospace; font-size: 11px; max-height: 600px; overflow-y: auto; }
    .log-line { display: flex; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(31,41,55,0.5); }
    .log-time { color: #64748B; }
    .log-event.allow { color: #10B981; font-weight: 700; }
    .log-event.block { color: #EF4444; font-weight: 700; }
    .log-source { color: #94A3B8; }
    .log-target { color: #64748B; }
    .live-dot { color: #10B981; animation: pulse-red 1s infinite; }
    @media (max-width: 1024px) {
      .console-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .console-header { flex-direction: column; gap: 12px; }
    }
  `]
})
export class ConsoleComponent {
  yubikeyConnected = false;
  universities: University[] = [
    { id: 'univ-douala-01', name: 'Université de Douala', acronym: 'UDs', environment_mode: 'PRODUCTION', official_email_domain: '@univ-douala.cm' },
    { id: 'univ-yaounde-02', name: 'Université de Yaoundé I', acronym: 'UY1', environment_mode: 'SANDBOX', official_email_domain: '@univ-yaounde1.cm' }
  ];
  firewallLogs = [
    { time: '00:00:01', event: 'ALLOW', source: '41.202.160.10', target: 'Verify API' },
    { time: '00:00:05', event: 'BLOCK', source: '198.51.100.42', target: 'Verify API' },
    { time: '00:01:12', event: 'ALLOW', source: '90.63.120.45', target: 'Static Assets' },
    { time: '00:02:03', event: 'ALLOW', source: '41.207.50.32', target: 'Student Login' },
    { time: '00:03:45', event: 'BLOCK', source: '198.51.100.42', target: 'Bulk API' }
  ];

  constructor(public router: Router) {}

  toggleYubikey(): void {
    this.yubikeyConnected = !this.yubikeyConnected;
  }

  validateUniversity(uni: University): void {
    uni.environment_mode = 'PRODUCTION';
    alert(`✅ ${uni.name} validée et passée en mode PRODUCTION`);
  }

  banUniversity(uni: University): void {
    uni.environment_mode = 'BANNED';
    alert(`🚫 ${uni.name} bannie du réseau national`);
  }

  validateDecree(): void {
    alert('✅ Dossier juridique validé. L\'établissement est officiellement reconnu.');
  }
}