# 🚀 CertiUni Backend — API Server

Backend API de la plateforme CertiUni — Node.js + Express + CORS + Sécurité.

## 📦 Installation

```bash
cd CertiUni-Backend
npm install
```

## ▶️ Lancement

```bash
npm start
```

Le serveur écoute sur **http://localhost:3000**

## 🔌 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérification de santé |
| GET | `/api/universities` | Liste des universités |
| POST | `/api/universities/register` | Inscription Multi-Tenant |
| GET | `/api/certificates` | Liste des certificats |
| POST | `/api/verify` | Vérification d'un diplôme |
| POST | `/api/verify/bulk` | Vérification de masse |
| POST | `/api/certificates/:id/revoke` | Révocation avec MFA |
| POST | `/api/students/login` | Connexion lien magique |
| POST | `/api/payments/initiate` | Initiation de paiement |
| POST | `/api/payments/confirm` | Confirmation de paiement |
| GET | `/api/logs` | Journal des scans |
| GET | `/api/dashboard/stats` | Statistiques |
| GET | `/api/notifications` | Notifications |
| POST | `/api/design/generate` | Génération design IA |
| POST | `/api/excel/validate` | Validation Excel |
| POST | `/api/excel/import` | Import diplômes |
| GET | `/api/security/alerts` | Alertes sécurité |
| POST | `/api/security/simulate-attack` | Simulation attaque |
| GET | `/api/superadmin/dashboard` | Console SuperAdmin |
| POST | `/api/auth/login` | Authentification admin |

## 🗂️ Structure

```
CertiUni-Backend/
├── serve.js              # Serveur principal
├── package.json          # Dépendances
├── data/
│   └── mock-data.json    # Données de simulation
└── README.md
```

## 🔐 Sécurité

- Rate limiting (10 requêtes / 5 min)
- Détection brute-force
- SHA-256 pour les certificats
- MFA à 6 chiffres
- CORS configuré pour `http://localhost:4200`
