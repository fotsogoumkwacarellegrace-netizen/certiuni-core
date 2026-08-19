import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  created_at: string;
}

@Component({
  selector: 'app-message-center',
  imports: [CommonModule],
  template: `
    <div class="admin-layout">
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
          <button class="nav-item" (click)="router.navigate(['/admin/integrations'])">
            <span>📁</span><span class="label">Centre de Scolarité</span>
          </button>
          <button class="nav-item active" (click)="router.navigate(['/admin/messages'])">
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

      <main class="main-content">
        <div class="page-header">
          <div>
            <h1>Centre de Messagerie & Notifications</h1>
            <p class="text-gray">Boîte de réception collaborative — alertes financières, systèmes et sécurité</p>
          </div>
          <button class="btn btn-outline btn-sm" (click)="markAllRead()">✓ Tout marquer lu</button>
        </div>

        <div class="message-layout">
          <!-- Left: message list -->
          <div class="message-list card">
            @for (notif of notifications; track notif.id) {
              <div class="message-item" [class.unread]="!notif.is_read" [class.selected]="selectedNotification?.id === notif.id" (click)="selectNotification(notif)">
                <span [class]="'category-icon ' + notif.category.toLowerCase()">
                  {{ getCategoryIcon(notif.category) }}
                </span>
                <div class="message-info">
                  <div class="message-top">
                    <strong>{{ notif.title }}</strong>
                    <span class="message-time">{{ formatDate(notif.created_at) }}</span>
                  </div>
                  <p>{{ notif.message }}</p>
                  <span [class]="'badge ' + getCategoryBadge(notif.category)">{{ notif.category }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Right: selected message details -->
          <div class="message-detail card">
            @if (selectedNotification) {
              <div>
                <div class="detail-header">
                  <span [class]="'category-icon big ' + selectedNotification.category.toLowerCase()">
                    {{ getCategoryIcon(selectedNotification.category) }}
                  </span>
                  <h2>{{ selectedNotification.title }}</h2>
                  <span [class]="'badge ' + getCategoryBadge(selectedNotification.category)">{{ selectedNotification.category }}</span>
                </div>
                <div class="detail-meta">
                  <p><strong>Date:</strong> {{ formatFullDate(selectedNotification.created_at) }}</p>
                  <p><strong>Référence:</strong> {{ selectedNotification.id }}</p>
                </div>
                <div class="detail-body">
                  {{ selectedNotification.message }}
                </div>
                <button class="btn btn-primary mt-4" (click)="downloadReport()">⬇ Télécharger le bordereau</button>
              </div>
            } @else {
              <div class="no-selection">
                <span class="empty-icon">📭</span>
                <p>Sélectionnez une notification pour voir les détails</p>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { min-height: 100vh; display: flex; background: #F9FAFB; }
    .main-content { flex: 1; margin-left: 260px; padding: 24px 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 800; }
    .message-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .message-list { padding: 12px; max-height: 600px; overflow-y: auto; }
    .message-item {
      display: flex; gap: 12px; padding: 16px; border-radius: 10px; cursor: pointer;
      transition: all 0.2s; border: 2px solid transparent;
    }
    .message-item:hover { background: #F8FAFC; }
    .message-item.selected { border-color: #1E3A8A; background: #EFF6FF; }
    .message-item.unread { background: #FFFBEB; }
    .category-icon {
      width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center;
      justify-content: center; font-size: 18px; flex-shrink: 0;
    }
    .category-icon.financial { background: #FEF3C7; }
    .category-icon.system { background: #EFF6FF; }
    .category-icon.security { background: #FEE2E2; }
    .category-icon.big { width: 48px; height: 48px; font-size: 22px; }
    .message-info { flex: 1; }
    .message-top { display: flex; justify-content: space-between; gap: 12px; }
    .message-top strong { font-size: 14px; }
    .message-time { font-size: 11px; color: #9CA3AF; white-space: nowrap; }
    .message-item p { font-size: 13px; color: #6B7280; margin: 4px 0 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .message-detail { padding: 24px; display: flex; align-items: flex-start; }
    .detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .detail-header h2 { font-size: 18px; font-weight: 700; }
    .detail-meta { background: #F8FAFC; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
    .detail-meta p { font-size: 13px; color: #6B7280; margin-bottom: 4px; }
    .detail-body { font-size: 15px; line-height: 1.6; }
    .no-selection { text-align: center; margin: auto; color: #9CA3AF; }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .nav-item.logout { margin-top: auto; color: #EF4444; }
    @media (max-width: 1024px) {
      .main-content { margin-left: 70px; }
    }
    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 16px; }
      .message-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class MessageCenterComponent {
  notifications: Notification[] = [
    {
      id: 'notif-001',
      title: 'Paiement reçu — Marie Ngo',
      message: 'La transaction MTN MoMo de 1 000 FCFA pour le diplôme Master en Génie Logiciel a été validée.',
      category: 'FINANCIAL',
      is_read: false,
      created_at: '2026-07-15T14:22:10Z'
    },
    {
      id: 'notif-002',
      title: 'Alerte système — Pic de trafic',
      message: 'Détection d\'un volume inhabituel de vérifications (120 requêtes/minute) depuis une IP localisée à Douala.',
      category: 'SYSTEM',
      is_read: true,
      created_at: '2026-08-14T18:00:00Z'
    },
    {
      id: 'notif-003',
      title: 'Alerte sécurité — Tentative de force brute',
      message: 'Plus de 10 tentatives de vérification infructueuses détectées sur le diplôme de Marie Ngo depuis la Chine.',
      category: 'SECURITY',
      is_read: false,
      created_at: '2026-08-15T23:14:22Z'
    }
  ];

  selectedNotification: Notification | null = null;

  constructor(public router: Router) {}

  selectNotification(notif: Notification): void {
    this.selectedNotification = notif;
    notif.is_read = true;
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.is_read = true);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'FINANCIAL': return '💰';
      case 'SYSTEM': return '⚙️';
      case 'SECURITY': return '🛡️';
      default: return '📋';
    }
  }

  getCategoryBadge(category: string): string {
    switch (category) {
      case 'FINANCIAL': return 'badge-pending';
      case 'SYSTEM': return 'badge-production';
      case 'SECURITY': return 'badge-revoked';
      default: return 'badge-notfound';
    }
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR');
  }

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR');
  }

  downloadReport(): void {
    window.print();
  }
}