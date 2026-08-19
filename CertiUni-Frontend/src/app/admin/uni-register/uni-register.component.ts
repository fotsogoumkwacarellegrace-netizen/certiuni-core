import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-uni-register',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-page">
      <header class="register-header">
        <button class="btn btn-ghost" (click)="router.navigate(['/verify'])">← Accueil</button>
        <h2>Inscription Institution — Multi-Tenant</h2>
      </header>

      <!-- Stepper -->
      <div class="stepper-container">
        <div class="stepper">
          @for (step of steps; track step.num; let i = $index) {
            <div class="step-item" [class.active]="currentStep === step.num" [class.completed]="currentStep > step.num">
              <div class="step-circle">{{ currentStep > step.num ? '✓' : step.num }}</div>
              <span class="step-label">{{ step.label }}</span>
            </div>
            @if (i < steps.length - 1) {
              <div class="step-line" [class.active]="currentStep > step.num"></div>
            }
          }
        </div>

        <!-- Step content -->
        <div class="step-content card">
          <!-- STEP 1: Email + DNS verification -->
          @if (currentStep === 1) {
            <div class="step-panel fade-in">
              <h3>Vérification DNS du domaine académique</h3>
              <p class="text-gray">Entrez votre email professionnel pour vérifier automatiquement votre appartenance académique.</p>

              <div class="form-group mt-6">
                <label class="form-label">Nom de l'institution</label>
                <input type="text" class="form-input" [(ngModel)]="universityName" placeholder="Ex: Université de Douala" />
              </div>
              <div class="form-group">
                <label class="form-label">Email professionnel</label>
                <input type="email" class="form-input" [(ngModel)]="adminEmail" placeholder="ex: doyen@univ-douala.cm" (keyup.enter)="nextStep()" />
              </div>

              <button class="btn btn-primary btn-lg mt-4" (click)="verifyDns()" [disabled]="!adminEmail || dnsChecking">
                @if (dnsChecking) { ⏳ Vérification DNS... } @else { 🔍 Vérifier mon domaine académique }
              </button>

              @if (dnsVerified) {
                <div class="dns-success">
                  ✅ Domaine académique vérifié avec succès !
                </div>
              }
            </div>
          }

          <!-- STEP 2: Upload ministerial decree -->
          @if (currentStep === 2) {
            <div class="step-panel fade-in">
              <h3>Décret Ministériel (MINESUP)</h3>
              <p class="text-gray">Téléversez l'Arrêté Ministériel du MINESUP autorisant votre établissement.</p>

              <div class="upload-zone" (click)="decreeInput.click()">
                <span class="upload-icon">📄</span>
                <strong>{{ decreeFile ? decreeFile : 'Cliquez pour téléverser l\'Arrêté (PDF)' }}</strong>
                <p>Formats acceptés: PDF — Taille max: 5 Mo</p>
              </div>
              <input #decreeInput type="file" accept=".pdf" style="display:none" (change)="onFileSelect($event, 'decree')" />

              @if (decreeUploaded) {
                <div class="upload-success">
                  ✅ Arrêté téléversé et validé par le système
                </div>
              }

              <button class="btn btn-primary btn-lg mt-4" (click)="nextStep()" [disabled]="!decreeUploaded">Continuer →</button>
              <button class="btn btn-ghost mt-2" (click)="prevStep()">← Retour</button>
            </div>
          }

          <!-- STEP 3: Canvas signature -->
          @if (currentStep === 3) {
            <div class="step-panel fade-in">
              <h3>Signature manuscrite du Doyen</h3>
              <p class="text-gray">Dessinez votre signature dans le cadre ci-dessous à la souris ou au doigt.</p>

              <div class="signature-canvas-wrap">
                <canvas #signatureCanvas class="signature-canvas" (mousedown)="startDraw($event)" (mousemove)="draw($event)" (mouseup)="stopDraw()" (mouseleave)="stopDraw()"></canvas>
                <button class="btn btn-sm btn-ghost clear-sign" (click)="clearSignature()">Effacer</button>
              </div>

              <button class="btn btn-primary btn-lg btn-block mt-4" (click)="completeRegistration()">
                🎓 Activer mon espace institution (Mode Sandbox)
              </button>
              <button class="btn btn-ghost mt-2" (click)="prevStep()">← Retour</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page { min-height: 100vh; background: #F9FAFB; }
    .register-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: white; border-bottom: 2px solid #1E3A8A; }
    .register-header h2 { font-size: 18px; font-weight: 700; }
    .stepper-container { max-width: 800px; margin: 40px auto; padding: 0 24px; }
    .stepper { display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
    .step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .step-circle {
      width: 40px; height: 40px; border-radius: 50%; background: white; border: 3px solid #D1D5DB;
      color: #9CA3AF; font-weight: 700; display: flex; align-items: center; justify-content: center;
      transition: all 0.3s;
    }
    .step-item.active .step-circle { border-color: #1E3A8A; color: #1E3A8A; background: #EFF6FF; }
    .step-item.completed .step-circle { border-color: #10B981; color: white; background: #10B981; }
    .step-label { font-size: 12px; color: #6B7280; font-weight: 500; }
    .step-item.active .step-label { color: #1E3A8A; font-weight: 700; }
    .step-line { width: 80px; height: 2px; background: #E5E7EB; margin: 0 12px; }
    .step-line.active { background: #10B981; }
    .step-content { max-width: 600px; margin: 0 auto; padding: 32px; }
    .step-panel h3 { font-size: 24px; font-weight: 800; color: #111827; }
    .dns-success { background: #F0FDF4; border: 1px solid #86EFAC; color: #065F46; padding: 12px; border-radius: 8px; margin-top: 16px; font-weight: 500; }
    .upload-zone {
      border: 3px dashed #9CA3AF; border-radius: 16px; padding: 40px; text-align: center;
      cursor: pointer; transition: all 0.3s; margin-top: 24px;
    }
    .upload-zone:hover { border-color: #1E3A8A; background: #EFF6FF; }
    .upload-icon { font-size: 40px; display: block; margin-bottom: 12px; }
    .upload-zone strong { display: block; color: #111827; }
    .upload-zone p { font-size: 13px; color: #6B7280; margin-top: 8px; }
    .upload-success { background: #F0FDF4; border: 1px solid #86EFAC; color: #065F46; padding: 12px; border-radius: 8px; margin-top: 16px; font-weight: 500; }
    .signature-canvas-wrap { position: relative; margin-top: 24px; }
    .signature-canvas { width: 100%; height: 200px; border: 2px dashed #1E3A8A; border-radius: 12px; background: white; cursor: crosshair; }
    .clear-sign { position: absolute; top: 8px; right: 8px; }
    @media (max-width: 768px) {
      .stepper { flex-direction: column; gap: 12px; }
      .step-line { width: 2px; height: 30px; }
      .step-content { padding: 20px; }
    }
  `]
})
export class UniRegisterComponent {
  currentStep = 1;
  steps = [
    { num: 1, label: 'Vérification DNS' },
    { num: 2, label: 'Décret MINESUP' },
    { num: 3, label: 'Signature' }
  ];

  universityName = '';
  adminEmail = '';
  dnsChecking = false;
  dnsVerified = false;
  decreeFile = '';
  decreeUploaded = false;
  private isDrawing = false;
  private canvasCtx: CanvasRenderingContext2D | null = null;

  constructor(public router: Router) {}

  nextStep(): void {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  verifyDns(): void {
    if (!this.adminEmail) return;
    this.dnsChecking = true;
    this.dnsVerified = false;

    setTimeout(() => {
      this.dnsChecking = false;
      this.dnsVerified = true;
      setTimeout(() => this.nextStep(), 800);
    }, 1200);
  }

  onFileSelect(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (type === 'decree') {
        this.decreeFile = input.files[0].name;
        this.decreeUploaded = true;
      }
    }
  }

  completeRegistration(): void {
    // Navigate to admin dashboard (simulated activation)
    this.router.navigate(['/admin/dashboard']);
  }

  startDraw(event: MouseEvent): void {
    const canvas = event.target as HTMLCanvasElement;
    this.canvasCtx = canvas.getContext('2d');
    this.isDrawing = true;
    this.canvasCtx!.beginPath();
    this.canvasCtx!.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.canvasCtx) return;
    this.canvasCtx.lineTo(event.offsetX, event.offsetY);
    this.canvasCtx.strokeStyle = '#111827';
    this.canvasCtx.lineWidth = 2.5;
    this.canvasCtx.lineCap = 'round';
    this.canvasCtx.stroke();
  }

  stopDraw(): void {
    this.isDrawing = false;
  }

  clearSignature(): void {
    const canvas = document.querySelector('.signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}