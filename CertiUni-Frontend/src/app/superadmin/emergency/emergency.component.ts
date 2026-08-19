import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="emergency-page">
      <!-- Header -->
      <header class="emergency-header">
        <div class="header-left">
          <span class="warning-icon">⚠️</span>
          <h1>Page Panique & Routage d'Urgence</h1>
        </div>
        <span class="badge badge-revoked">SUPERADMIN SEULEMENT</span>
      </header>

      <!-- Emergency panels -->
      <div class="emergency-grid">
        <!-- Panel 1: System status -->
        <div class="emergency-panel">
          <div class="panel-title">
            <span class="panel-icon">🖥️</span>
            <h2>État du Système</h2>
          </div>
          <div class="status-list">
            <div class="status-item">
              <span>Serveur Backend</span>
              <span class="status-value ok">● Opérationnel</span>
            </div>
            <div class="status-item">
              <span>Base de données PostgreSQL</span>
              <span class="status-value warning">● Mémoire saturée</span>
            </div>
            <div class="status-item">
              <span>File d'attente Redis</span>
              <span class="status-value ok">● Opérationnelle</span>
            </div>
            <div class="status-item">
              <span>Agent IA</span>
              <span class="status-value warning">● Latence élevée</span>
            </div>
            <div class="status-item">
              <span>Stockage S3</span>
              <span class="status-value ok">● Accessible</span>
            </div>
          </div>

          <!-- Cache memory bar -->
          <div class="memory-section">
            <div class="memory-header">
              <span>Mémoire vive</span>
              <strong>87%</strong>
            </div>
            <div class="memory-bar">
              <div class="memory-fill" style="width: 87%"></div>
            </div>
          </div>
        </div>

        <!-- Panel 2: Emergency actions -->
        <div class="emergency-panel">
          <div class="panel-title">
            <span class="panel-icon">🛠️</span>
            <h2>Actions d'Urgence</h2>
          </div>

          <div class="emergency-actions-list">
            <button class="emergency-action" (click)="resetTransaction()">
              <span class="action-icon">🔄</span>
              <div>
                <strong>Réinitialiser une transaction</strong>
                <p>Réinitialiser l'état d'un paiement bloqué</p>
              </div>
            </button>

            <button class="emergency-action" (click)="restoreMockData()">
              <span class="action-icon">💾</span>
              <div>
                <strong>Restaurer mock-data.json</strong>
                <p>Forcer la restauration des données de simulation</p>
              </div>
            </button>

            <button class="emergency-action" (click)="forceSync()">
              <span class="action-icon">🔗</span>
              <div>
                <strong>Forcer synchronisation</strong>
                <p>Resynchroniser backend et frontend locales</p>
              </div>
            </button>
          </div>

          <!-- Transaction reset form -->
          @if (showResetForm) {
            <div class="reset-form">
              <div class="form-group">
                <label class="form-label">ID du certificat / UUID</label>
                <input type="text" class="form-input" [(ngModel)]="targetUuid" placeholder="f81d4fae-7dec-11d0-a765-00a0c91e6bf6" />
              </div>
              <div class="form-group">
                <label class="form-label">Nouvel état du paiement</label>
                <select class="form-select" [(ngModel)]="paymentState">
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="EXEMPTED">Exempté</option>
                </select>
              </div>
              <button class="btn btn-warning" (click)="confirmReset()">
                Confirmer la réinitialisation
              </button>
            </div>
          }

          <!-- Confirmation message -->
          @if (actionResult) {
            <div class="action-result" [class.success]="actionResultType === 'success'" [class.error]="actionResultType === 'error'">
              {{ actionResult }}
            </div>
          }
        </div>

        <!-- Panel 3: System diagnostics -->
        <div class="emergency-panel terminal-panel">
          <div class="panel-title">
            <span class="panel-icon">📟</span>
            <h2>Diagnostic Technique</h2>
          </div>
          <div class="terminal-logs">
            <div class="log-line">[INFO]   Chargement de mock-data.json...</div>
            <div class="log-line">[OK]     2 universités chargées</div>
            <div class="log-line">[OK]     2 étudiants chargés</div>
            <div class="log-line">[OK]     4 certificats chargés</div>
            <div class="log-line warn">[WARN]  Détection d'une note anormale (22/20)</div>
            <div class="log-line warn">[WARN]  Fichier Excel corrompu possible</div>
            <div class="log-line error">[ERROR] Transaction fantôme détectée: MTN-CU-2026-000125</div>
            <div class="log-line info">[INFO]  Tentative de récupération...</div>
          </div>

          <div class="terminal-actions">
            <button class="btn btn-sm btn-ghost" (click)="clearDiagnostics()">Effacer les logs</button>
          </div>
        </div>
      </div>

      <!-- Bottom actions -->
      <div class="bottom-actions">
        <button class="btn btn-outline" (click)="router.navigate(['/superadmin/console'])">
          ← Retour à la console principale
        </button>
      </div>
    </div>
  `,
  styles: [`
    .emergency-page { min-height: 100vh; background: #0B0F19; color: #E2E8F0; padding: 24px; }
    .emergency-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-left h1 { font-size: 22px; font-weight: 800; color: #FBBF24; }
    .warning-icon { font-size: 28px; }
    .emergency-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .emergency-panel { background: #111827; border: 1px solid #1F2937; border-radius: 12px; padding: 20px; }
    .panel-title { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .panel-title h2 { font-size: 15px; font-weight: 700; }
    .panel-icon { font-size: 18px; }
    .status-list { display: flex; flex-direction: column; gap: 10px; }
    .status-item { display: flex; justify-content: space-between; font-size: 13px; }
    .status-value.ok { color: #10B981; }
    .status-value.warning { color: #FBBF24; }
    .memory-section { margin-top: 20px; }
    .memory-header { display: flex; justify-content: space-between; font-size: 12px; color: #94A3B8; margin-bottom: 6px; }
    .memory-bar { height: 8px; background: #1F2937; border-radius: 4px; overflow: hidden; }
    .memory-fill { height: 100%; background: linear-gradient(90deg, #FBBF24, #EF4444); border-radius: 4px; }
    .emergency-actions-list { display: flex; flex-direction: column; gap: 12px; }
    .emergency-action {
      display: flex; align-items: center; gap: 12px; background: #1F2937; border: 1px solid #374151;
      border-radius: 10px; padding: 14px; cursor: pointer; color: white; text-align: left; transition: all 0.2s;
    }
    .emergency-action:hover { border-color: #FBBF24; background: #263244; }
    .action-icon { font-size: 24px; }
    .emergency-action strong { font-size: 14px; display: block; }
    .emergency-action p { font-size: 12px; color: #94A3B8; margin-top: 2px; }
    .reset-form { margin-top: 16px; background: #1F2937; padding: 16px; border-radius: 10px; }
    .terminal-panel { background: #0B0F19; }
    .terminal-logs { font-family: 'Courier New', monospace; font-size: 11px; max-height: 250px; overflow-y: auto; }
    .log-line { padding: 4px 0; color: #10B981; }
    .log-line.warn { color: #FBBF24; }
    .log-line.error { color: #EF4444; }
    .log-line.info { color: #3B82F6; }
    .action-result { margin-top: 16px; padding: 12px; border-radius: 8px; font-size: 13px; }
    .action-result.success { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid #10B981; }
    .action-result.error { background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid #EF4444; }
    .bottom-actions { margin-top: 24px; display: flex; justify-content: center; }
    @media (max-width: 1024px) {
      .emergency-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EmergencyComponent {
  showResetForm = false;
  targetUuid = '';
  paymentState = 'PENDING';
  actionResult = '';
  actionResultType: 'success' | 'error' = 'success';
  terminalLogs: string[] = [];

  constructor(public router: Router) {}

  resetTransaction(): void {
    this.showResetForm = !this.showResetForm;
    this.actionResult = '';
  }

  confirmReset(): void {
    if (!this.targetUuid) {
      this.actionResult = '❌ Erreur: UUID du certificat requis';
      this.actionResultType = 'error';
      return;
    }
    this.actionResult = `✅ Transaction ${this.targetUuid.substring(0, 12)}... réinitialisée à l'état ${this.paymentState}`;
    this.actionResultType = 'success';
    this.showResetForm = false;
  }

  restoreMockData(): void {
    this.actionResult = '✅ mock-data.json restauré avec succès. Toutes les données sont rechargées.';
    this.actionResultType = 'success';
  }

  forceSync(): void {
    this.actionResult = '✅ Synchronisation backend/frontend effectuée. État cohérent.';
    this.actionResultType = 'success';
  }

  clearDiagnostics(): void {
    this.terminalLogs = [];
  }
}