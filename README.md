# SMAT-SR · Sistema de Monitoreo, Análisis de Tráfico y Seguridad de Red

<p align="center">
  <strong>Cooperativa de Ahorro y Crédito San Antonio R.L. — Cochabamba, Bolivia</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Socket.io-RT-010101?style=flat-square&logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📋 Descripción

**SMAT-SR** es una plataforma web full-stack de monitoreo de red en tiempo real diseñada para la Cooperativa de Ahorro y Crédito San Antonio R.L. de Cochabamba, Bolivia. El sistema simula y visualiza el comportamiento físico de la red corporativa de cobre (UTP Cat 6) que interconecta las 9 agencias de la cooperativa.

### Características principales

- **Osciloscopio PAM-5 en tiempo real** — Renderizado vectorial en Canvas HTML5 de la señal eléctrica con 5 niveles de voltaje
- **Cálculo físico de señales** — Atenuación (`A = 0.328 dB/m × L`), SNR, retardo de propagación (`τ = L / 0.68c`) y diafonía (NEXT/FEXT)
- **Algoritmo Dijkstra (OSPF)** — Enrutamiento dinámico con failover automático COMTECO → ENTEL en < 3 segundos
- **Simulación de interferencia EMI** — Modelado del ruido electromagnético de La Cancha (feria) y su impacto en el SNR
- **Mitigación DDoS** — Null Routing automático sobre VLAN 10 transaccional
- **4 VLANs segmentadas** — Cumplimiento de normativa ASFI Bolivia para entidades financieras
- **Corte físico de fibra/cobre** — Simulación de pérdida total de portadora con respuesta en todas las capas OSI
- **Topología WAN dinámica** — Visualización interactiva de la red OSPF con 9 agencias
- **Gráficos en tiempo real** — Latencia WAN y ancho de banda con historial de 30 puntos

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│  FRONTEND · React 19 + Vite 8                   │
│  Osciloscopio Canvas · Chart.js · Framer Motion │
├─────────────────────────────────────────────────┤
│  WebSocket (Socket.io) — telemetría cada 1s     │
├─────────────────────────────────────────────────┤
│  BACKEND · Node.js + Express · Puerto 3001      │
│  signalService · ospfService · securityService  │
└─────────────────────────────────────────────────┘
```

| Capa | Tecnología | Responsabilidad |
|------|-----------|----------------|
| Frontend | React 19, Vite 8, Chart.js, Framer Motion | Visualización, osciloscopio, dashboard UI |
| Transporte | Socket.io (WebSocket) | Telemetría bidireccional en tiempo real |
| Backend | Node.js, Express | Motor de cálculo físico, OSPF, seguridad |

---

## 🚀 Instalación y ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Stuwarth/Cooperativa-San-Antonio.git
cd Cooperativa-San-Antonio
```

### 2. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Compilar el frontend para producción
```bash
cd frontend
npm run build
```

### 4. Iniciar el servidor
```bash
cd backend
npm start
```

### 5. Abrir en el navegador
```
http://localhost:3001
```

> **Nota:** El backend sirve automáticamente el frontend compilado. Solo necesitas un servidor corriendo.

### (Opcional) Exponer a internet con Cloudflare Tunnel
```bash
npx -y cloudflared tunnel --url http://localhost:3001
```
Esto genera un link público temporal tipo `https://xxx.trycloudflare.com` para acceder desde cualquier dispositivo.

---

## 📁 Estructura del proyecto

```
├── backend/
│   ├── server.js                    # Entry point del servidor HTTP + Socket.io
│   └── src/
│       ├── app.js                   # Configuración Express (middleware, rutas, static)
│       ├── controllers/             # Controladores REST (simulación)
│       ├── middleware/              # CORS, rate limiting, logger, error handler
│       ├── models/                  # Datos de agencias (branches)
│       ├── routes/                  # Rutas API REST
│       ├── services/               # Lógica de negocio
│       │   ├── signalService.js    # Cálculos físicos (atenuación, SNR, EMI, τ)
│       │   ├── ospfService.js      # Algoritmo Dijkstra + failover WAN
│       │   ├── securityService.js  # VLANs, DDoS, IDS/IPS
│       │   ├── emiService.js       # Motor de interferencia electromagnética
│       │   └── linkCutService.js   # Estado de corte físico de enlace
│       ├── sockets/
│       │   └── socketHandler.js    # Emisor de telemetría cada 1 segundo
│       └── utils/                  # Helpers y errores personalizados
│
├── frontend/
│   ├── index.html
│   └── src/
│       ├── App.jsx                  # Layout principal (3 columnas)
│       ├── components/
│       │   ├── Oscilloscope/        # Osciloscopio vectorial PAM-5 en Canvas
│       │   ├── SignalPanel/         # Panel de métricas físicas
│       │   ├── Charts/              # Gráficos de latencia y ancho de banda
│       │   ├── TopologyMap/         # Mapa de topología WAN (OSPF)
│       │   ├── WanStatus/           # Estado de enlaces COMTECO/ENTEL
│       │   ├── SecurityPanel/       # Seguridad perimetral (VPN, VLANs, IDS)
│       │   ├── SimulationControls/  # Botones de inyección de fallos
│       │   ├── BranchList/          # Lista de 9 agencias
│       │   ├── AlertsLog/           # Registro de auditoría ASFI
│       │   └── Header/              # Encabezado con estado del sistema
│       ├── hooks/                   # Custom hooks (useSocket, useBranches, useSimulation)
│       ├── services/                # API client (fetch wrapper)
│       ├── styles/                  # CSS design system (kit.css)
│       └── utils/                   # Constantes y helpers
│
├── .gitignore
└── README.md
```

---

## 🔬 Simulaciones disponibles

El dashboard incluye 4 escenarios de fallo que se activan desde los botones del panel derecho:

| Simulación | Qué simula | Efecto visible |
|-----------|-----------|---------------|
| **Fallo COMTECO** | Caída del enlace WAN principal | OSPF reconverge a ENTEL (< 3s), osciloscopio cambia a violeta |
| **Ruido Feria (EMI)** | Interferencia electromagnética de La Cancha | SNR cae de ~37 dB a ~20 dB, onda se llena de ruido |
| **Ataque DDoS** | Bombardeo de paquetes TCP SYN | Osciloscopio rojo, frecuencia máxima, Null Routing activado |
| **Corte Físico** | Ruptura total del cable de cobre/fibra | Flatline 0V, VPN/IDS/VLANs pasan a "Sin Portadora" |

---

## 🏦 Contexto del caso real

La **Cooperativa de Ahorro y Crédito San Antonio R.L.** es una entidad financiera real fundada en 1962 en Cochabamba, Bolivia, regulada por la ASFI. Su oficina central está ubicada en Calle Tarata, en la zona de La Cancha, donde la actividad comercial de los días de feria (miércoles y sábados) genera interferencia electromagnética que degrada la calidad de las comunicaciones de red por cobre.

---

## 👥 Equipo — Grupo 6

Proyecto Final de la materia **Análisis de Sistemas y Señales**  
**Carrera:** Ingeniería de Sistemas — 9no Semestre  
**Universidad Privada Domingo Savio (UPDS)** — Cochabamba, Bolivia  
**Año:** 2026

---

## 📄 Licencia

Este proyecto es de uso académico. Desarrollado como proyecto final universitario.
