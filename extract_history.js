const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\stuwa\\.gemini\\antigravity\\brain\\bcbdea37-84d3-4ba3-9a97-abcfd347ecd7\\.system_generated\\logs\\transcript.jsonl';
const outputPath = 'c:\\Users\\stuwa\\OneDrive\\Documentos\\Desktop\\PROYECTO FINAL\\HISTORIAL_CONVERSACION.md';

if (!fs.existsSync(logPath)) {
  console.error('No se encontró el archivo de logs en:', logPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.trim().split('\n');

let md = '# HISTORIAL DE CONVERSACIÓN COMPLETO (SMAT-SR)\n\nEste documento recopila de forma íntegra y transparente todas las preguntas que enviaste y las respuestas completas que te proporcioné, desde el primer mensaje hasta el estado actual del proyecto.\n\n---\n\n';

let messageIndex = 1;

for (const line of lines) {
  if (!line) continue;
  try {
    const data = JSON.parse(line);
    
    // 1. Mensaje del usuario
    if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
      let content = data.content || '';
      
      // Limpiar metadatos del sistema si existen
      if (content.includes('<USER_REQUEST>')) {
        content = content.split('<USER_REQUEST>')[1].split('</USER_REQUEST>')[0];
      }
      content = content.trim();
      
      if (content) {
        md += `## 💬 **MENSAJE ${messageIndex} - USUARIO**\n\n\`\`\`text\n${content}\n\`\`\`\n\n`;
      }
    }
    
    // 2. Respuesta del Asistente
    if (data.source === 'MODEL' && data.type === 'PLANNER_RESPONSE' && data.content) {
      let content = data.content.trim();
      
      // Ignorar contenido que solo sea de pensamiento interno
      if (content && !content.startsWith('thinking:')) {
        md += `### 🤖 **RESPUESTA ${messageIndex} - ASISTENTE**\n\n${content}\n\n---\n\n`;
        messageIndex++;
      }
    }
  } catch (e) {
    // Ignorar líneas con errores de análisis JSON
  }
}

fs.writeFileSync(outputPath, md, 'utf8');
console.log('Historial completo exportado exitosamente a:', outputPath);
