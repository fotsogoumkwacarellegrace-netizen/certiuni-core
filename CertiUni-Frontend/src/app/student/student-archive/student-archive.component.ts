import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-archive',
  imports: [CommonModule],
  template: `
    <div class="archive-page">
      <header class="archive-header">
        <button class="btn btn-ghost" (click)="router.navigate(['/student/dashboard'])">← Retour</button>
        <h2>Archive Financière</h2>
        <span class="badge badge-production">2 transactions</span>
      </header>

      <div class="archive-content">
        <div class="archive-card">
          <div class="archive-header-card">
            <div class="archive-icon">📁</div>
            <div>
              <h3>Historique des paiements</h3>
              <p>Retrouvez l'ensemble de vos reçus de paiement</p>
            </div>
          </div>
          <div class="archive-list">
            <div class="archive-item">
              <div class="item-left">
                <span class="item-icon">📱</span>
                <div>
                  <strong>Master en Génie Logiciel</strong>
                  <p>MTN Mobile Money · 15/07/2026</p>
                </div>
              </div>
              <div class="item-right">
                <span class="badge badge-paid">Payé</span>
                <button class="btn btn-sm btn-ghost" (click)="downloadReceipt()">⬇ Reçu</button>
              </div>
            </div>
            <div class="archive-item">
              <div class="item-left">
                <span class="item-icon">🎓</span>
                <div>
                  <strong>Licence Sc. Économiques</strong>
                  <p>Exempté · 20/07/2026</p>
                </div>
              </div>
              <div class="item-right">
                <span class="badge badge-valid">Exempté</span>
                <button class="btn btn-sm btn-ghost" (click)="downloadReceipt()">⬇ Reçu</button>
              </div>
            </div>
          </div>
        </div>

        <div class="archive-card">
          <div class="archive-header-card">
            <div class="archive-icon">📊</div>
            <div>
              <h3>Résumé financier</h3>
            </div>
          </div>
          <div class="summary-grid">
            <div class="summary-item">
              <span>Total payé</span>
              <strong>1 000 FCFA</strong>
            </div>
            <div class="summary-item">
              <span>Transactions</span>
              <strong>2</strong>
            </div>
            <div class="summary-item">
              <span>Exemptions</span>
              <strong>1</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .archive-page { min-height: 100vh; background: #F9FAFB; }
    .archive-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: white; border-bottom: 2px solid #1E3A8A; }
    .archive-header h2 { font-size: 18px; font-weight: 700; }
    .archive-content { max-width: 800px; margin: 32px auto; padding: 0 24px; display: flex; flex-direction: column; gap: 24px; }
    .archive-card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #E5E7EB; }
    .archive-header-card { display: flex; align-items: center; gap: 16px; padding: 20px; border-bottom: 1px solid #F3F4F6; }
    .archive-icon { font-size: 32px; }
    .archive-header-card h3 { font-size: 16px; font-weight: 700; }
    .archive-header-card p { font-size: 13px; color: #6B7280; }
    .archive-list { padding: 8px; }
    .archive-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F9FAFB; }
    .item-left { display: flex; align-items: center; gap: 12px; }
    .item-icon { width: 40px; height: 40px; border-radius: 10px; background: #EFF6FF; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .item-left strong { font-size: 14px; }
    .item-left p { font-size: 12px; color: #6B7280; margin-top: 2px; }
    .item-right { display: flex; align-items: center; gap: 8px; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 20px; }
    .summary-item { text-align: center; }
    .summary-item span { font-size: 13px; color: #6B7280; display: block; }
    .summary-item strong { font-size: 20px; color: #1E3A8A; }
    @media (max-width: 768px) {
      .archive-header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
      .archive-content { padding: 0 16px; }
      .summary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class StudentArchiveComponent {
  constructor(public router: Router) {}
  downloadReceipt(): void { window.print(); }
}