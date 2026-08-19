import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface BulkEntry {
  uuid: string;
  name: string;
  diploma: string;
  status: string;
  university?: string;
  date?: string;
}

@Component({
  selector: 'app-bulk-verification',
  imports: [CommonModule],
  template: `
    <div class="bulk-container">
      <header class="bulk-header">
        <button class="btn btn-ghost" (click)="router.navigate(['/verify'])">← Retour</button>
        <h2>Tableau de Masse — Bulk Verification</h2>
        <span class="badge badge-production">{{ results.length }} CV analysés</span>
      </header>

      <div class="bulk-content">
        <!-- Summary cards -->
        <div class="summary-row">
          <div class="summary-card">
            <div class="sum-value text-success">{{ getStatusCount('VALID') }}</div>
            <div class="sum-label">Valides</div>
          </div>
          <div class="summary-card">
            <div class="sum-value text-danger">{{ getStatusCount('REVOKED') }}</div>
            <div class="sum-label">Révoqués</div>
          </div>
          <div class="summary-card">
            <div class="sum-value text-gray">{{ getStatusCount('NOT_FOUND') }}</div>
            <div class="sum-label">Introuvables</div>
          </div>
          <div class="summary-card">
            <div class="sum-value text-primary">{{ results.length }}</div>
            <div class="sum-label">Total</div>
          </div>
        </div>

        <!-- Results table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>UUID</th>
                <th>Nom</th>
                <th>Diplôme</th>
                <th>Université</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of results; track entry.uuid) {
                <tr [class.row-valid]="entry.status === 'VALID'" [class.row-revoked]="entry.status === 'REVOKED'" [class.row-notfound]="entry.status === 'NOT_FOUND'">
                  <td class="uuid-cell">{{ entry.uuid }}</td>
                  <td class="name-cell" (click)="openSidePanel(entry)">
                    <strong>{{ entry.name }}</strong>
                  </td>
                  <td>{{ entry.diploma }}</td>
                  <td>{{ entry.university || '—' }}</td>
                  <td>
                    <span [class]="'badge ' + getBadgeClass(entry.status)">
                      {{ getStatusLabel(entry.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="viewDetail(entry.uuid)">Voir</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="actions-row">
          <button class="btn btn-success" (click)="exportReport()">
            ⬇ Exporter le Rapport Final (.xlsx)
          </button>
          <button class="btn btn-ghost" (click)="router.navigate(['/verify'])">Retour à l'accueil</button>
        </div>
      </div>

      <!-- Side panel (Screen 9 - Volet latéral des notes) -->
      @if (selectedEntry) {
        <div class="drawer-overlay" (click)="closeSidePanel()"></div>
        <div class="drawer-right slide-in-right">
          <div class="drawer-header">
            <h3>Notes du candidat</h3>
            <button class="btn btn-ghost" (click)="closeSidePanel()">✕</button>
          </div>
          <div class="drawer-body">
            <div class="candidate-info">
              <div class="avatar">{{ getInitials(selectedEntry.name) }}</div>
              <h4>{{ selectedEntry.name }}</h4>
              <p>{{ selectedEntry.diploma }}</p>
              <span [class]="'badge ' + getBadgeClass(selectedEntry.status)">
                {{ getStatusLabel(selectedEntry.status) }}
              </span>
            </div>

            <!-- Subjects from mock data -->
            <div class="subjects-list">
              <h5>Matières & notes</h5>
              @for (subject of getStudentSubjects(selectedEntry.uuid); track subject.name) {
                <div class="subject-row">
                  <span>{{ subject.name }}</span>
                  <strong>{{ subject.grade }}</strong>
                </div>
              }
            </div>

            <button class="btn btn-primary btn-block mt-4" (click)="viewDetail(selectedEntry.uuid)">
              Voir le diplôme complet
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .bulk-container { min-height: 100vh; background: #F9FAFB; }
    .bulk-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 32px; background: white; border-bottom: 2px solid #1E3A8A;
    }
    .bulk-header h2 { font-size: 18px; font-weight: 700; }
    .bulk-content { max-width: 1200px; margin: 32px auto; padding: 0 24px; }
    .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .summary-card {
      background: white; border-radius: 12px; padding: 20px; text-align: center;
      border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .sum-value { font-size: 32px; font-weight: 800; }
    .sum-label { font-size: 14px; color: #6B7280; margin-top: 4px; }
    .table-wrapper { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow-x: auto; }
    .uuid-cell { font-family: monospace; font-size: 12px; color: #6B7280; }
    .name-cell { cursor: pointer; }
    .name-cell:hover { color: #1E3A8A; text-decoration: underline; }
    .row-valid td { background: rgba(16, 185, 129, 0.03); }
    .row-revoked td { background: rgba(239, 68, 68, 0.05); }
    .row-notfound td { background: rgba(107, 114, 128, 0.05); }
    .actions-row { display: flex; justify-content: space-between; margin-top: 24px; flex-wrap: wrap; gap: 12px; }
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 998; }
    .drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #E5E7EB; }
    .drawer-body { padding: 20px; }
    .candidate-info { text-align: center; padding: 16px 0; }
    .avatar {
      width: 64px; height: 64px; border-radius: 50%; background: #1E3A8A; color: white;
      display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;
      margin: 0 auto 12px;
    }
    .candidate-info h4 { font-size: 18px; font-weight: 700; }
    .candidate-info p { color: #6B7280; font-size: 14px; margin: 4px 0 8px; }
    .subjects-list { margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 16px; }
    .subjects-list h5 { font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .subject-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
    .subject-row strong { color: #1E3A8A; }
    @media (max-width: 768px) {
      .summary-row { grid-template-columns: repeat(2, 1fr); }
      .bulk-header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
    }
  `]
})
export class BulkVerificationComponent {
  // Data loaded from mock-data.json
  results: BulkEntry[] = [
    { uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', name: 'Marie Ngo', diploma: 'Master Génie Logiciel', status: 'VALID', university: 'Université de Douala', date: '2026-07-15' },
    { uuid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', name: 'Jean Modo', diploma: 'Licence Sc. Économiques', status: 'VALID', university: 'Université de Yaoundé I', date: '2026-07-20' },
    { uuid: 'c1a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', name: 'Pauline Etoundi', diploma: 'Master Droit des Affaires', status: 'VALID', university: 'Université de Douala', date: '2026-06-30' },
    { uuid: 'd2e3f4a5-b6c7-d8e9-f0a1-b2c3d4e5f6a7', name: 'Samuel Kamga', diploma: 'Licence Biologie', status: 'VALID', university: 'Université de Yaoundé I', date: '2026-07-10' },
    { uuid: 'f0000000-0000-0000-0000-000000000000', name: 'Alain Tchakounté', diploma: 'Faux Diplôme Détecté', status: 'REVOKED', university: 'Inconnu', date: 'N/A' },
    { uuid: 'e4444444-4444-4444-4444-444444444444', name: 'Inconnu', diploma: 'Code Inexistant', status: 'NOT_FOUND', university: 'Inconnu', date: 'N/A' },
    { uuid: 'b3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', name: 'Clarisse Mbarga', diploma: 'Master Marketing Digital', status: 'VALID', university: 'Université de Douala', date: '2026-07-05' },
    { uuid: 'a4b5c6d7-e8f9-a0b1-c2d3-e4f5a6b7c8d9', name: 'Hervé Nana', diploma: 'Licence Chimie', status: 'VALID', university: 'Université de Yaoundé I', date: '2026-06-25' }
  ];

  selectedEntry: BulkEntry | null = null;

  private mockSubjects: Record<string, { name: string; grade: string }[]> = {
    'f81d4fae-7dec-11d0-a765-00a0c91e6bf6': [
      { name: 'Algorithmique Avancée', grade: '17/20' },
      { name: 'Architecture Logicielle', grade: '16/20' },
      { name: 'Bases de Données', grade: '18/20' },
      { name: 'Génie Logiciel', grade: '15/20' }
    ],
    '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d': [
      { name: 'Microéconomie', grade: '13/20' },
      { name: 'Macroéconomie', grade: '11/20' },
      { name: 'Statistiques', grade: '12/20' }
    ],
    'c1a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c': [
      { name: 'Droit Commercial', grade: '16/20' },
      { name: 'Droit des Sociétés', grade: '15/20' },
      { name: 'Droit Fiscal', grade: '14/20' }
    ],
    'b3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8': [
      { name: 'Marketing Digital', grade: '17/20' },
      { name: 'Stratégie de Marque', grade: '16/20' },
      { name: 'E-commerce', grade: '18/20' }
    ]
  };

  constructor(public router: Router) {}

  getStatusCount(status: string): number {
    return this.results.filter(r => r.status === status).length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'VALID': return '✓ Valide';
      case 'REVOKED': return '✗ Révoqué';
      case 'NOT_FOUND': return '? Introuvable';
      default: return status;
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'VALID': return 'badge-valid';
      case 'REVOKED': return 'badge-revoked';
      default: return 'badge-notfound';
    }
  }

  openSidePanel(entry: BulkEntry): void {
    this.selectedEntry = entry;
  }

  closeSidePanel(): void {
    this.selectedEntry = null;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getStudentSubjects(uuid: string): { name: string; grade: string }[] {
    return this.mockSubjects[uuid] || [{ name: 'Parcours standard', grade: 'Non disponible' }];
  }

  viewDetail(uuid: string): void {
    this.selectedEntry = null;
    this.router.navigate(['/verify', uuid]);
  }

  exportReport(): void {
    // Simulate export - generate a CSV file
    const csvContent = 'UUID,Nom,Diplôme,Statut\n' +
      this.results.map(r => `${r.uuid},${r.name},${r.diploma},${r.status}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'certiuni_bulk_report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
