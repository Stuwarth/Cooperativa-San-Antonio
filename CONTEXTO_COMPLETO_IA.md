# CONTEXTO COMPLETO Y MEMORIA TÉCNICA DEL PROYECTO (SMAT-SR)
**Para uso de Asistentes de Codificación por IA y Defensas Académicas**

Este documento proporciona la historia, el origen académico, la justificación de ingeniería y los fundamentos físicos/lógicos del proyecto **SMAT-SR**. Ha sido estructurado de forma rigurosa para que cualquier Inteligencia Artificial o evaluador entienda el "por qué" absoluto detrás de este desarrollo.

---

## 1. HISTORIA Y ORIGEN ACADÉMICO (EL "POR QUÉ" DEL PROYECTO)

### ¿En qué materia estamos y cuál es el contexto académico?
Este proyecto es el **Proyecto Final de Grado** para la asignatura **Análisis de Sistemas y Señales**, perteneciente al **Noveno Semestre de la carrera de Ingeniería de Sistemas** en la **Universidad Privada de Cochabamba** (Bolivia). El equipo de trabajo está asignado al **Grupo 6** (coordinado por el estudiante **Tomas**).

### El Tema de Moodle Original:
El tema asignado oficialmente por la universidad en la plataforma Moodle es:
**"Red WAN corporativa de cobre con balanceo de carga, seguridad y cableado estructurado (UTP Cat 6)"**

### Lo que el Docente Pidió y lo que Tú Entendiste:
Durante el proceso de diseño, tuviste una reunión de consulta directa con tu docente para aclarar el alcance del proyecto. De esta conversación surgieron dos directrices críticas que definen la existencia de este software:

1.  **Enfoque en la Ingeniería de Sistemas (No en Telecomunicaciones Puras):**
    El docente fue sumamente enfático: **no quería que el grupo presentara un proyecto puramente de infraestructura de telecomunicaciones** (es decir, limitarse a configurar routers físicos, diseñar empalmes o simplemente tirar cables, ya que eso corresponde al área de Ingeniería de Telecomunicaciones). Él solicitó una **solución propia de Ingeniería de Sistemas** para resolver un problema corporativo real, sugiriendo una página web, una aplicación centralizada, una lógica de seguridad o una plataforma de software.
2.  **El Filtro de Control de Telecomunicaciones (La materia):**
    El docente advirtió que, dado que la materia es *Análisis de Sistemas y Señales*, durante la defensa oral **él evaluará de forma estricta conceptos avanzados de telecomunicaciones y física de señales** para comprobar que el proyecto no se desvíe de los objetivos de la materia. Específicamente, el docente mencionó preguntas de control como: *«A qué nivel de ondas viaja la información por el cable de cobre UTP Categoría 6, qué pasa con la frecuencia, qué es la atenuación y cómo afecta el ruido a la señal»*.

### La Sinergia del Co-diseño:
Para responder con la máxima excelencia a estas dos exigencias cruzadas, diseñamos el **Dashboard SMAT-SR**:
*   **La Solución de Sistemas:** Una **aplicación web centralizada Full-Stack** (React + Node.js) que simula y monitorea el estado transaccional, enrutamiento y seguridad de las agencias de la cooperativa en Cochabamba.
*   **La Justificación de Señales (El pretexto perfecto para la defensa):** La aplicación no es un dashboard administrativo genérico; **su motor principal calcula y visualiza en tiempo real las ondas de voltaje y el comportamiento físico de los canales de cobre UTP Cat 6**. Durante la exposición de 15 minutos, ustedes podrán encender la simulación de ruido electromagnético en vivo y mostrarle al docente en la pantalla el comportamiento de la onda en el osciloscopio y la caída del SNR, respondiendo a sus preguntas técnicas usando su propio software de sistemas.

---

## 2. CONTEXTO DE NEGOCIO: LA COOPERATIVA SAN ANTONIO R.L.

Para dar una solución real aplicada al contexto nacional de Bolivia, el grupo seleccionó a la **Cooperativa de Ahorro y Crédito Abierta "San Antonio" R.L. (CACSA)**, una institución financiera cochabambina con más de 64 años de trayectoria (fundada en 1962), regulada por la **ASFI**.

### El Problema Real de la Cooperativa en Cochabamba:
La cooperativa cuenta con una Oficina Central y nueve agencias urbanas y rurales (Loreto, Ayacucho, Sacaba, Quillacollo, Villa Tunari, etc.). El núcleo de sus problemas radica en su ubicación y entorno físico:
1.  **La Congestión Eléctrica de la Calle Tarata (La Cancha):** La Oficina Central está ubicada en plena calle Tarata, el corazón del comercio informal de Cochabamba. El cableado estructurado interno de cobre está expuesto a un altísimo **Ruido Electromagnético (EMI)** debido a transformadores públicos deficientes, motores comerciales y miles de cables informales aéreos.
2.  **El "Sistema Lento" los Días de Feria:** Los miércoles y sábados son días de intensa actividad comercial. La inducción de interferencias eléctricas (EMI) en el cobre UTP Cat 6 disminuye drásticamente la **Relación Señal/Ruido (SNR)** de la línea de datos. Al caer el SNR, los switches detectan tramas corruptas mediante el código de redundancia cíclica (CRC) y las descartan en la Capa 2 (Enlace). Esto obliga a la Capa de Transporte (TCP) a retransmitir constantemente los paquetes transaccionales de las cajas bancarias, provocando retrasos en la atención al cliente y colas extensas.
3.  **La Vulnerabilidad WAN:** La cooperativa dependía de una sola línea WAN de cobre (COMTECO). Cualquier corte físico por obras en la calle Tarata paralizaba la atención. Se requiere implementar redundancia automática mediante el protocolo de enrutamiento dinámico **OSPF** con balanceo y conmutación transparente en menos de 3 segundos hacia un enlace secundario de **ENTEL**.
4.  **Regulaciones de ASFI y Ciberseguridad:** ASFI exige separar la red transaccional de cajas de cobro mediante segmentación por **VLANs** y mitigar ataques de denegación de servicio (DDoS TCP SYN) que intenten colapsar el Core transaccional.

---

## 3. ARQUITECTURA DE SOFTWARE (DESACOPLADA Y MODULAR)

Para garantizar un código limpio, estructurado y libre de "código fideo", el proyecto se divide estrictamente en dos directorios:

1.  **`backend/` (Servidor de Telemetría y Sockets):**
    *   **Stack:** Node.js + Express + Socket.io utilizando ES Modules (`import`/`export`).
    *   **Puerto:** Corre en `http://localhost:3001`.
    *   **Función:** Aloja la lógica y las ecuaciones reales del comportamiento de señales (EMC), enrutamiento ponderado Dijkstra (OSPF) y mitigación de amenazas (Null Routing). Emite telemetría física en tiempo real cada 1 segundo mediante WebSockets.
2.  **`frontend/` (Dashboard de Instrumentación y UI):**
    *   **Stack:** React 19 + Vite 8 + CSS Modules + react-chartjs-2 + socket.io-client + lucide-react.
    *   **Puerto:** Corre en `http://localhost:5173`.
    *   **Función:** Interfaz de usuario interactiva bajo una estética premium inspirada en **Vercel / Linear.app** (Modo Oscuro Profundo, Grises Zinc, bordes finos de 1px translúcidos, tipografía técnica, osciloscopio en canvas con fósforo glowing y cero emojis).

---

## 4. LAS 9 SKILLS CIENTÍFICAS E INGENIERILES DETALLADAS

Cualquier sugerencia o edición de código que realice un asistente de IA debe respetar obligatoriamente estos 9 pilares académicos implementados:

### Skill 1: Impeccable (Diseño Impecable sin Placeholders)
*   Cero textos ficticios o "Lorem Ipsum". Todo dato de agencias, direcciones en Cochabamba y notas técnicas responde a la realidad regional.
*   Física de transiciones suaves configuradas con curvas Bezier (`cubic-bezier(0.16, 1, 0.3, 1)`) en hover de agencias, botones y cambios de estado.
*   Buscador interactivo con lupa integrada en la izquierda y el badge de acceso rápido `⌘K` o `Ctrl+K` en la derecha (estilo Linear).
*   **Cero emojis:** Todos los emojis simples (`🔒`, `🛡️`, `⚠️`, etc.) fueron eliminados para evitar el aspecto de "starter template de IA" y reemplazados por **32 iconos vectoriales uniformes de Lucide** (`lucide-react`) con grosor de línea de `1.5px`.

### Skill 2: Frontend-Design (Estética de Gama Ultra-Alta Vercel/Linear)
*   **Paleta de Color Zinc:** Fondo de pantalla en gris zinc abismal (`#09090b`) con paneles en `#121215` y bordes finos de 1px translúcidos (`rgba(255,255,255,0.06)`).
*   **Scrollbars Estéticas:** Se eliminó la ocultación del scrollbar que arruinaba la usabilidad. Se diseñaron barras de desplazamiento ultrafinas y translúcidas globales.
*   **Tipografía Monoespaciada Dinámica:** Los valores numéricos del panel de métricas y del reloj utilizan la fuente monoespaciada `JetBrains Mono`, evitando que las cajas de texto salten de posición o cambien su ancho al actualizar la telemetría.

### Skill 3: NetworkX (Enrutamiento OSPF y Algoritmo Dijkstra en Backend)
*   **Ubicación:** `backend/src/services/ospfService.js`
*   **Lógica:** Modela la topología de red WAN corporativa de la cooperativa como un grafo ponderado. Utiliza un algoritmo **Dijkstra** real que calcula los costos basándose en el ancho de banda y el retardo físico.
*   **Failover OSPF:** Al simular la caída del enlace de cobre principal de COMTECO, el backend recalcula dinámicamente el camino más corto OSPF y conmuta en menos de 3 segundos todo el tráfico transaccional a la línea secundaria de ENTEL, notificando en vivo mediante sockets.

### Skill 4: Kicad-EMC (Física de Señales y Ruido Electromagnético en Cobre)
*   **Ubicación:** `backend/src/services/signalService.js` y `emiService.js`
*   **Retardo de Propagación Físico ($\tau$):** Ecuación basada en el 68% de la velocidad de la luz (NVP: 0.68c) para cables UTP Cat 6 de cobre:
    $$\tau = \frac{L}{V_p} = \frac{L}{0.68 \cdot (3 \times 10^8 \text{ m/s})}$$
    Demuestra que en tramos cortos (8m Central) el retardo físico es de apenas $39.2\text{ ns}$ y en largos (90m Villa Tunari) es de $441.1\text{ ns}$.
*   **Atenuación Exponencial ($A$):** Pérdida de potencia en decibelios ($dB$) calculada en base a la longitud del cable ($L$) a una frecuencia operativa límite de $250\text{ MHz}$ ($\alpha \approx 0.328\text{ dB/m}$):
    $$A(dB) = 0.328 \text{ dB/m} \cdot L$$
    Justifica matemáticamente por qué la agencia de Villa Tunari (90m) pierde el **97% de su amplitud eléctrica ($29.52\text{ dB}$)**, rozando el límite de la norma internacional.
*   **Interferencia SNR:** Simula la caída drástica del margen SNR por ruido inducido de la Cancha en la Calle Tarata.

### Skill 5: ISMS Audit (Seguridad perimetral y Normativas ASFI)
*   **Ubicación:** `backend/src/services/securityService.js` y `frontend/src/components/SecurityPanel/`
*   Garantiza el cumplimiento estricto de las circulares financieras ASFI en Bolivia:
    *   **VLAN 10 (`TRANSACT`):** Red Core y ventanillas cifradas bajo túneles VPN IPsec (AES-256).
    *   **VLAN 20 (`ADMIN`):** Computadores administrativos.
    *   **VLAN 30 (`VOIP`):** Telefonía IP priorizada en switches con QoS CoS 7 para evitar desincronización y jitter.
    *   **VLAN 90 (`WIFI_INV`):** WiFi abierto aislado para socios en sala de espera.

### Skill 6: Gigabit Ethernet (Modulación PAM-5 y Hardware CRT Canvas)
*   **Ubicación:** `frontend/src/components/Oscilloscope/Oscilloscope.jsx`
*   **Canvas Vectorial:** Dibuja el comportamiento de la modulación PAM-5 (5 niveles eléctricos: $+2\text{V}, +1\text{V}, 0\text{V}, -1\text{V}, -2\text{V}$) de Gigabit Ethernet sobre cobre.
*   **Fósforo Glowing de Hardware:** Aplica un filtro de drop-shadow CSS perimetral verde esmeralda, simulando el barrido y la luminiscencia residual de los tubos CRT clásicos.
*   **Rejilla CRT Tenue:** La rejilla se dibuja con líneas discontinuas extremadamente sutiles mediante `ctx.setLineDash([2, 4])` y trazo ultra-fino de `0.8px` a `1px` en el eje central de 0 Voltios.
*   **Radar Dinámico:** La etiqueta "EN VIVO" posee un radar circular vectorial animado.

### Skill 7: DDoS Firewall IPS Mitigation (Defensas en Ventanillas)
*   **Ubicación:** `backend/src/services/securityService.js`
*   Simula la mitigación activa de ráfagas masivas de peticiones TCP SYN dirigidas a las cajas de la central. El motor IPS detecta el ataque en la VLAN 10 y aplica **Null Routing** (agujero negro) inmediato a la IP atacante, registrando la alerta en la consola y aislando el tráfico bancario para mantenerlo operativo.

### Skill 8: Live Audit Terminal Console (Terminal de Auditoría ASFI)
*   **Ubicación:** `frontend/src/components/AlertsLog/`
*   Funciona como una terminal de comandos e instrumentación de redes corporativas. Clasifica los logs recibidos vía socket según su nivel de severidad (`info` en blanco, `warning` en ásbar, `danger` en rojo carmesí parpadeante) y formatea las marcas de tiempo en formato `[HH:MM:SS]` con tipografía monoespaciada.

### Skill 9: Real-time Telemetry (Flujo bidireccional WebSocket)
*   **Ubicación:** `frontend/src/hooks/useSocket.js` y `backend/src/server.js`
*   Mapea un canal WebSocket continuo a través de **Socket.io** para actualizar el osciloscopio, atenuaciones, log y latencias cada segundo de forma fluida y orgánica sin saturar al navegador con peticiones cíclicas REST.

---

## 5. GUÍA DE EJECUCIÓN (CÓMO HACER CORRER EL SISTEMA)

1.  **Levantar el Servidor Backend (Puerto 3001):**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Levantar el Servidor Frontend (Puerto 5173):**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **Abrir en el Navegador:**
    [http://localhost:5173/](http://localhost:5173/)
