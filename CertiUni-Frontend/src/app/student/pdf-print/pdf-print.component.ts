import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-print',
  imports: [CommonModule],
  template: `
    <div class="print-page">
      <!-- Export format selection (Screen 22) -->
      <div class="format-selector">
        <button class="format-option" (click)="router.navigate(['/student/dashboard'])">
          <span>📄</span>
          <div>
            <strong>Fichier Officiel Standard (PDF)</strong>
            <p>Version numérique authentique</p>
          </div>
          <span class="arrow">→</span>
        </button>
        <button class="format-option active" (click)="selectedFormat = 'print'">
          <span>🖨️</span>
          <div>
            <strong>Copie Conforme pour Impression</strong>
            <p>Avec filigrane de sécurité et tampon officiel</p>
          </div>
          <span class="arrow">→</span>
        </button>
      </div>

      <!-- A4 diploma sheet (Screen 23) -->
      <div class="paper-container">
        <div class="a4-sheet" [class.ready]="selectedFormat === 'print'">
          <!-- Blue certification band -->
          <div class="certification-band">
            <p>REPUBLIQUE DU CAMEROUN — MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR</p>
            <strong>CERTIUNI - COPIE CONFORME NUMÉRIQUE</strong>
          </div>

          <!-- Diploma content -->
          <div class="diploma-content">
            <div class="university-header">
              <h1>Universite De Douala</h1>
              <p>Faculté des Sciences</p>
            </div>

            <div class="diploma-title">
              <h2>MASTER EN GÉNIE LOGICIEL</h2>
              <p>Délivré à</p>
            </div>

            <div class="student-name">
              <h3>Marie NGO</h3>
              <p>Née le 15 Mars 1998 à Douala</p>
            </div>

            <div class="grade-section">
              <p>Mention obtenue:</p>
              <strong>16.5/20 — TRÈS BIEN</strong>
            </div>

            <div class="diploma-meta">
              <p>Date d'émission: 15 Juillet 2026</p>
              <p>UUID: f81d4fae-7dec-11d0-a765-00a0c91e6bf6</p>
              <p class="hash">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
            </div>
          </div>

          <!-- CertiUni watermark (5% opacity, -30deg) -->
          <div class="watermark-layer">
            @for (i of [1,2,3,4,5,6,7,8,9]; track i) {
              <span class="watermark-text">CertiUni</span>
            }
          </div>

          <!-- Red stamp (tampon) -->
          <div class="red-stamp">
            <p>RECTORAT</p>
            <p>UNIVERSITÉ DE DOUALA</p>
            <p>LE 15/07/2026</p>
          </div>

          <!-- QR code placeholder -->
          <div class="qr-placeholder" (click)="verifyQr()">QR</div>

          <!-- Signature -->
          <div class="signature-line">
            <p>Le Recteur,</p>
            <div class="sig-spot">Signé numériquement</div>
            <p class="signature-name">Pr. NDOUMBE</p>
          </div>
        </div>
      </div>

      <!-- Print actions -->
      <div class="print-actions">
        <button class="btn btn-success btn-lg" (click)="print()">🖨️ Imprimer le document</button>
        <button class="btn btn-outline" (click)="router.navigate(['/student/dashboard'])">← Retour</button>
      </div>
    </div>
  `,
  styles: [`
    .print-page { min-height: 100vh; background: #F3F4F6; padding: 32px 16px; }
    .format-selector { max-width: 700px; margin: 0 auto 24px; display: flex; flex-direction: column; gap: 12px; }
    .format-option {
      display: flex; align-items: center; gap: 16px; width: 100%; padding: 16px;
      background: white; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer; transition: all 0.2s;
    }
    .format-option:hover, .format-option.active { border-color: #1E3A8A; background: #EFF6FF; }
    .format-option > span:first-child { font-size: 28px; }
    .format-option div { flex: 1; text-align: left; }
    .format-option strong { display: block; }
    .format-option p { font-size: 13px; color: #6B7280; }
    .arrow { color: #1E3A8A; font-weight: 700; }
    .paper-container { display: flex; justify-content: center; }
    .a4-sheet {
      width: 794px; min-height: 1123px; background: white; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px; position: relative; overflow: hidden; transition: opacity 0.3s; opacity: 0.4;
    }
    .a4-sheet.ready { opacity: 1; }
    .certification-band { background: #1E3A8A; color: white; text-align: center; padding: 12px; margin-bottom: 40px; border-radius: 4px; }
    .certification-band p { font-size: 10px; letter-spacing: 1px; }
    .certification-band strong { font-size: 13px; letter-spacing: 0.5px; }
    .diploma-content { text-align: center; position: relative; z-index: 2; }
    .university-header h1 { font-size: 28px; color: #1E3A8A; text-transform: uppercase; }
    .university-header p { font-size: 14px; color: #6B7280; margin-top: 4px; }
    .diploma-title { margin-top: 60px; }
    .diploma-title h2 { font-size: 24px; color: #111827; letter-spacing: 2px; }
    .diploma-title p { font-size: 14px; color: #6B7280; margin-top: 16px; }
    .student-name { margin-top: 40px; }
    .student-name h3 { font-size: 36px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 4px; }
    .student-name p { font-size: 14px; color: #6B7280; margin-top: 8px; }
    .grade-section { margin-top: 40px; }
    .grade-section p { font-size: 14px; color: #6B7280; }
    .grade-section strong { font-size: 18px; color: #065F46; display: block; margin-top: 8px; }
    .diploma-meta { margin-top: 48px; font-size: 11px; color: #9CA3AF; }
    .diploma-meta .hash { font-family: monospace; font-size: 9px; word-break: break-all; margin-top: 4px; }
    .watermark-layer {
      position: absolute; inset: 0; display: flex; flex-wrap: wrap; justify-content: space-around;
      align-content: space-around; transform: rotate(-30deg); width: 200%; left: -50%; top: -10%; pointer-events: none;
    }
    .watermark-text { font-size: 48px; font-weight: 800; color: #1E3A8A; opacity: 0.05; white-space: nowrap; }
    .red-stamp {
      position: absolute; bottom: 100px; right: 40px; border: 3px dashed #EF4444; color: #EF4444;
      padding: 12px 20px; transform: rotate(-5deg); text-align: center; border-radius: 4px;
      font-size: 11px; font-weight: 600; text-transform: uppercase; line-height: 1.5; z-index: 2;
    }
    .qr-placeholder {
      position: absolute; bottom: 180px; right: 60px; width: 64px; height: 64px;
      border: 2px solid #111827; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 20px; cursor: pointer; z-index: 2;
    }
    .signature-line { position: absolute; bottom: 80px; left: 60px; text-align: center; z-index: 2; }
    .signature-line p { font-size: 12px; color: #6B7280; }
    .sig-spot { width: 180px; height: 50px; border-bottom: 2px solid #374151; margin: 8px 0; display: flex; align-items: flex-end; justify-content: center; font-size: 11px; color: #9CA3AF; }
    .signature-name { font-weight: 600; color: #374151; }
    .print-actions { display: flex; justify-content: center; gap: 12px; margin-top: 24px; max-width: 700px; margin-left: auto; margin-right: auto; }
    @media print {
      .format-selector, .print-actions { display: none; }
      .print-page { background: white; padding: 0; }
      .a4-sheet { box-shadow: none; opacity: 1; }
    }
    @media (max-width: 840px) {
      .a4-sheet { width: 100%; min-height: auto; transform: scale(0.9); transform-origin: top; }
    }
  `]
})
export class PdfPrintComponent {
  selectedFormat: string = 'print';
  constructor(public router: Router) {}

  print(): void {
    window.print();
  }

  verifyQr(): void {
    this.router.navigate(['/verify/f81d4fae-7dec-11d0-a765-00a0c91e6bf6']);
  }
}