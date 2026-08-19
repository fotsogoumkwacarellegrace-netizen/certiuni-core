import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scan-camera',
  imports: [CommonModule],
  template: `
    <div class="scan-container">
      <!-- Simulated camera feed (black screen) -->
      <div class="camera-feed">
        <!-- Simulated video: animated gradient to mimic camera view -->
        <div class="fake-camera-view">
          <div class="camera-pattern"></div>
        </div>

        <!-- Scan viewport -->
        <div class="scan-viewport">
          <div class="scan-corner tl"></div>
          <div class="scan-corner tr"></div>
          <div class="scan-corner bl"></div>
          <div class="scan-corner br"></div>
          <div class="scan-line"></div>
        </div>

        <!-- Camera controls -->
        <div class="camera-controls">
          <button class="cam-btn" (click)="toggleCamera()" title="Rotation objectif">
            <span>🔄</span>
          </button>
          <button class="cam-btn close" (click)="close()" title="Fermer">
            <span>✕</span>
          </button>
        </div>

        <!-- Scanning status -->
        <div class="scan-status" [class.found]="scanComplete">
          @if (scanning) {
            <p>🔍 Recherche du QR code...</p>
          } @else if (scanComplete) {
            <p>✅ QR Code détecté ! Redirection...</p>
          } @else {
            <p>📷 Positionnez le QR code dans le cadre</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scan-container { min-height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; position: relative; }
    .camera-feed { width: 100%; height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .fake-camera-view { position: absolute; inset: 0; background: linear-gradient(135deg, #111827 0%, #1F2937 25%, #111827 50%, #1F2937 75%, #111827 100%); animation: camera-flicker 4s ease-in-out infinite; }
    .camera-pattern { position: absolute; inset: 0; background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.03) 0%, transparent 50%); }
    @keyframes camera-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } }
    .scan-viewport {
      width: 280px; height: 280px; border: 2px solid rgba(16, 185, 129, 0.5);
      border-radius: 16px; position: relative; z-index: 10; background: rgba(0,0,0,0.3);
    }
    .scan-line {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #10B981, transparent);
      animation: scan-line 2s linear infinite; top: 0;
    }
    .scan-corner { position: absolute; width: 28px; height: 28px; border: 3px solid #10B981; }
    .scan-corner.tl { top: -3px; left: -3px; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
    .scan-corner.tr { top: -3px; right: -3px; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; }
    .scan-corner.bl { bottom: -3px; left: -3px; border-right: none; border-top: none; border-radius: 0 0 0 6px; }
    .scan-corner.br { bottom: -3px; right: -3px; border-left: none; border-top: none; border-radius: 0 0 6px 0; }
    .camera-controls { position: absolute; bottom: 60px; left: 0; right: 0; display: flex; justify-content: center; gap: 32px; z-index: 20; }
    .cam-btn {
      width: 64px; height: 64px; border-radius: 50%; border: none; font-size: 24px;
      background: rgba(255,255,255,0.15); color: white; cursor: pointer;
      backdrop-filter: blur(10px); transition: all 0.2s;
    }
    .cam-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }
    .cam-btn.close { width: 48px; height: 48px; font-size: 16px; background: rgba(239, 68, 68, 0.3); }
    .scan-status {
      position: absolute; bottom: 140px; left: 50%; transform: translateX(-50%);
      background: rgba(255,255,255,0.9); border-radius: 999px; padding: 10px 20px;
      font-size: 14px; font-weight: 500; white-space: nowrap; z-index: 20;
    }
    .scan-status.found p { color: #065F46; font-weight: 600; }
  `]
})
export class ScanCameraComponent implements OnInit, OnDestroy {
  scanning = true;
  scanComplete = false;
  private timer: any;
  private redirectTimer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulate scanning for 3 seconds then auto-redirect to verdict
    this.timer = setTimeout(() => {
      this.scanning = false;
      this.scanComplete = true;
      this.redirectTimer = setTimeout(() => {
        // Auto-detect Marie Ngo's diploma
        this.router.navigate(['/verify/f81d4fae-7dec-11d0-a765-00a0c91e6bf6']);
      }, 1800);
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
  }

  toggleCamera(): void {
    // Simulate camera rotation - just an animation trigger
  }

  close(): void {
    this.router.navigate(['/verify']);
  }
}
