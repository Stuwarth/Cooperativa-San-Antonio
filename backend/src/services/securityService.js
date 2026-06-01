// ============================================================================
// SERVICIO: Simulación de Ciberseguridad (Ataque DDoS y ASFI Compliance)
// Integración de Skill "droid-tings/isms-audit-expert": ISO 27001 / ASFI
// ============================================================================

let securityState = {
  vpn: { status: "ok", label: "Túnel VPN IPsec (ISO 27001 A.10.1)" },
  vlan: { status: "ok", label: "VLAN 10 Cajas Aislada (ASFI Art. 24)" },
  ids: { status: "ok", label: "IPS Firewall Activo (A.13.1.2)" },
  ddosActive: false,
  attackSource: null,
  blockedIPs: [],
  asfiCompliant: true,
  isoControls: {
    "A.13.1": "Seguridad de Redes: OK",
    "A.16.1": "Gestión de Incidentes: OK"
  }
};

/**
 * Simula un ataque DDoS dirigido a la red transaccional de cajas
 * @returns {object} Estado de seguridad bajo ataque
 */
export const triggerDdos = () => {
  securityState.ddosActive = true;
  securityState.attackSource = "185.234.xx.xx (TCP SYN Flood)";
  securityState.vlan = { status: "danger", label: "¡VLAN 10 BAJO ATAQUE DDOS!" };
  securityState.ids = { status: "danger", label: "IPS DETECTA ANOMALÍA" };
  securityState.asfiCompliant = false;
  securityState.isoControls["A.16.1"] = "Incidente Abierto: Severidad Crítica";
  securityState.isoControls["A.13.1"] = "Violación de Disponibilidad";

  return { ...securityState, message: "Alerta ISMS: Ataque detectado. Iniciando plan de contingencia." };
};

/**
 * Mitiga el ataque DDoS (el IPS bloquea la IP atacante)
 * @returns {object} Estado post-mitigación
 */
export const mitigateDdos = () => {
  // Simulando regla "Null Routing" (BGP Blackholing o ACL)
  securityState.blockedIPs.push(securityState.attackSource);
  securityState.ids = { status: "ok", label: "IPS Null Routing Activado" };
  securityState.vlan = { status: "ok", label: "VLAN 10 Cajas Protegida" };
  securityState.asfiCompliant = true;
  securityState.isoControls["A.16.1"] = "Incidente Mitigado (Reporte ASFI autogenerado)";
  securityState.isoControls["A.13.1"] = "Tráfico Restablecido";

  return { ...securityState, message: "Auditoría ISMS: Controles aplicados con éxito. Cumplimiento restablecido." };
};

/**
 * Devuelve el estado actual de seguridad
 */
export const getSecurityState = () => ({ ...securityState });

/**
 * Restaura completamente la seguridad al estado normal
 */
export const resetSecurity = () => {
  securityState = {
    vpn: { status: "ok", label: "Túnel VPN IPsec (ISO 27001 A.10.1)" },
    vlan: { status: "ok", label: "VLAN 10 Cajas Aislada (ASFI Art. 24)" },
    ids: { status: "ok", label: "IPS Firewall Activo (A.13.1.2)" },
    ddosActive: false,
    attackSource: null,
    blockedIPs: [],
    asfiCompliant: true,
    isoControls: {
      "A.13.1": "Seguridad de Redes: OK",
      "A.16.1": "Gestión de Incidentes: OK"
    }
  };
  return { ...securityState };
};
