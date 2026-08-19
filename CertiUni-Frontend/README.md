# 🎓 CertiUni Frontend — Angular Application

Frontend Angular de la plateforme CertiUni — 38 écrans, 4 modules, design responsive.

## 📦 Installation

```bash
cd CertiUni-Frontend
npm install
```

## ▶️ Lancement

```bash
npm start
```

L'application écoute sur **http://localhost:4200**

## 🗂️ Structure

```
CertiUni-Frontend/
├── angular.json              # Configuration Angular
├── package.json              # Dépendances
├── src/
│   ├── index.html            # Page HTML principale
│   ├── main.ts               # Point d'entrée
│   ├── styles.css            # Styles globaux
│   ├── environments/         # Configuration environnement
│   ├── assets/
│   │   ├── data/             # Données de simulation
│   │   └── logos/            # Logo CertiUni
│   └── app/
│       ├── models/           # Interfaces TypeScript
│       ├── services/         # Services Angular (API + RxJS)
│       ├── public/           # Module 1: Portail public
│       ├── student/          # Module 2: Portefeuille étudiant
│       ├── admin/            # Module 3: Administration
│       └── superadmin/       # Module 4: Console SuperAdmin
```

## 🖥️ Les 38 Écrans

### Module 1 — Portail Public (`/verify`)
1. Accueil de recherche (style Google)
2. Studio de scan caméra QR
3. Scanner IA OCR
4. Tableau de masse (Bulk)
5. Verdict Feu Vert
6. Verdict Feu Rouge
7. Verdict Feu Gris
8. Guichet Mobile Money public
9. Volet latéral des notes
10. Visionneuse PDF

### Module 2 — Portefeuille Étudiant (`/student`)
11. Connexion par lien magique
12. Écran de succès email
13. Dashboard portefeuille
14. Hub de sélection paiement
15. Guichet téléphonique MoMo
16. Formulaire carte bancaire
17. Compte à rebours USSD
18. Passerelle 3D Secure
19. Reçu de paiement officiel
20. Archive financière
21. Passerelle LinkedIn
22. Choix format d'exportation
23. Rendu PDF sécurisé

### Module 3 — Administration (`/admin`)
24. Auto-inscription Multi-Tenant
25. Tour de contrôle
26. Tiroir de traçabilité géographique
27. Modale de révocation MFA
28. Studio de Design IA
29. Sidebar historique
30. Panneau configuration IA
31. Menu flottant d'insertion
32. Centre de Scolarité
33. Gabarit Modèle Excel
34. Inspecteur d'Erreurs IA
35. Centre de Messagerie
36. Alerte Flash de Cybersécurité

### Module 4 — SuperAdmin (`/superadmin`)
37. Console Maître du Réseau National
38. Page Panique & Routage d'Urgence

## 🔑 Identifiants de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin Université | `admin@univ-douala.cm` | `admin123` |
| SuperAdmin | `superadmin@certiuni.cm` | `super123` |
| Étudiant | `marie.ngo@univ-douala.cm` | Lien magique |

## 🎨 Charte Graphique

- **Bleu institutionnel**: `#1E3A8A`
- **Vert succès**: `#10B981`
- **Rouge alerte**: `#EF4444`
- **Jaune MoMo**: `#FBBF24`
- **Orange OM**: `#F97316`
- **Fond**: `#F9FAFB`
- **Typographie**: Inter / Roboto
