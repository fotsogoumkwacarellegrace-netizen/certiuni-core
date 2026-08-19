import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ImportRow {
  first_name: string;
  last_name: string;
  email: string;
  course_title: string;
  final_grade: string;
  issue_date: string;
}

interface ErrorRow {
  row: number;
  student_name: string;
  field: string;
  value: string;
  error: string;
}

@Component({
  selector: 'app-school-center',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="school-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
          <span>CertiUni</span>
        </div>
        <nav>
          <button class="nav-item" (click)="router.navigate(['/admin/dashboard'])">
            <span>📊</span><span class="label">Tour de contrôle</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/templates'])">
            <span>🎨</span><span class="label">Studio de Design IA</span>
          </button>
          <button class="nav-item active" (click)="router.navigate(['/admin/integrations'])">
            <span>📁</span><span class="label">Centre de Scolarité</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/messages'])">
            <span>💬</span><span class="label">Messagerie & Notifications</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/security'])">
            <span>🛡️</span><span class="label">Alerte Cybersécurité</span>
          </button>
        </nav>
        <button class="nav-item logout" (click)="router.navigate(['/admin/login'])">
          <span>🚪</span><span class="label">Déconnexion</span>
        </button>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Centre de Scolarité & Fichiers</h1>
            <p class="text-gray">Importez les fichiers Excel de délibérations pour émettre les diplômes en masse</p>
          </div>
          <button class="btn btn-outline" (click)="openTemplateModal()">📋 Gabarit Modèle Excel</button>
        </div>

        <!-- Import area (Screen 32) -->
        <div class="card import-card">
          <div
            class="import-drop-zone"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [class.drag-over]="isDragOver"
          >
            <div class="drop-icon">📁</div>
            <h3>Déposez votre fichier Excel de délibérations</h3>
            <p>Formats acceptés: .xlsx, .xls, .csv — Analyse IA automatique du contenu</p>
            <button class="btn btn-primary" (click)="fileInput.click()">Parcourir le fichier des notes</button>
          </div>
          <input #fileInput type="file" accept=".xlsx,.xls,.csv" style="display:none" (change)="onFileSelected($event)" />

          <!-- Processing animation -->
          @if (isProcessing) {
            <div class="processing-overlay">
              <div class="processing-icon spinner">🤖</div>
              <h3>Analyse IA en cours...</h3>
              <p>Contrôle qualité des données du fichier</p>
            </div>
          }
        </div>

        <!-- AI Inspector (Screen 34) -->
        @if (analysisComplete) {
          <div class="card inspector-card mt-4">
            <div class="inspector-header">
              <div class="inspector-title">
                <span class="inspector-icon">🤖</span>
                <div>
                  <h3>Inspecteur d'Erreurs IA</h3>
                  <p class="text-sm text-gray">Contrôle qualité automatique des données importées</p>
                </div>
              </div>
              <div class="inspector-stats">
                <span class="badge badge-valid">{{ validCount }} valides</span>
                <span class="badge" [class.badge-revoked]="errors.length > 0" [class.badge-valid]="errors.length === 0">
                  {{ errors.length }} erreurs
                </span>
              </div>
            </div>

            <!-- Errors table -->
            @if (errors.length > 0) {
              <table class="data-table error-table">
                <thead>
                  <tr>
                    <th>Ligne</th>
                    <th>Étudiant</th>
                    <th>Champ</th>
                    <th>Valeur actuelle</th>
                    <th>Erreur détectée</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (error of errors; track error.row) {
                    <tr>
                      <td>{{ error.row }}</td>
                      <td>{{ error.student_name }}</td>
                      <td>{{ error.field }}</td>
                      <td class="error-value">{{ error.value }}</td>
                      <td class="error-msg">{{ error.error }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline" (click)="editError(error)">✏️ Corriger</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="all-clear">
                ✅ Aucune erreur détectée. Toutes les données sont valides !
              </div>
            }

            <!-- Emission button (disabled while errors remain) -->
            <div class="emission-section">
              <button class="btn btn-success btn-lg" (click)="emitCertificates()" [disabled]="errors.length > 0">
                🚀 Émettre et notariser les diplômes (SHA-256)
              </button>
              @if (errors.length > 0) {
                <p class="text-warning text-sm mt-2">⚠️ Corrigez toutes les erreurs avant l'émission</p>
              }
              @if (emissionSuccess) {
                <div class="emission-success">✅ {{ emittedCount }} diplômes émis et notarisés avec succès !</div>
              }
            </div>
          </div>
        }

        <!-- Template modal (Screen 33) -->
        @if (templateModalOpen) {
          <div class="modal-overlay" (click)="closeTemplateModal()"></div>
          <div class="template-modal">
            <h3>📋 Gabarit Modèle Excel CertiUni</h3>
            <p class="text-gray">Téléchargez le fichier Excel normalisé pour préparer vos délibérations</p>

            <div class="template-columns">
              <h5>Colonnes requises:</h5>
              <code>first_name</code>
              <code>last_name</code>
              <code>email</code>
              <code>course_title</code>
              <code>final_grade</code>
              <code>issue_date</code>
            </div>

            <button class="btn btn-success btn-lg btn-block" (click)="downloadTemplate()">
              ⬇ Télécharger le gabarit (.xlsx)
            </button>
            <button class="btn btn-ghost btn-block mt-2" (click)="closeTemplateModal()">Fermer</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .school-layout { min-height: 100vh; display: flex; background: #F9FAFB; }
    .main-content { flex: 1; margin-left: 260px; padding: 24px 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 800; }
    .import-card { position: relative; padding: 32px; }
    .import-drop-zone {
      border: 4px dashed #9CA3AF; border-radius: 20px; padding: 48px 24px; text-align: center;
      transition: all 0.3s; cursor: pointer;
    }
    .import-drop-zone.drag-over { border-color: #1E3A8A; background: #EFF6FF; }
    .drop-icon { font-size: 48px; margin-bottom: 12px; }
    .import-drop-zone h3 { font-size: 20px; font-weight: 700; }
    .import-drop-zone p { color: #6B7280; margin: 8px 0 20px; }
    .processing-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.95); border-radius: 12px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;
    }
    .processing-icon { font-size: 48px; }
    .inspector-card { padding: 24px; }
    .inspector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .inspector-title { display: flex; align-items: center; gap: 12px; }
    .inspector-icon { font-size: 32px; }
    .inspector-title h3 { font-size: 16px; font-weight: 700; }
    .inspector-stats { display: flex; gap: 8px; }
    .error-table { margin-top: 12px; }
    .error-table td { background: rgba(254, 226, 226, 0.3); }
    .error-value { color: #DC2626; font-family: monospace; }
    .error-msg { color: #991B1B; font-weight: 500; }
    .all-clear {
      background: #F0FDF4; border: 1px solid #86EFAC; color: #065F46;
      padding: 16px; border-radius: 8px; margin-top: 16px; font-weight: 500;
    }
    .emission-section { margin-top: 24px; text-align: center; }
    .emission-success {
      background: #F0FDF4; border: 1px solid #86EFAC; color: #065F46;
      padding: 12px; border-radius: 8px; margin-top: 16px; font-weight: 600;
    }
    .template-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; border-radius: 16px; padding: 32px; width: 90%; max-width: 480px;
      z-index: 999; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .template-modal h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .template-columns { margin: 20px 0; display: flex; flex-wrap: wrap; gap: 8px; }
    .template-columns h5 { width: 100%; font-size: 13px; color: #6B7280; margin-bottom: 8px; }
    .template-columns code {
      background: #F3F4F6; padding: 6px 12px; border-radius: 6px;
      font-family: monospace; font-size: 12px;
    }
    .nav-item.logout { margin-top: auto; color: #EF4444; }
    @media (max-width: 1024px) {
      .main-content { margin-left: 70px; }
    }
    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 16px; }
      .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }
      .inspector-header { flex-direction: column; gap: 12px; }
    }
  `]
})
export class SchoolCenterComponent {
  isDragOver = false;
  isProcessing = false;
  analysisComplete = false;
  emissionSuccess = false;
  emittedCount = 0;
  templateModalOpen = false;
  validCount = 0;

  errors: ErrorRow[] = [];
  private importedRows: ImportRow[] = [];

  constructor(public router: Router) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.startAnalysis();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.startAnalysis();
    }
  }

  startAnalysis(): void {
    this.isProcessing = true;
    this.analysisComplete = false;
    this.emissionSuccess = false;

    // Simulate file parse + AI analysis (2.5 seconds)
    setTimeout(() => {
      this.isProcessing = false;
      this.analysisComplete = true;

      // Simulate errors found by AI
      this.errors = [
        { row: 3, student_name: 'Marie Ngo', field: 'final_grade', value: '22/20', error: 'Note supérieure à 20' },
        { row: 7, student_name: 'Jean Modo', field: 'first_name', value: 'jean', error: 'Casse incorrecte (minuscules)' }
      ];
      this.validCount = 8;
    }, 2500);
  }

  editError(error: ErrorRow): void {
    // Simulate inline edit - fix the error
    if (error.field === 'final_grade') {
      error.value = '16/20';
    } else if (error.field === 'first_name') {
      error.value = 'Jean';
    }
    error.error = '✓ Corrigé';
    this.errors = this.errors.filter(e => e.error !== '✓ Corrigé' || e.row !== error.row || (e.error === '✓ Corrigé' && e.row === error.row));
    // Remove error from list since it's fixed
    this.errors = this.errors.filter(e => e.row !== error.row);
    this.validCount++;
  }

  emitCertificates(): void {
    this.emissionSuccess = true;
    this.emittedCount = 10;
  }

  openTemplateModal(): void { this.templateModalOpen = true; }
  closeTemplateModal(): void { this.templateModalOpen = false; }

  downloadTemplate(): void {
    // Generate a CSV template file
    const csv = 'first_name,last_name,email,course_title,final_grade,issue_date\n' +
      'Marie,Ngo,marie.ngo@univ-douala.cm,Master en Génie Logiciel,16.5/20,2026-07-15\n' +
      'Jean,Modo,jean.modo@univ-yaounde1.cm,Licence en Sciences Économiques,12.0/20,2026-07-20';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gabarit_certiuni.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
    this.closeTemplateModal();
  }
}