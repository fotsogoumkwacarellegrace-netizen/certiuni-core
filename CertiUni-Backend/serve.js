/**
 * CertiUni - Backend API Server
 * Node.js + Express + CORS + Security Simulation
 * Listening on http://localhost:3000
 */
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ---------------------------------------------------------------------------
// MIDDLEWARES & SECURITY
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - Allow Angular frontend (localhost:4200)
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ---------------------------------------------------------------------------
// MOCK DATABASE (Simulation-Driven Design)
// ---------------------------------------------------------------------------
const mockDataPath = path.join(__dirname, 'data', 'mock-data.json');
let db = {};

try {
  db = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
  console.log('✅ Base de données simulée chargée depuis mock-data.json');
} catch (error) {
  console.error('❌ Erreur lors du chargement de mock-data.json:', error.message);
  db = { universities: [], students: [], certificates: [], verification_logs: [], payments: [], notifications: [] };
}

// In-memory state (simulates DB modifications during runtime)
const state = {
  certificates: [...(db.certificates || [])],
  students: [...(db.students || [])],
  payments: [...(db.payments || [])],
  verificationLogs: [...(db.verification_logs || [])],
  notifications: [...(db.notifications || [])],
  universities: [...(db.universities || [])],
};

// Rate limiting simulation
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// Attack detection state
let attackDetected = false;
let currentAttack = null;

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

function generateSHA256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function generateUUID() {
  return crypto.randomUUID();
}

function findCertificateById(id) {
  return state.certificates.find((c) => c.id === id) || null;
}

function findStudentById(id) {
  return state.students.find((s) => s.id === id) || null;
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip) || { count: 0, windowStart: now };

  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    record.count = 0;
    record.windowStart = now;
  }

  record.count += 1;
  rateLimitStore.set(ip, record);

  // Detect brute force: > 10 unsuccessful scans in 5 minutes
  if (record.count > RATE_LIMIT_MAX) {
    if (!attackDetected) {
      attackDetected = true;
      currentAttack = {
        id: 'alert-runtime-' + Date.now(),
        threat_type: 'Attaque par Force Brute (Brute Force)',
        target_uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
        target_student: 'Marie Ngo',
        origin_ip: ip,
        estimated_location: 'Inconnue (Vérification manuelle requise)',
        severity: 'CRITICAL',
        timestamp: new Date().toISOString(),
      };
    }
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: Math.max(0, RATE_LIMIT_MAX - record.count) };
}

// ---------------------------------------------------------------------------
// HEALTH & ROOT
// ---------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur connecté avec succès à PostgreSQL local sur le port 3000', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'CertiUni API',
    version: '3.0.0',
    description: 'Plateforme Multi-Tenant de sécurisation et authentification de diplômes',
    endpoints: ['/api/health', '/api/universities', '/api/certificates', '/api/verify', '/api/students', '/api/payments', '/api/logs', '/api/notifications', '/api/design', '/api/security'],
  });
});

// ---------------------------------------------------------------------------
// MULTI-TENANT: UNIVERSITIES
// ---------------------------------------------------------------------------

// GET all universities
app.get('/api/universities', (req, res) => {
  res.json(state.universities);
});

// GET single university
app.get('/api/universities/:id', (req, res) => {
  const uni = state.universities.find((u) => u.id === req.params.id);
  if (!uni) return res.status(404).json({ error: 'Établissement non trouvé' });
  res.json(uni);
});

// POST register university (auto-inscription Multi-Tenant)
app.post('/api/universities/register', (req, res) => {
  const { name, acronym, email, official_email_domain, logo_url } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nom et email sont requis' });
  }

  // Simulate DNS verification of academic domain
  const domain = email.split('@')[1] || '';
  const dnsVerified = domain.includes('.cm') || domain.includes('.edu');
  if (!dnsVerified) {
    return res.status(400).json({ error: 'Domaine académique non reconnu. Vérification DNS échouée.' });
  }

  const newUniversity = {
    id: generateUUID(),
    name,
    acronym: acronym || name.substring(0, 3).toUpperCase(),
    official_email_domain: official_email_domain || `@${domain}`,
    logo_url: logo_url || 'assets/logos/default-university.png',
    environment_mode: 'SANDBOX', // Auto Mode Sandbox
    is_billing_student: true,
    created_at: new Date().toISOString(),
  };

  state.universities.push(newUniversity);

  // Add welcome notification
  state.notifications.unshift({
    id: generateUUID(),
    university_id: newUniversity.id,
    title: 'Bienvenue sur CertiUni ! 🎓',
    message: `Votre établissement "${name}" a été enregistré avec succès en mode SANDBOX. Vous pouvez maintenant configurer vos modèles de diplômes.`,
    category: 'SYSTEM',
    is_read: false,
    created_at: new Date().toISOString(),
  });

  res.status(201).json({ success: true, university: newUniversity });
});

// POST validate university (SuperAdmin action)
app.post('/api/superadmin/universities/:id/validate', (req, res) => {
  const uni = state.universities.find((u) => u.id === req.params.id);
  if (!uni) return res.status(404).json({ error: 'Établissement non trouvé' });

  uni.environment_mode = 'PRODUCTION';
  res.json({ success: true, university: uni });
});

// POST ban university (SuperAdmin action)
app.post('/api/superadmin/universities/:id/ban', (req, res) => {
  const uni = state.universities.find((u) => u.id === req.params.id);
  if (!uni) return res.status(404).json({ error: 'Établissement non trouvé' });

  uni.environment_mode = 'BANNED';
  res.json({ success: true, university: uni });
});

// ---------------------------------------------------------------------------
// CERTIFICATES & VERIFICATION
// ---------------------------------------------------------------------------

// GET all certificates
app.get('/api/certificates', (req, res) => {
  res.json(state.certificates);
});

// GET single certificate
app.get('/api/certificates/:id', (req, res) => {
  const cert = findCertificateById(req.params.id);
  if (!cert) return res.status(404).json({ error: 'Certificat non trouvé' });

  // Enrich with student data
  const student = cert.student_id ? findStudentById(cert.student_id) : null;
  res.json({ ...cert, student });
});

// POST verify certificate (public portal)
app.post('/api/verify', (req, res) => {
  const { uuid, ip } = req.body;
  const clientIp = ip || req.ip || '127.0.0.1';

  // Rate limiting check
  const rate = checkRateLimit(clientIp);
  if (rate.limited) {
    return res.status(429).json({
      error: 'Rate limit exceeded - Brute force attack detected',
      attack: currentAttack,
    });
  }

  const certificate = findCertificateById(uuid);

  // Log the verification
  const logEntry = {
    id: 'log-' + Date.now(),
    time: new Date().toLocaleTimeString('fr-FR'),
    diploma: certificate ? certificate.course_title : 'ID: ' + (uuid || '???').substring(0, 10) + '...',
    student: certificate?.student_id ? findStudentById(certificate.student_id)?.first_name + ' ' + findStudentById(certificate.student_id)?.last_name : 'Inconnu',
    status: !certificate ? 'NOT_FOUND' : certificate.status === 'revoque' ? 'REVOKED' : 'VALID',
    location: 'Cameroun (Douala)',
    ip: clientIp,
    browser: req.headers['user-agent'] || 'Unknown',
  };

  state.verificationLogs.unshift(logEntry);

  if (!certificate) {
    return res.json({
      status: 'NOT_FOUND',
      message: 'CODE INCONNU — RISQUE ÉLEVÉ DE FALSIFICATION',
      code: uuid,
      data: null,
    });
  }

  if (certificate.status === 'revoque') {
    return res.json({
      status: 'REVOKED',
      message: 'CE DOCUMENT A ÉTÉ OFFICIELLEMENT ANNULÉ PAR L\'UNIVERSITÉ',
      code: uuid,
      data: certificate,
    });
  }

  res.json({
    status: 'VALID',
    message: 'DOCUMENT CERTIFIÉ AUTHENTIQUE PAR L\'ÉTABLISSEMENT',
    code: uuid,
    data: certificate,
  });
});

// POST bulk verification (Excel import simulation)
app.post('/api/verify/bulk', (req, res) => {
  const { uuids } = req.body;

  if (!uuids || !Array.isArray(uuids)) {
    return res.status(400).json({ error: 'Liste d\'UUID requise' });
  }

  const results = uuids.map((uuid) => {
    const certificate = findCertificateById(uuid);
    if (!certificate) {
      return { uuid, status: 'NOT_FOUND', name: 'Inconnu', diploma: 'Code Inexistant' };
    }
    const student = certificate.student_id ? findStudentById(certificate.student_id) : null;
    return {
      uuid,
      status: certificate.status === 'revoque' ? 'REVOKED' : 'VALID',
      name: student ? `${student.first_name} ${student.last_name}` : 'Inconnu',
      diploma: certificate.course_title,
    };
  });

  res.json({ results });
});

// POST revoke certificate (Admin action with MFA)
app.post('/api/certificates/:id/revoke', (req, res) => {
  const { reason, mfa_code, mfa_secret } = req.body;

  // Simulate MFA validation
  if (!mfa_code || String(mfa_code).length !== 6) {
    return res.status(400).json({ error: 'Code MFA à 6 chiffres requis' });
  }

  const cert = findCertificateById(req.params.id);
  if (!cert) return res.status(404).json({ error: 'Certificat non trouvé' });

  cert.status = 'revoque';
  res.json({ success: true, certificate: cert, message: `Diplôme révoqué avec succès. Motif: ${reason || 'Non spécifié'}` });
});

// ---------------------------------------------------------------------------
// STUDENTS & AUTHENTICATION
// ---------------------------------------------------------------------------

// GET student by email (magic link simulation)
app.post('/api/students/login', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email requis' });

  const student = state.students.find((s) => s.email === email.toLowerCase());

  if (!student) {
    return res.status(404).json({ error: 'Aucun étudiant trouvé avec cet email', magic_link: null });
  }

  // Generate magic link (simulated)
  const token = generateSHA256(email + Date.now()).substring(0, 32);
  const magicLink = `http://localhost:4200/student/dashboard?token=${token}`;

  console.log(`🔗 [SIMULATION] Lien magique généré pour ${email}: ${magicLink}`);

  res.json({
    success: true,
    message: 'Email envoyé avec succès (simulation)',
    magic_link: magicLink,
    student: {
      id: student.id,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
    },
  });
});

// GET student by ID
app.get('/api/students/:id', (req, res) => {
  const student = findStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Étudiant non trouvé' });
  res.json(student);
});

// GET student certificates
app.get('/api/students/:id/certificates', (req, res) => {
  const student = findStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Étudiant non trouvé' });
  res.json(student.certificates || []);
});

// ---------------------------------------------------------------------------
// PAYMENTS & MONETIC HUB
// ---------------------------------------------------------------------------

// POST initiate payment
app.post('/api/payments/initiate', (req, res) => {
  const { certificate_id, student_id, gateway, phone, amount } = req.body;

  if (!certificate_id || !student_id || !gateway) {
    return res.status(400).json({ error: 'certificate_id, student_id et gateway requis' });
  }

  const certificate = findCertificateById(certificate_id);
  if (!certificate) return res.status(404).json({ error: 'Certificat non trouvé' });

  const transactionRef = `${gateway.substring(0, 3)}-CU-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;

  const payment = {
    id: generateUUID(),
    certificate_id,
    student_id,
    amount: amount || 1000,
    gateway,
    transaction_reference: transactionRef,
    phone: phone || null,
    is_successful: false,
    paid_at: null,
    status: 'PENDING',
    created_at: new Date().toISOString(),
  };

  state.payments.unshift(payment);

  res.status(201).json({
    success: true,
    payment,
    message: `Paiement ${gateway} initié. En attente de confirmation USSD...`,
  });
});

// POST confirm payment (after 5s USSD/countdown simulation)
app.post('/api/payments/confirm', (req, res) => {
  const { payment_id, otp } = req.body;

  const payment = state.payments.find((p) => p.id === payment_id);
  if (!payment) return res.status(404).json({ error: 'Paiement non trouvé' });

  // Simulate OTP validation (any 6-digit code works for demo)
  if (otp && String(otp).length !== 6 && String(otp) !== '123456') {
    return res.status(400).json({ error: 'Code OTP invalide' });
  }

  payment.is_successful = true;
  payment.status = 'PAID';
  payment.paid_at = new Date().toISOString();

  // Update certificate payment state
  const certificate = findCertificateById(payment.certificate_id);
  if (certificate) {
    certificate.payment_state = 'PAID';

    // Find student and update certificate
    const student = findStudentById(payment.student_id);
    if (student && student.certificates) {
      const studCert = student.certificates.find((c) => c.id === certificate.id);
      if (studCert) studCert.payment_state = 'PAID';
    }
  }

  // Generate receipt reference
  payment.receipt_pdf_url = `assets/docs/receipt_${payment.transaction_reference}.pdf`;

  // Add notification for university
  state.notifications.unshift({
    id: generateUUID(),
    university_id: 'univ-douala-01',
    title: 'Paiement reçu 💰',
    message: `Transaction ${payment.transaction_reference} de ${payment.amount} FCFA confirmée via ${payment.gateway}.`,
    category: 'FINANCIAL',
    is_read: false,
    created_at: new Date().toISOString(),
  });

  res.json({ success: true, payment });
});

// GET payments for student
app.get('/api/payments/student/:id', (req, res) => {
  const payments = state.payments.filter((p) => p.student_id === req.params.id);
  res.json(payments);
});

// GET all payments
app.get('/api/payments', (req, res) => {
  res.json(state.payments);
});

// ---------------------------------------------------------------------------
// VERIFICATION LOGS & ANALYTICS
// ---------------------------------------------------------------------------

app.get('/api/logs', (req, res) => {
  res.json(state.verificationLogs);
});

app.get('/api/logs/recent', (req, res) => {
  res.json(state.verificationLogs.slice(0, 20));
});

// Dashboard stats for university
app.get('/api/dashboard/stats', (req, res) => {
  const totalCertificates = state.certificates.length;
  const totalScans = state.verificationLogs.length;
  const totalFrauds = state.certificates.filter((c) => c.status === 'revoque').length;
  const totalPayments = state.payments.filter((p) => p.is_successful).length;
  const revenue = state.payments.filter((p) => p.is_successful).reduce((sum, p) => sum + p.amount, 0);

  res.json({
    total_certificates: totalCertificates,
    total_scans: totalScans,
    total_frauds: totalFrauds,
    total_payments: totalPayments,
    total_revenue: revenue,
    weekly_activity: [
      { day: 'Lun', scans: 12, certificates: 4 },
      { day: 'Mar', scans: 18, certificates: 6 },
      { day: 'Mer', scans: 15, certificates: 3 },
      { day: 'Jeu', scans: 25, certificates: 8 },
      { day: 'Ven', scans: 30, certificates: 10 },
      { day: 'Sam', scans: 8, certificates: 2 },
      { day: 'Dim', scans: 5, certificates: 1 },
    ],
  });
});

// ---------------------------------------------------------------------------
// NOTIFICATIONS & MESSAGING
// ---------------------------------------------------------------------------

app.get('/api/notifications', (req, res) => {
  res.json(state.notifications);
});

app.post('/api/notifications/:id/read', (req, res) => {
  const notif = state.notifications.find((n) => n.id === req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification non trouvée' });
  notif.is_read = true;
  res.json({ success: true, notification: notif });
});

app.post('/api/notifications/read-all', (req, res) => {
  state.notifications.forEach((n) => (n.is_read = true));
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// AI DESIGN STUDIO
// ---------------------------------------------------------------------------

app.get('/api/design/themes', (req, res) => {
  res.json(db.ai_design_themes || []);
});

app.post('/api/design/generate', (req, res) => {
  const { prompt, templateName } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt requis' });

  const themes = db.ai_design_themes || [];
  const promptLower = prompt.toLowerCase();

  // Find matching theme by keyword
  const matchedTheme = themes.find((t) => promptLower.includes(t.trigger_keyword));

  // Simulate AI processing delay
  setTimeout(() => {
    res.json({
      success: true,
      template_name: templateName || 'Diplôme personnalisé',
      theme: matchedTheme || {
        trigger_keyword: 'default',
        primary_color: '#1E3A8A',
        border_style: '2px solid #1E3A8A',
        font_family: 'Inter, sans-serif',
        accent_color: '#3B82F6',
      },
      generated_html: '<div class="diploma">Gabarit généré par IA</div>',
      message: matchedTheme
        ? `Thème "${matchedTheme.trigger_keyword}" appliqué avec succès`
        : 'Thème par défaut appliqué. Essayez "medecine", "informatique" ou "droit" pour des thèmes personnalisés.',
    });
  }, 1500); // Simulate AI processing latency
});

// Save design template to history
app.post('/api/design/history', (req, res) => {
  const { name, theme, template_tags } = req.body;

  const historyEntry = {
    id: 'tpl-' + Date.now(),
    name: name || 'Gabarit sans nom',
    theme: theme || 'default',
    template_tags: template_tags || [],
    created_at: new Date().toISOString(),
  };

  if (!db.design_history) db.design_history = [];
  db.design_history.unshift(historyEntry);

  res.status(201).json({ success: true, history: historyEntry });
});

app.get('/api/design/history', (req, res) => {
  res.json(db.design_history || []);
});

// ---------------------------------------------------------------------------
// EXCEL IMPORT & IA QUALITY CONTROL
// ---------------------------------------------------------------------------

// POST validate excel data (simulated parsing)
app.post('/api/excel/validate', (req, res) => {
  const { rows } = req.body;

  if (!rows || !Array.isArray(rows)) {
    return res.status(400).json({ error: 'Données Excel requises' });
  }

  const errors = [];
  const validRows = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // Header row offset

    // Check grade validity (max 20/20)
    const gradeMatch = String(row.final_grade || '').match(/(\d+(?:[.,]\d+)?)\s*\/\s*20/);
    if (gradeMatch && parseFloat(gradeMatch[1]) > 20) {
      errors.push({
        row: rowNum,
        student_name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        field: 'final_grade',
        value: row.final_grade,
        error: 'Note supérieure à 20',
      });
    }

    // Check case sensitivity (first letter uppercase)
    if (row.first_name && row.first_name[0] !== row.first_name[0].toUpperCase()) {
      errors.push({
        row: rowNum,
        student_name: `${row.first_name} ${row.last_name || ''}`.trim(),
        field: 'first_name',
        value: row.first_name,
        error: 'Casse incorrecte (minuscules)',
      });
    }

    // Check email format
    if (row.email && !String(row.email).includes('@')) {
      errors.push({
        row: rowNum,
        student_name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        field: 'email',
        value: row.email,
        error: 'Format email invalide',
      });
    }

    if (errors.length === 0 || !errors.some((e) => e.row === rowNum)) {
      validRows.push(row);
    }
  });

  res.json({
    total_rows: rows.length,
    valid_rows: validRows.length,
    error_count: errors.length,
    errors,
  });
});

// POST import validated excel rows (emission massive)
app.post('/api/excel/import', (req, res) => {
  const { rows, university_id } = req.body;

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Aucune ligne valide à importer' });
  }

  const imported = rows.map((row) => {
    const hashInput = `${row.first_name}|${row.last_name}|${row.course_title}|${row.final_grade}|${Date.now()}`;
    const certificate = {
      id: generateUUID(),
      university_id: university_id || 'univ-douala-01',
      student_id: null,
      course_title: row.course_title || 'Diplôme',
      final_grade: row.final_grade || 'N/A',
      issue_date: new Date().toISOString().split('T')[0],
      certificat_hash: generateSHA256(hashInput),
      status: 'active',
      payment_state: 'PENDING',
      pdf_url: null,
    };

    state.certificates.push(certificate);
    return certificate;
  });

  res.status(201).json({
    success: true,
    imported_count: imported.length,
    certificates: imported,
    message: `${imported.length} diplômes émis et notarisés avec succès (hash SHA-256 générés)`,
  });
});

// ---------------------------------------------------------------------------
// CYBERSECURITY & ATTACK SIMULATION
// ---------------------------------------------------------------------------

app.get('/api/security/alerts', (req, res) => {
  res.json({
    attack_detected: attackDetected,
    alerts: attackDetected ? [currentAttack] : (db.cyber_security_alerts || []),
  });
});

// Trigger simulated attack
app.post('/api/security/simulate-attack', (req, res) => {
  attackDetected = true;
  currentAttack = {
    id: 'alert-sim-' + Date.now(),
    threat_type: 'Attaque par Force Brute (Brute Force)',
    target_uuid: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    target_student: 'Marie Ngo',
    origin_ip: '198.51.100.42',
    estimated_location: 'Chine (Shenzhen)',
    severity: 'CRITICAL',
    timestamp: new Date().toISOString(),
  };

  res.json({ success: true, attack: currentAttack });
});

// Resolve attack
app.post('/api/security/resolve', (req, res) => {
  const { action } = req.body;

  attackDetected = false;

  res.json({
    success: true,
    action: action || 'ATTACK_RESOLVED',
    message: 'Alerte de sécurité résolue. Système rétabli.',
  });
});

// ---------------------------------------------------------------------------
// SUPERADMIN CONSOLE
// ---------------------------------------------------------------------------

app.get('/api/superadmin/dashboard', (req, res) => {
  res.json({
    universities: state.universities,
    total_universities: state.universities.length,
    production_count: state.universities.filter((u) => u.environment_mode === 'PRODUCTION').length,
    sandbox_count: state.universities.filter((u) => u.environment_mode === 'SANDBOX').length,
    total_certificates: state.certificates.length,
    total_scans: state.verificationLogs.length,
    firewall_logs: [
      { time: '00:00:01', event: 'ALLOW', source: '41.202.160.10', target: 'Verify API', proto: 'HTTPS' },
      { time: '00:00:05', event: 'BLOCK', source: '198.51.100.42', target: 'Verify API', proto: 'HTTPS', reason: 'RATE_LIMIT_EXCEEDED' },
      { time: '00:01:12', event: 'ALLOW', source: '90.63.120.45', target: 'Static Assets', proto: 'HTTPS' },
      { time: '00:02:03', event: 'ALLOW', source: '41.207.50.32', target: 'Student Login', proto: 'HTTPS' },
      { time: '00:03:45', event: 'BLOCK', source: '198.51.100.42', target: 'Bulk API', proto: 'HTTPS', reason: 'BRUTE_FORCE_DETECTED' },
    ],
  });
});

// MFA validation for superadmin
app.post('/api/superadmin/authenticate', (req, res) => {
  const { yubikey_connected } = req.body;

  if (!yubikey_connected) {
    return res.status(401).json({ error: 'Clé YubiKey non détectée. Veuillez connecter votre clé matérielle.' });
  }

  res.json({ success: true, message: 'Authentification matérielle validée. Accès console accordé.' });
});

// ---------------------------------------------------------------------------
// AUTH & MFA
// ---------------------------------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Demo credentials
  const validAdmins = [
    { email: 'admin@univ-douala.cm', password: 'admin123', role: 'UNIVERSITY_ADMIN', university_id: 'univ-douala-01' },
    { email: 'superadmin@certiuni.cm', password: 'super123', role: 'SUPER_ADMIN', university_id: null },
  ];

  const admin = validAdmins.find((a) => a.email === email && a.password === password);

  if (!admin) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const token = generateSHA256(email + Date.now()).substring(0, 48);

  res.json({
    success: true,
    token,
    user: { email, role: admin.role, university_id: admin.university_id },
    message: 'Authentification réussie',
  });
});

// ---------------------------------------------------------------------------
// ERROR HANDLING
// ---------------------------------------------------------------------------

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur', message: err.message });
});

// ---------------------------------------------------------------------------
// START SERVER
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              CERTIUNI BACKEND SERVER v3.0                ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  ✅ API: http://localhost:${PORT}                          ║`);
  console.log('║  ✅ CORS: http://localhost:4200 (Angular)                ║');
  console.log('║  ✅ Mode: Simulation-Driven Design (Frontend-Driven)     ║');
  console.log('║  ✅ Database: PostgreSQL (simulation via mock-data.json) ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('Serveur connecté avec succès à PostgreSQL local sur le port 3000');
});
