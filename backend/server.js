// ============================================================================
// ENTRY POINT: Servidor SMAT-SR (Express + Socket.io)
// Cooperativa de Ahorro y Crédito San Antonio R.L. - Cochabamba, Bolivia
// ============================================================================

import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { setupSocketHandler } from './src/sockets/socketHandler.js';

const PORT = 3001;
const httpServer = createServer(app);

// Configurar Socket.io con CORS
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  }
});

// Compartir instancia de io con Express (para emitir eventos desde controladores)
app.set('io', io);

// Inicializar el manejador de WebSockets
setupSocketHandler(io);

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  SMAT-SR Backend - Cooperativa San Antonio R.L.        ║');
  console.log('║  Sistema de Monitoreo, Análisis y Seguridad de Red     ║');
  console.log(`║  Servidor activo en: http://localhost:${PORT}              ║`);
  console.log('║  WebSocket (Socket.io) escuchando conexiones...        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
});
