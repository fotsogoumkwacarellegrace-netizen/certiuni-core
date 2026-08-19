import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanner-ocr',
  imports: [CommonModule],
  template: `
    <div class="ocr-container">
      <header class="ocr-header">
        <button class="btn btn-ghost" (click)="router.navigate(['/verify'])">← Retour</button>
        <h2>Analyse Document par l'IA</h2>
        <span class="badge badge-production">IA Vision</span>
      </header>

      <div class="ocr-content">
        <!-- Drop zone -->
        <div
          class="drop-zone"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          [class.drag-over]="isDragOver"
          [class.scanning]="isScanning"
        >
          <!-- When resting -->
          @if (!isScanning && !scanComplete) {
            <div class="drop-content">
              <div class="robot-icon">🤖</div>
              <h3>Déposez la photo du diplôme</h3>
              <p>L'IA Vision extrait automatiquement l'UUID du document</p>
              <button class="btn btn-primary mt-3">Parcourir mes fichiers</button>
            </div>
          }

          <!-- When scanning -->
          @if (isScanning) {
            <div class="scanning-content">
              <div class="laser-line"></div>
              <div class="scanning-animation">📄</div>
              <h3>Analyse en cours...</h3>
              <p>Extraction de l'UUID par l'IA Vision</p>
            </div>
          }

          <!-- When complete -->
          @if (scanComplete) {
            <div class="complete-content">
              <div class="check-icon">✅</div>
              <h3>Document analysé avec succès !</h3>
              <p>UUID extrait : <code class="uuid-text">f81d4fae-7dec-11d0-a765-00a0c91e6bf6</code></p>
              <p class="student-detected">Étudiant détecté : Marie Ngo</p>
              <button class="btn btn-success btn-lg mt-4" (click)="goToVerdict()">
                Voir le résultat de vérification →
              </button>
            </div>
          }
        </div>

        <input
          #fileInput
          type="file"
          accept="image/*,.pdf"
          style="display: none"
          (change)="onFileSelected($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    .ocr-container { min-height: 100vh; background: #F9FAFB; }
    .ocr-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 32px; background: white; border-bottom: 2px solid #1E3A8A;
    }
    .ocr-header h2 { font-size: 20px; font-weight: 700; color: #111827; }
    .ocr-content { max-width: 640px; margin: 48px auto; padding: 0 24px; }
    .drop-zone {
      background: #EFF6FF; border: 3px dashed #3B82F6; border-radius: 24px;
      min-height: 360px; display: flex; align-items: center; justify-content: center;
      padding: 40px; cursor: pointer; transition: all 0.3s ease; text-align: center;
    }
    .drop-zone.drag-over { background: #DBEAFE; border-color: #1E3A8A; transform: scale(1.01); }
    .drop-zone.scanning { background: #111827; border-color: #3B82F6; }
    .drop-content h3 { font-size: 22px; color: #1E3A8A; margin-top: 16px; }
    .drop-content p { color: #6B7280; margin-top: 8px; }
    .robot-icon { font-size: 56px; }
    .scanning-content { position: relative; width: 100%; height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; }
    .scanning-animation { font-size: 64px; animation: float 1s ease-in-out infinite; }
    .laser-line {
      position: absolute; left: 20px; right: 20px; bottom: 80px; height: 3px;
      background: linear-gradient(90deg, transparent, #3B82F6, transparent);
      animation: laser-scan 1.2s ease-in-out infinite;
    }
    @keyframes laser-scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-120px); } }
    .complete-content { display: flex; flex-direction: column; align-items: center; }
    .check-icon { font-size: 56px; }
    .complete-content h3 { font-size: 22px; color: #065F46; margin-top: 16px; }
    .complete-content p { color: #6B7280; margin-top: 8px; }
    .uuid-text { background: #F3F4F6; padding: 4px 8px; border-radius: 6px; font-size: 13px; }
    .student-detected { font-weight: 600; color: #1E3A8A; }
  `]
})
export class ScannerOcrComponent {
  isDragOver = false;
  isScanning = false;
  scanComplete = false;
  private scanTimer: any;
  private completeTimer: any;

  constructor(public router: Router) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.isScanning) this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    this.startScan();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.startScan();
    }
  }

  startScan(): void {
    this.isScanning = true;
    this.scanComplete = false;

    // Simulate AI OCR scan: 2 seconds of laser animation
    this.scanTimer = setTimeout(() => {
      this.isScanning = false;
      this.scanComplete = true;
    }, 2000);
  }

  goToVerdict(): void {
    // Load Marie Ngo's data from mock - simulate OCR extraction
    this.router.navigate(['/verify/f81d4fae-7dec-11d0-a765-00a0c91e6bf6']);
  }
}
