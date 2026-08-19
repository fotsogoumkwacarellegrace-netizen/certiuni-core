import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LogEntry {
  id: string;
  time: string;
  diploma: string;
  student: string;
  status: string;
  location: string;
  ip: string;
  browser: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
          <span>CertiUni</span>
        </div>
        <nav>
          <button class="nav-item active" (click)="router.navigate(['/admin/dashboard'])">
            <span>📊</span><span class="label">Tour de contrôle</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/templates'])">
            <span>🎨</span><span class="label">Studio de Design IA</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/integrations'])">
            <span>📁</span><span class="label">Centre de Scolarité</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/messages'])">
            <span>💬</span><span class="label">Messagerie & Notifications</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/security'])">
            <span>🛡️</span><span class="label">Alerte Cybersécurité</span>
          </button>
        </nav>

        <!-- Hidden pirate attack simulator button -->
        <button class="nav-item pirate-btn" (click)="simulatePirateAttack()">
          <span>🏴‍☠️</span><span class="label">[Simuler Attaque Pirate]</span>
        </button>

        <button class="nav-item logout" (click)="logout()">
          <span>🚪</span><span class="label">Déconnexion</span>
        </button>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <div class="admin-header">
          <div>
            <h1>Tour de contrôle</h1>
            <p class="text-gray">Université de Douala · Mode <span class="badge badge-production">PRODUCTION</span></p>
          </div>
          <div class="header-actions">
            <span class="live-indicator">● LIVE</span>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-row">
          <div class="kpi-card">
            <span class="kpi-icon">📜</span>
            <div>
              <strong>{{ kpis.totalCertificates }}</strong>
              <p>Diplômes émis</p>
            </div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">🔍</span>
            <div>
              <strong>{{ kpis.totalScans }}</strong>
              <p>Scans effectués</p>
            </div>
          </div>
          <div class="kpi-card danger">
            <span class="kpi-icon">⚠️</span>
            <div>
              <strong>{{ kpis.totalFrauds }}</strong>
              <p>Fraudes détectées</p>
            </div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">💰</span>
            <div>
              <strong>{{ kpis.totalRevenue }} FCFA</strong>
              <p>Revenus</p>
            </div>
          </div>
        </div>

        <!-- Chart & logs section -->
        <div class="dashboard-grid">
          <!-- Analytics chart (simplified ApexCharts-style) -->
          <div class="card chart-card">
            <h3 class="card-title">Activité des scans — 7 derniers jours</h3>
            <div class="bar-chart">
              @for (bar of weeklyActivity; track bar.day) {
                <div class="bar-group">
                  <div class="bar-value" [style.height.%]="bar.scans * 100 / 30">{{ bar.scans }}</div>
                  <div class="bar-label">{{ bar.day }}</div>
                </div>
              }
            </div>
          </div>

          <!-- University status -->
          <div class="card status-card">
            <h3 class="card-title">Statut de l'institution</h3>
            <div class="status-info">
              <div><span>Env. mode</span><strong class="text-success">PRODUCTION</strong></div>
              <div><span>Facturation</span><strong>Active</strong></div>
              <div><span>Étudiants</span><strong>2 548</strong></div>
              <div><span>Dernière sync</span><strong>Il y a 2 minutes</strong></div>
            </div>
          </div>
        </div>

        <!-- Audit logs table -->
        <div class="card mt-4">
          <div class="logs-header">
            <h3 class="card-title">Journal d'audit des scans en direct</h3>
            <span class="badge badge-valid">{{ logs.length }} événements</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Diplôme</th>
                <th>Étudiant</th>
                <th>Localisation</th>
                <th>IP</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs; track log.id) {
                <tr>
                  <td>{{ log.time }}</td>
                  <td>{{ log.diploma }}</td>
                  <td>{{ log.student }}</td>
                  <td (click)="showGeoDrawer(log)" class="location-link">📍 {{ log.location }}</td>
                  <td class="mono">{{ log.ip }}</td>
                  <td>
                    <span [class]="'badge ' + (log.status === 'VALID' ? 'badge-valid' : log.status === 'REVOKED' ? 'badge-revoked' : 'badge-notfound')">
                      {{ log.status }}
                    </span>
                  </td>
                  <td>
                    @if (log.status === 'VALID') {
                      <button class="btn btn-sm btn-danger" (click)="openRevokeModal()">Révoquer</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>

      <!-- Geo tracking drawer (Screen 26) -->
      @if (geoDrawerOpen) {
        <div class="drawer-overlay" (click)="closeGeoDrawer()"></div>
        <div class="drawer-right geo-drawer">
          <div class="drawer-header">
            <h3>Traçabilité géographique</h3>
            <button class="btn btn-ghost" (click)="closeGeoDrawer()">✕</button>
          </div>
          <div class="drawer-body">
            <!-- Simulated Leaflet map -->
            <div class="map-placeholder">
              <div class="map-pin">📍</div>
              <div class="map-coords">
                Lat: {{ selectedLog?.lat }} · Lng: {{ selectedLog?.lng }}
              </div>
              <button class="btn btn-sm btn-primary" (click)="openRealMap()">Ouvrir dans Leaflet</button>
            </div>
            <div class="geo-info">
              <h4>Données IP</h4>
              <div class="info-row"><span>Adresse IP</span><strong>{{ selectedLog?.ip }}</strong></div>
              <div class="info-row"><span>Localisation</span><strong>{{ selectedLog?.location }}</strong></div>
              <div class="info-row"><span>Navigateur</span><strong>{{ selectedLog?.browser }}</strong></div>
              <div class="info-row"><span>Heure du scan</span><strong>{{ selectedLog?.time }}</strong></div>
            </div>
          </div>
        </div>
      }

      <!-- Revocation modal (Screen 27) -->
      @if (revokeModalOpen) {
        <div class="modal-overlay" (click)="closeRevokeModal()"></div>
        <div class="revoke-modal">
          <div class="modal-top-border"></div>
          <h3>Révocation du diplôme</h3>
          <p class="text-gray">Cette action est irréversible. Le document sera marqué comme annulé.</p>

          <div class="form-group mt-4">
            <label class="form-label">Motif de révocation</label>
            <select class="form-select">
              <option>Tricherie</option>
              <option>Erreur administrative</option>
              <option>Fraude documentaire</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Détails complémentaires</label>
            <textarea class="form-textarea" placeholder="Description détaillée..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Code MFA (6 chiffres)</label>
            <div class="mfa-codes">
              @for (i of [0,1,2,3,4,5]; track i) {
                <input type="password" maxlength="1" class="mfa-box" (input)="onMfaInput($event, i)" />
              }
            </div>
          </div>

          <button class="btn btn-danger btn-block" (click)="confirmRevoke()">Confirmer la révocation</button>
          <button class="btn btn-ghost btn-block mt-2" (click)="closeRevokeModal()">Annuler</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-layout { min-height: 100vh; display: flex; background: #F9FAFB; }
    .main-content { flex: 1; margin-left: 260px; padding: 24px 32px; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .admin-header h1 { font-size: 24px; font-weight: 800; }
    .live-indicator { color: #10B981; font-weight: 700; font-size: 14px; animation: pulse-red 2s infinite; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card {
      background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;
      border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .kpi-card.danger { border-left: 4px solid #EF4444; }
    .kpi-icon { font-size: 28px; }
    .kpi-card strong { font-size: 24px; color: #111827; display: block; }
    .kpi-card p { font-size: 13px; color: #6B7280; }
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .card-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding: 8px 0; }
    .bar-group { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 8px; }
    .bar-value {
      width: 32px; background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%);
      border-radius: 6px 6px 0 0; min-height: 4px; transition: height 0.5s; text-align: center;
      color: white; font-size: 11px; padding-top: 4px;
    }
    .bar-label { font-size: 11px; color: #6B7280; }
    .status-info { display: flex; flex-direction: column; gap: 12px; }
    .status-info div { display: flex; justify-content: space-between; }
    .status-info span { color: #6B7280; font-size: 14px; }
    .status-info strong { font-size: 14px; }
    .logs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .location-link { color: #1E3A8A; cursor: pointer; text-decoration: underline; }
    .mono { font-family: monospace; font-size: 12px; }
    .pirate-btn { opacity: 0.35; }
    .pirate-btn:hover { opacity: 1; }
    .nav-item.logout { margin-top: auto; color: #EF4444; }
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 998; }
    .drawer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid #E5E7EB;
    }
    .drawer-header h3 { font-size: 16px; font-weight: 700; }
    .map-placeholder {
      background: linear-gradient(135deg, #E5F2E5 25%, #C8E6C9 25%, #C8E6C9 50%, #E5F2E5 50%);
      background-size: 20px 20px; height: 250px; border-radius: 12px; border: 1px solid #E5E7EB;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;
    }
    .map-pin { font-size: 48px; animation: float 2s ease-in-out infinite; }
    .map-coords { font-size: 12px; color: #1E3A8A; font-family: monospace; }
    .geo-info h4 { font-size: 15px; margin-bottom: 12px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
    .info-row span { color: #6B7280; font-size: 13px; }
    .revoke-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; border-radius: 12px; padding: 32px; width: 90%; max-width: 440px;
      z-index: 999; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .modal-top-border { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #EF4444; border-radius: 12px 12px 0 0; }
    .revoke-modal h3 { font-size: 20px; font-weight: 800; }
    .mfa-codes { display: flex; gap: 8px; }
    .mfa-box {
      width: 40px; height: 48px; border: 2px solid #D1D5DB; border-radius: 8px;
      text-align: center; font-size: 18px; font-weight: 700;
    }
    .mfa-box:focus { border-color: #1E3A8A; outline: none; }
    @media (max-width: 1024px) {
      .main-content { margin-left: 70px; }
      .kpi-row { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 16px; }
      .kpi-row { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent {
  kpis = { totalCertificates: 487, totalScans: 1254, totalFrauds: 12, totalRevenue: 487000 };
  weeklyActivity = [
    { day: 'Lun', scans: 12 }, { day: 'Mar', scans: 18 }, { day: 'Mer', scans: 15 },
    { day: 'Jeu', scans: 25 }, { day: 'Ven', scans: 30 }, { day: 'Sam', scans: 8 }, { day: 'Dim', scans: 5 }
  ];
  logs: LogEntry[] = [
    { id: '1', time: '15:14:22', diploma: 'Master Génie Logiciel', student: 'Marie Ngo', status: 'VALID', location: 'Cameroun (Douala)', ip: '41.202.160.10', browser: 'Chrome 126', lat: 4.0511, lng: 9.7679 },
    { id: '2', time: '14:30:05', diploma: 'Licence Sc. Économiques', student: 'Jean Modo', status: 'VALID', location: 'France (Paris)', ip: '90.63.120.45', browser: 'Firefox 127', lat: 48.8566, lng: 2.3522 },
    { id: '3', time: '11:15:40', diploma: 'ID: f0000000...', student: 'Inconnu', status: 'NOT_FOUND', location: 'Canada (Montréal)', ip: '24.201.10.88', browser: 'Safari 17', lat: 45.5019, lng: -73.5674 },
    { id: '4', time: '09:45:12', diploma: 'Master Droit des Affaires', student: 'Pauline Etoundi', status: 'VALID', location: 'Cameroun (Yaoundé)', ip: '41.207.50.32', browser: 'Chrome 126', lat: 3.8480, lng: 11.5021 }
  ];

  geoDrawerOpen = false;
  selectedLog: LogEntry | null = null;
  revokeModalOpen = false;
  mfaCode = '';

  constructor(public router: Router) {}

  showGeoDrawer(log: LogEntry): void {
    this.selectedLog = log;
    this.geoDrawerOpen = true;
  }

  closeGeoDrawer(): void {
    this.geoDrawerOpen = false;
  }

  openRealMap(): void {
    // In production this opens Leaflet/OpenStreetMap
    window.open(`https://www.openstreetmap.org/?mlat=${this.selectedLog?.lat}&mlon=${this.selectedLog?.lng}#map=10/${this.selectedLog?.lat}/${this.selectedLog?.lng}`, '_blank');
  }

  openRevokeModal(): void {
    this.revokeModalOpen = true;
  }

  closeRevokeModal(): void {
    this.revokeModalOpen = false;
  }

  onMfaInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (index < 5 && input.value) {
      const next = input.parentElement?.children[index + 1] as HTMLInputElement;
      if (next) next.focus();
    }
  }

  confirmRevoke(): void {
    this.revokeModalOpen = false;
    alert('⚠️ Diplôme révoqué avec succès ! Le document est maintenant marqué comme annulé.');
  }

  simulatePirateAttack(): void {
    this.router.navigate(['/admin/security']);
  }

  logout(): void {
    this.router.navigate(['/admin/login']);
  }
}