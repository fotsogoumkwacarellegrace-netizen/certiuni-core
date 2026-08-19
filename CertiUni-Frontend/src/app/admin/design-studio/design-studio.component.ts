import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-design-studio',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="studio-layout">
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
          <button class="nav-item active" (click)="router.navigate(['/admin/templates'])">
            <span>🎨</span><span class="label">Studio de Design IA</span>
          </button>
          <button class="nav-item" (click)="router.navigate(['/admin/integrations'])">
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

      <!-- Studio content -->
      <main class="studio-content">
        <!-- Top bar -->
        <div class="studio-header">
          <div>
            <h1>Studio de Design IA</h1>
            <p class="text-sm text-gray">Créez votre gabarit de diplôme en langage naturel</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline btn-sm" (click)="openHistory()">🗂 Historique</button>
            <button class="btn btn-ghost btn-sm" (click)="openSettings()">⚙️</button>
          </div>
        </div>

        <!-- Split screen -->
        <div class="split-screen">
          <!-- Left: AI Chat (Google AI Studio style) -->
          <div class="chat-panel">
            <div class="chat-log">
              @if (messages.length === 0) {
                <div class="chat-empty">
                  <div class="sparkle-icon">✨</div>
                  <h3>Décrivez votre diplôme idéal</h3>
                  <p>Exemple: « Créez un certificat médical avec un thème émeraude »</p>
                </div>
              }
              @for (msg of messages; track msg.text) {
                <div [class]="'chat-msg ' + msg.sender">
                  <div class="msg-bubble">{{ msg.text }}</div>
                </div>
              }
              @if (isGenerating) {
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              }
            </div>

            <!-- Chat input pill -->
            <div class="chat-input-wrap">
              <div class="chat-input-pill">
                <button class="pill-btn">🎤</button>
                <button class="pill-btn">📎</button>
                <input type="text" [(ngModel)]="prompt" placeholder="Décrivez votre diplôme à l'IA..." (keyup.enter)="sendPrompt()" />
                <button class="pill-btn send" (click)="sendPrompt()">➤</button>
              </div>
              <p class="ai-hint">L'IA analyse vos mots-clés: medecine, informatique, droit...</p>
            </div>
          </div>

          <!-- Right: A4 canvas -->
          <div class="canvas-panel">
            <div
              class="a4-canvas"
              [ngStyle]="canvasStyles"
              (contextmenu)="onRightClick($event)"
            >
              <!-- Simulated template content -->
              <div class="template-header">
                <h2>Universite De Douala</h2>
                <p>Faculté des Sciences</p>
              </div>
              <div class="template-body">
                <h3>DIPLÔME</h3>
                <p>Délivré à</p>
                <strong>{{ studentName }}</strong>
                <p>Pour avoir satisfait aux épreuves de</p>
                <h4>MASTER EN GÉNIE LOGICIEL</h4>
                <p>Mention: {{ grade }} / 20</p>
              </div>
              <div class="template-footer">
                <p>Fait à Douala, le {{ today }}</p>
              </div>

              <!-- QR placeholder -->
              <div class="qr-placeholder">QR</div>
            </div>
          </div>
        </div>
      </main>

      <!-- History sidebar (Screen 29) -->
      @if (historyOpen) {
        <div class="drawer-overlay" (click)="closeHistory()"></div>
        <div class="history-drawer">
          <div class="drawer-header">
            <h3>Historique des maquettes</h3>
            <button class="btn btn-sm btn-primary" (click)="newChat()">+ Nouveau Chat</button>
          </div>
          <div class="history-list">
            @for (item of designHistory; track item.id) {
              <div class="history-item" (click)="loadTemplate(item)">
                <span class="history-icon">🎨</span>
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.created_at }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Settings panel (Screen 30) -->
      @if (settingsOpen) {
        <div class="drawer-overlay" (click)="closeSettings()"></div>
        <div class="settings-drawer">
          <div class="drawer-header">
            <h3>Configuration du modèle IA</h3>
            <button class="btn btn-ghost" (click)="closeSettings()">✕</button>
          </div>
          <div class="settings-body">
            <div class="form-group">
              <label class="form-label">Modèle LLM</label>
              <select class="form-select" [(ngModel)]="llmModel">
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini Pro</option>
                <option>DeepSeek</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Température créative: {{ temperature }}</label>
              <input type="range" min="0" max="1" step="0.1" [(ngModel)]="temperature" class="slider" />
            </div>
            <div class="form-group">
              <label class="form-label">Limite de tokens: {{ maxTokens }}</label>
              <input type="range" min="100" max="4000" step="100" [(ngModel)]="maxTokens" class="slider" />
            </div>
          </div>
        </div>
      }

      <!-- Context menu (Screen 31) -->
      @if (contextMenuVisible) {
        <div class="context-menu" [style.top.px]="contextMenuY" [style.left.px]="contextMenuX">
          <button (click)="insertTag(tagStudent)">Insert {{ tagStudentText }}</button>
          <button (click)="insertTag(tagMention)">Insert {{ tagMentionText }}</button>
          <button (click)="insertTag(tagQr)">Insert QR CODE</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .studio-layout { min-height: 100vh; display: flex; }
    .studio-content { flex: 1; margin-left: 260px; padding: 20px; display: flex; flex-direction: column; }
    .studio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .studio-header h1 { font-size: 22px; font-weight: 800; }
    .split-screen { display: grid; grid-template-columns: 1fr 1fr; gap: 0; flex: 1; min-height: calc(100vh - 140px); }
    .chat-panel { background: #1E293B; border-radius: 12px 0 0 12px; display: flex; flex-direction: column; overflow: hidden; }
    .chat-log { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .chat-empty { text-align: center; margin: auto; color: #94A3B8; }
    .sparkle-icon { font-size: 48px; margin-bottom: 12px; }
    .chat-empty h3 { font-size: 18px; color: #E2E8F0; }
    .chat-empty p { font-size: 13px; margin-top: 8px; }
    .chat-msg { display: flex; margin-bottom: 4px; }
    .chat-msg.user { justify-content: flex-end; }
    .chat-msg.ai { justify-content: flex-start; }
    .msg-bubble { max-width: 80%; padding: 10px 14px; border-radius: 16px; font-size: 14px; }
    .chat-msg.user .msg-bubble { background: #3B82F6; color: white; border-radius: 16px 16px 4px 16px; }
    .chat-msg.ai .msg-bubble { background: #334155; color: #E2E8F0; border-radius: 16px 16px 16px 4px; }
    .typing-indicator { display: flex; gap: 4px; padding: 8px; }
    .typing-indicator span { width: 8px; height: 8px; background: #94A3B8; border-radius: 50%; animation: float 0.6s ease-in-out infinite; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    .chat-input-wrap { padding: 12px 20px; background: #111827; }
    .chat-input-pill {
      display: flex; align-items: center; gap: 8px; background: #1E293B;
      border: 1px solid #475569; border-radius: 999px; padding: 6px 8px;
    }
    .chat-input-pill:focus-within { border-color: #3B82F6; }
    .pill-btn { background: none; border: none; color: #94A3B8; font-size: 16px; cursor: pointer; padding: 8px; border-radius: 50%; }
    .pill-btn:hover { background: #334155; }
    .pill-btn.send { color: #3B82F6; font-size: 20px; }
    .chat-input-pill input { flex: 1; background: none; border: none; outline: none; color: white; font-size: 14px; font-family: inherit; }
    .chat-input-pill input::placeholder { color: #64748B; }
    .ai-hint { font-size: 11px; color: #64748B; text-align: center; margin-top: 8px; }
    .canvas-panel { background: #F3F4F6; border-radius: 0 12px 12px 0; padding: 24px; display: flex; align-items: center; justify-content: center; }
    .a4-canvas {
      width: 400px; height: 565px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 24px; position: relative; border: 1px solid #E5E7EB; transition: all 0.5s;
      text-align: center; overflow: hidden;
    }
    .template-header { border-bottom: 3px solid #1E3A8A; padding-bottom: 12px; }
    .template-header h2 { font-size: 18px; color: #1E3A8A; text-transform: uppercase; }
    .template-header p { font-size: 12px; color: #6B7280; }
    .template-body { margin-top: 24px; }
    .template-body h3 { font-size: 20px; letter-spacing: 2px; }
    .template-body strong { font-size: 28px; display: block; margin: 12px 0; text-transform: uppercase; }
    .template-body h4 { font-size: 14px; color: #1E3A8A; margin: 12px 0; }
    .template-footer { position: absolute; bottom: 16px; left: 0; right: 0; font-size: 11px; color: #9CA3AF; }
    .qr-placeholder {
      position: absolute; bottom: 16px; right: 16px; width: 48px; height: 48px;
      border: 2px dashed #9CA3AF; display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #9CA3AF;
    }
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998; }
    .history-drawer {
      position: fixed; top: 0; bottom: 0; right: 0; width: 320px; background: white;
      z-index: 999; box-shadow: -10px 0 30px rgba(0,0,0,0.2); animation: slideInRight 0.3s;
      display: flex; flex-direction: column;
    }
    .settings-drawer {
      position: fixed; top: 0; bottom: 0; right: 0; width: 320px; background: white;
      z-index: 999; box-shadow: -10px 0 30px rgba(0,0,0,0.2); animation: slideInRight 0.3s;
    }
    .drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #E5E7EB; }
    .history-list { padding: 12px; flex: 1; overflow-y: auto; }
    .history-item {
      display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px;
      cursor: pointer; transition: all 0.2s;
    }
    .history-item:hover { background: #F3F4F6; }
    .history-icon { font-size: 24px; }
    .history-item strong { font-size: 13px; }
    .history-item p { font-size: 11px; color: #9CA3AF; }
    .settings-body { padding: 20px; }
    .slider { width: 100%; accent-color: #1E3A8A; }
    .context-menu {
      position: fixed; background: #111827; border-radius: 8px; padding: 8px 0;
      z-index: 9999; min-width: 160px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .context-menu button {
      display: block; width: 100%; background: none; border: none; color: white;
      padding: 10px 16px; text-align: left; font-size: 13px; cursor: pointer; font-family: inherit;
    }
    .context-menu button:hover { background: #374151; }
    @media (max-width: 1024px) {
      .studio-content { margin-left: 70px; }
      .split-screen { grid-template-columns: 1fr; }
      .a4-canvas { margin: 0 auto; }
    }
    @media (max-width: 768px) {
      .studio-content { margin-left: 0; }
    }
  `]
})
export class DesignStudioComponent {
  prompt = '';
  messages: { text: string; sender: string }[] = [];
  isGenerating = false;
  canvasTheme = {
    primary_color: '#1E3A8A',
    border_style: '2px solid #1E3A8A',
    font_family: 'Inter, sans-serif'
  };
  studentName = 'Marie NGO';
  grade = '16.5';
  today = new Date().toLocaleDateString('fr-FR');

  historyOpen = false;
  settingsOpen = false;
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  llmModel = 'GPT-4o';
  temperature = 0.7;
  maxTokens = 2048;
  tagStudent = '{{Nom_Etudiant}}';
  tagMention = '{{Mention}}';
  tagQr = '{{QR_CODE}}';
  tagStudentText = '{{Nom_Etudiant}}';
  tagMentionText = '{{Mention}}';

  designHistory = [
    { id: 'tpl-001', name: 'Gabarit Médecine Émeraude', created_at: '10/07/2026', theme: 'medecine' },
    { id: 'tpl-002', name: 'Gabarit Informatique Bleu', created_at: '12/07/2026', theme: 'informatique' },
    { id: 'tpl-003', name: 'Gabarit Droit Bordeaux', created_at: '01/08/2026', theme: 'droit' }
  ];

  private themes = [
    { trigger_keyword: 'medecine', primary_color: '#065F46', border_style: '2px double #D97706', font_family: 'Georgia, serif' },
    { trigger_keyword: 'informatique', primary_color: '#1E3A8A', border_style: '3px solid #1E3A8A', font_family: 'Inter, sans-serif' },
    { trigger_keyword: 'droit', primary_color: '#7F1D1D', border_style: '3px double #B91C1C', font_family: 'Palatino, serif' }
  ];

  constructor(public router: Router) {}

  get canvasStyles(): Record<string, string> {
    return {
      'border-top': this.canvasTheme.border_style,
      'font-family': this.canvasTheme.font_family,
      'background-color': 'white'
    };
  }

  sendPrompt(): void {
    if (!this.prompt.trim()) return;

    this.messages.push({ text: this.prompt, sender: 'user' });
    const userPrompt = this.prompt;
    this.prompt = '';
    this.isGenerating = true;

    setTimeout(() => {
      this.isGenerating = false;

      // AI match by keyword
      const lowerPrompt = userPrompt.toLowerCase();
      const matchedTheme = this.themes.find(t => lowerPrompt.includes(t.trigger_keyword));

      if (matchedTheme) {
        this.canvasTheme = { ...matchedTheme };
        this.messages.push({
          text: `✓ Thème "${matchedTheme.trigger_keyword}" appliqué avec succès ! J'ai créé un design premium avec les couleurs adaptées.`,
          sender: 'ai'
        });
      } else {
        const defaultTheme = this.themes[1];
        this.canvasTheme = { ...defaultTheme };
        this.messages.push({
          text: 'J\'ai appliqué le thème informatique par défaut. Essayez "medecine", "droit" pour d\'autres styles !',
          sender: 'ai'
        });
      }
    }, 1500);
  }

  openHistory(): void { this.historyOpen = true; }
  closeHistory(): void { this.historyOpen = false; }
  openSettings(): void { this.settingsOpen = true; }
  closeSettings(): void { this.settingsOpen = false; }

  newChat(): void {
    this.messages = [];
    this.studentName = 'Marie NGO';
    this.canvasTheme = { primary_color: '#1E3A8A', border_style: '2px solid #1E3A8A', font_family: 'Inter, sans-serif' };
    this.closeHistory();
  }

  loadTemplate(item: any): void {
    const theme = this.themes.find(t => t.trigger_keyword === item.theme);
    if (theme) this.canvasTheme = { ...theme };
    this.studentName = 'Marie NGO';
    this.messages.push({ text: `Gabarit "${item.name}" chargé.`, sender: 'ai' });
    this.closeHistory();
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuVisible = true;
  }

  insertTag(tag: string): void {
    this.contextMenuVisible = false;
    this.messages.push({ text: `Balise ${tag} insérée dans le canvas`, sender: 'ai' });
  }
}