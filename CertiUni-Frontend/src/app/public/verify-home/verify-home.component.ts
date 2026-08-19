import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-home',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-container">
      <!-- Header -->
      <header class="header">
        <div class="logo-brand">
          <img src="assets/logos/certiuni-logo.png" alt="CertiUni Logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMUUzQThBIi8+PHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q1U8L3RleHQ+PC9zdmc+'" />
          <span class="brand-name">CertiUni</span>
        </div>
        <nav class="nav-links">
          <a routerLink="/student/login">Espace Étudiant</a>
          <a routerLink="/admin/login">Espace Université</a>
          <a routerLink="/superadmin/console">SuperAdmin</a>
        </nav>
      </header>

      <!-- Hero Section -->
      <div class="hero">
        <h1 class="hero-title">Vérification instantanée de diplômes</h1>
        <p class="hero-subtitle">
          La plateforme nationale de certification et de vérification de diplômes universitaires au Cameroun
        </p>

        <!-- Search Capsule (Google Style) -->
        <div class="search-capsule">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Entrez l'UUID ou le code du diplôme (ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6)"
            (keyup.enter)="onSearch()"
            aria-label="Rechercher un diplôme"
          />
          <button class="search-btn" (click)="onSearch()" title="Vérifier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <div class="action-card card-hover" (click)="router.navigate(['/verify/scan'])">
            <div class="action-icon">📷</div>
            <strong>Scanner un QR Code</strong>
            <p>Utilisez la caméra pour scanner le code QR d'un diplôme</p>
          </div>
          <div class="action-card card-hover" (click)="router.navigate(['/verify/ocr'])">
            <div class="action-icon">🤖</div>
            <strong>Analyse Document par l'IA</strong>
            <p>Déposez une photo du diplôme et laissez l'IA extraire les informations</p>
          </div>
        </div>

        <!-- Bulk Drop Zone -->
        <div
          class="bulk-drop-zone"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          [class.drag-over]="isDragOver"
        >
          <div class="drop-icon">📊</div>
          <strong>Glissez votre fichier Excel de 100 CV</strong>
          <p>Vérification de masse (Bulk Verification) pour les recruteurs RH</p>
          <button class="btn btn-primary mt-3" (click)="router.navigate(['/verify/bulk'])">
            Télécharger un fichier Excel
          </button>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <p>© 2026 CertiUni — Plateforme nationale de certification de diplômes · Cameroun 🇨🇲</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container { min-height: 100vh; display: flex; flex-direction: column; background: #F9FAFB; }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-bottom: 2px solid #1E3A8A;
    }
    .logo-brand { display: flex; align-items: center; gap: 12px; }
    .logo-brand img { width: 40px; height: 40px; border-radius: 10px; }
    .brand-name { font-size: 22px; font-weight: 800; color: #1E3A8A; }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a { color: #6B7280; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: #1E3A8A; }
    .hero { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 60px 24px; gap: 32px; }
    .hero-title { font-size: 42px; font-weight: 800; color: #111827; text-align: center; }
    .hero-subtitle { font-size: 18px; color: #6B7280; text-align: center; max-width: 600px; }
    .search-capsule { width: 100%; max-width: 720px; }
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%; max-width: 720px; }
    .action-card {
      background: white; border-radius: 16px; padding: 32px 24px;
      text-align: center; border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .action-icon { font-size: 40px; margin-bottom: 12px; }
    .action-card strong { font-size: 18px; color: #111827; display: block; margin-bottom: 8px; }
    .action-card p { color: #6B7280; font-size: 14px; line-height: 1.5; }
    .bulk-drop-zone {
      width: 100%; max-width: 720px; border: 3px dashed #9CA3AF; border-radius: 20px;
      padding: 40px 24px; text-align: center; background: white;
      transition: all 0.3s ease; cursor: pointer;
    }
    .bulk-drop-zone.drag-over { border-color: #1E3A8A; background: #EFF6FF; transform: scale(1.01); }
    .drop-icon { font-size: 40px; margin-bottom: 12px; }
    .bulk-drop-zone strong { font-size: 18px; color: #111827; display: block; }
    .bulk-drop-zone p { color: #6B7280; font-size: 14px; margin-top: 8px; }
    .footer { padding: 24px; text-align: center; color: #9CA3AF; font-size: 14px; background: white; border-top: 1px solid #E5E7EB; }
    @media (max-width: 768px) {
      .hero { padding: 40px 16px; }
      .hero-title { font-size: 28px; }
      .quick-actions { grid-template-columns: 1fr; }
      .nav-links { gap: 12px; }
      .nav-links a { font-size: 12px; }
    }
  `]
})
export class VerifyHomeComponent {
  searchQuery: string = '';
  isDragOver: boolean = false;

  constructor(public router: Router) {}

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/verify', query]);
    }
  }

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
    // Simulate bulk upload - redirect to bulk verification page
    this.router.navigate(['/verify/bulk']);
  }
}
