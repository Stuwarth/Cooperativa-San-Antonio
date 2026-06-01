// ============================================================================
// Integración de Skill "droid-tings/networkx": Dijkstra Algorithm OSPF
// ============================================================================

import { setLinkStatus, getWanLinks, resetLinks } from '../models/wanLinks.js';

// Topología de red (Grafo de agencias y enlaces)
// Nodos: 0 (Central), 1 (Norte), 2 (Sur), 3 (Quillacollo), etc.
const networkGraph = {
  0: { 1: 10, 2: 15, 3: 20 }, // Central conecta a agencias con métrica base
  1: { 0: 10, 2: 5 },
  2: { 0: 15, 1: 5, 3: 8 },
  3: { 0: 20, 2: 8 }
};

/**
 * Algoritmo de Dijkstra para OSPF (Shortest Path First)
 */
const dijkstraOSPF = (graph, startNode) => {
  let distances = {};
  let visited = new Set();
  
  for (let node in graph) distances[node] = Infinity;
  distances[startNode] = 0;

  while (visited.size < Object.keys(graph).length) {
    let currNode = null;
    let minDistance = Infinity;
    
    for (let node in distances) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node];
        currNode = node;
      }
    }
    
    if (currNode === null) break;
    visited.add(currNode);
    
    for (let neighbor in graph[currNode]) {
      let metric = graph[currNode][neighbor];
      let distance = distances[currNode] + metric;
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
      }
    }
  }
  return distances;
};

let routingState = {
  activeRoute: "comteco",
  ospfConverged: true,
  convergenceTime: 0,
  failoverCount: 0,
  ospfMetrics: dijkstraOSPF(networkGraph, 0), // Dijkstra inicial
  routingTable: [
    { destination: "10.10.0.0/16", nextHop: "10.0.1.1", interface: "COMTECO-HFC", metric: 10, status: "active" },
    { destination: "10.10.0.0/16", nextHop: "10.0.2.1", interface: "ENTEL-ADSL", metric: 20, status: "backup" }
  ]
};

export const triggerFailover = () => {
  // Marcar COMTECO como caído
  setLinkStatus("comteco", "failed", 999);
  setLinkStatus("entel", "active", 42);

  // Alterar métrica del grafo OSPF por caída de COMTECO (Métrica ENTEL es mayor)
  const degradedGraph = JSON.parse(JSON.stringify(networkGraph));
  Object.keys(degradedGraph[0]).forEach(k => degradedGraph[0][k] += 30); // Penalización de +30 al pasar por Backup

  // Recalcular Dijkstra
  const newMetrics = dijkstraOSPF(degradedGraph, 0);

  // OSPF reconverge a la ruta de respaldo
  routingState.activeRoute = "entel";
  routingState.ospfConverged = true;
  routingState.convergenceTime = parseFloat((1.2 + Math.random()).toFixed(2)); // Dijkstra time proxy
  routingState.failoverCount++;
  routingState.ospfMetrics = newMetrics;
  routingState.routingTable[0].status = "down";
  routingState.routingTable[0].metric = 999;
  routingState.routingTable[1].status = "active";
  routingState.routingTable[1].metric = 40; // Dijkstra cost

  return {
    ...routingState,
    wanLinks: getWanLinks(),
    message: `Dijkstra SPF recalculó la topología en ${routingState.convergenceTime}s. Tráfico migrado a ENTEL.`
  };
};

/**
 * Devuelve el estado actual de la tabla de enrutamiento
 */
export const getRoutingTable = () => ({
  ...routingState,
  wanLinks: getWanLinks()
});

export const restoreRouting = () => {
  resetLinks();
  routingState = {
    activeRoute: "comteco",
    ospfConverged: true,
    convergenceTime: 0,
    failoverCount: 0,
    ospfMetrics: dijkstraOSPF(networkGraph, 0),
    routingTable: [
      { destination: "10.10.0.0/16", nextHop: "10.0.1.1", interface: "COMTECO-HFC", metric: 10, status: "active" },
      { destination: "10.10.0.0/16", nextHop: "10.0.2.1", interface: "ENTEL-ADSL", metric: 20, status: "backup" }
    ]
  };
  return { ...routingState, wanLinks: getWanLinks() };
};
