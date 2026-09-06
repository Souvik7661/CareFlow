import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { seedDatabase } from './db/seed.ts';

import authRouter from './routes/auth.ts';
import aiRouter from './routes/ai.ts';
import appointmentsRouter from './routes/appointments.ts';
import checkinRouter from './routes/checkin.ts';
import queueRouter from './routes/queue.ts';
import doctorRouter from './routes/doctor.ts';
import patientRouter from './routes/patient.ts';
import receptionRouter from './routes/reception.ts';
import adminRouter from './routes/admin.ts';
import hospitalsRouter from './routes/hospitals.ts';
import diseasesRouter from './routes/diseases.ts';
import ambulanceRouter from './routes/ambulance.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/checkin', checkinRouter);
app.use('/api/queue', queueRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/reception', receptionRouter);
app.use('/api/admin', adminRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/diseases', diseasesRouter);
app.use('/api/ambulance', ambulanceRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CareFlow AI Hospital Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve client in production if built with PWA rural offline caching support
const clientDist = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, {
    setHeaders: (res, filePath) => {
      if (filePath.includes('/assets/')) {
        // Hashed static bundles: cache aggressively
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest')) {
        // Service Worker & manifest: revalidate
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        // HTML and other entry points: cacheable with revalidation
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Auto-seed database if needed on startup
try {
  seedDatabase();
} catch (err) {
  console.error('[SERVER] Auto-seed check error:', err);
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 CareFlow AI Server running at http://localhost:${PORT}`);
  console.log(`📡 Real-Time SSE Queue Stream at http://localhost:${PORT}/api/queue/events`);
  console.log(`====================================================`);
});
