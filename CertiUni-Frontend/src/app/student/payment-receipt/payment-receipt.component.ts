import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-receipt',
  imports: [CommonModule],
  template: `
    <div class="receipt-page">
      <!-- Confetti background -->
      <div class="confetti-layer"></div>

      <div class="receipt-content">
        <div class="success-message fade-in">
          <div class="success-icon">✅</div>
          <h1>Paiement réussi !</h1>
          <p>Votre diplôme est maintenant débloqué et disponible en téléchargement.</p>
        </div>

        <!-- Receipt card (ticket de caisse perforé) -->
        <div class="receipt-card fade-in">
          <div class="receipt-header">
            <div class="certiuni-mark">
              <img src="assets/logos/certiuni-logo.png" alt="CertiUni" onerror="this.style.display='none'">
              <span>CertiUni</span>
            </div>
            <p class="receipt-title">REÇU DE PAIEMENT OFFICIEL</p>
          </div>

          <div class="receipt-body">
            <div class="receipt-row">
              <span>Référence</span>
              <strong>{{ transactionRef }}</strong>
            </div>
            <div class="receipt-row">
              <span>Date</span>
              <strong>{{ paymentDate }}</strong>
            </div>
            <div class="receipt-row">
              <span>Étudiant</span>
              <strong>Marie Ngo</strong>
            </div>
            <div class="receipt-row">
              <span>Diplôme</span>
              <strong>{{ certificateName }}</strong>
            </div>
            <div class="receipt-row">
              <span>Paiement via</span>
              <strong>{{ gatewayLabel }}</strong>
            </div>

            <div class="receipt-divider"></div>

            <div class="receipt-row amount">
              <span>Montant total</span>
              <strong>1 000 FCFA</strong>
            </div>
          </div>

          <!-- Perforated bottom + watermark PAYÉ -->
          <div class="receipt-bottom receipt-watermark">
            <div class="paid-watermark">PAYÉ / VALIDÉ</div>
            <div class="receipt-footer">
              <p>Ce reçu est la preuve officielle de paiement des frais de délivrance</p>
              <p class="receipt-hash">Empreinte: {{ shortHash }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="receipt-actions">
          <button class="btn btn-primary btn-lg" (click)="saveReceipt()">⬇ Sauvegarder le reçu</button>
          <button class="btn btn-outline" (click)="router.navigate(['/student/dashboard'])">
            ← Retour au portefeuille
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .receipt-page { min-height: 100vh; background: #E6F4EA; display: flex; align-items: center; justify-content: center; padding: 32px 16px; position: relative; }
    .confetti-layer { position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle at 20% 20%, rgba(16,185,129,0.05) 0%, transparent 20%), radial-gradient(circle at 80% 30%, rgba(30,58,138,0.05) 0%, transparent 20%); }
    .receipt-content { max-width: 500px; width: 100%; }
    .success-message { text-align: center; margin-bottom: 32px; }
    .success-icon { font-size: 56px; }
    .success-message h1 { font-size: 28px; font-weight: 800; color: #065F46; margin-top: 12px; }
    .success-message p { color: #6B7280; margin-top: 8px; }
    .receipt-card {
      background: white; max-width: 420px; margin: 0 auto; position: relative;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    .receipt-header { padding: 24px; text-align: center; border-bottom: 2px dashed #E5E7EB; }
    .certiuni-mark { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
    .certiuni-mark img { width: 24px; height: 24px; }
    .certiuni-mark span { font-weight: 800; color: #1E3A8A; }
    .receipt-title { font-size: 12px; color: #6B7280; letter-spacing: 1px; text-transform: uppercase; }
    .receipt-body { padding: 24px; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .receipt-row span { color: #6B7280; }
    .receipt-row strong { color: #111827; }
    .receipt-row.amount { font-size: 18px; font-weight: 800; }
    .receipt-row.amount strong { color: #1E3A8A; font-size: 22px; }
    .receipt-divider { border-top: 2px dashed #E5E7EB; margin: 8px 0; }
    .receipt-bottom { padding: 24px 24px 32px; text-align: center; position: relative; overflow: hidden; }
    .paid-watermark {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 48px; font-weight: 800; color: #10B981; opacity: 0.15; white-space: nowrap;
    }
    .receipt-footer p { font-size: 12px; color: #9CA3AF; }
    .receipt-footer .receipt-hash { font-family: monospace; font-size: 10px; margin-top: 8px; }
    .receipt-actions { display: flex; justify-content: center; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .receipt-actions { flex-direction: column; }
    }
  `]
})
export class PaymentReceiptComponent implements OnInit {
  transactionRef = 'MTN-CU-2026-000125';
  paymentDate = new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR');
  certificateName = 'Master en Génie Logiciel';
  gatewayLabel = 'MTN Mobile Money';
  shortHash = 'e3b0c442...b855';

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Generate a transaction reference for this payment
    this.transactionRef = 'CU-' + Date.now().toString().slice(-10);
  }

  saveReceipt(): void {
    window.print();
  }
}