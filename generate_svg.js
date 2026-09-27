const fs = require('fs');

const numNodes = 70;
const nodes = [];

for (let i = 0; i < numNodes; i++) {
  let x = 0, y = 0;
  do {
    x = 45 + Math.random() * 70;
    y = 5 + Math.random() * 45;
  } while (Math.pow(x - 80, 2) / Math.pow(30, 2) + Math.pow(y - 28, 2) / Math.pow(22, 2) > 1);
  nodes.push({ id: i, x, y, size: Math.random() * 1.2 + 0.4 });
}

const connections = [];
for (let i = 0; i < numNodes; i++) {
  for (let j = i + 1; j < numNodes; j++) {
    const dx = nodes[i].x - nodes[j].x;
    const dy = nodes[i].y - nodes[j].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 18) {
      connections.push({
        from: nodes[i],
        to: nodes[j],
        delay: Math.random() * 4,
        duration: Math.random() * 1 + 0.5
      });
    }
  }
}

let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="800" height="500">\n' +
'<defs>\n' +
'  <style>\n' +
'    @keyframes pulse {\n' +
'      0%, 100% { opacity: 0.2; transform: scale(1); }\n' +
'      50% { opacity: 0.9; transform: scale(1.4); }\n' +
'    }\n' +
'    @keyframes flicker {\n' +
'      0% { opacity: 0; stroke-dashoffset: 20; }\n' +
'      50% { opacity: 1; stroke-dashoffset: 0; }\n' +
'      100% { opacity: 0; stroke-dashoffset: -20; }\n' +
'    }\n' +
'    .node { animation: pulse 3s infinite ease-in-out; transform-box: fill-box; transform-origin: center; }\n' +
'    .synapse { stroke-dasharray: 20; animation: flicker 2s infinite ease-out; }\n' +
'  </style>\n' +
'  <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">\n' +
'    <stop offset="0%" stop-color="rgba(255,109,56,0.1)"/>\n' +
'    <stop offset="100%" stop-color="transparent"/>\n' +
'  </radialGradient>\n' +
'  <filter id="glow">\n' +
'    <feGaussianBlur stdDeviation="2" result="blur"/>\n' +
'    <feMerge>\n' +
'      <feMergeNode in="blur"/>\n' +
'      <feMergeNode in="SourceGraphic"/>\n' +
'    </feMerge>\n' +
'  </filter>\n' +
'</defs>\n' +
'<rect width="100%" height="100%" fill="#080504"/>\n' +
'<rect width="100%" height="100%" fill="url(#bgGlow)"/>\n' +
'<g opacity="0.6">\n' +
'  <path d="M 45 35 C 45 -5, 115 -5, 115 35 C 115 55, 105 60, 100 65 L 100 85 C 100 88, 95 92, 80 92 C 65 92, 60 88, 60 85 L 60 65 C 55 60, 45 55, 45 35 Z" stroke="#ff6d38" stroke-width="2" opacity="0.3" filter="url(#glow)" fill="none" />\n' +
'  <path d="M 45 35 C 45 -5, 115 -5, 115 35 C 115 55, 105 60, 100 65 L 100 85 C 100 88, 95 92, 80 92 C 65 92, 60 88, 60 85 L 60 65 C 55 60, 45 55, 45 35 Z" stroke="#ffcca8" stroke-width="0.5" fill="rgba(255,109,56,0.02)" />\n' +
'  <ellipse cx="62" cy="45" rx="8" ry="10" fill="#080504" stroke="#ff6d38" stroke-width="0.5">\n' +
'    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />\n' +
'  </ellipse>\n' +
'  <ellipse cx="98" cy="45" rx="8" ry="10" fill="#080504" stroke="#ff6d38" stroke-width="0.5">\n' +
'    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" begin="1s" repeatCount="indefinite" />\n' +
'  </ellipse>\n' +
'  <path d="M 80 58 L 76 68 L 84 68 Z" fill="#080504" stroke="#ff6d38" stroke-width="0.5" opacity="0.7" />\n' +
'  <line x1="68" y1="78" x2="92" y2="78" stroke="#ff6d38" stroke-width="0.5" opacity="0.6" />\n' +
'  <line x1="72" y1="72" x2="72" y2="85" stroke="#ff6d38" stroke-width="0.5" opacity="0.6" />\n' +
'  <line x1="77" y1="72" x2="77" y2="87" stroke="#ff6d38" stroke-width="0.5" opacity="0.6" />\n' +
'  <line x1="83" y1="72" x2="83" y2="87" stroke="#ff6d38" stroke-width="0.5" opacity="0.6" />\n' +
'  <line x1="88" y1="72" x2="88" y2="85" stroke="#ff6d38" stroke-width="0.5" opacity="0.6" />\n' +
'</g>\n';

connections.forEach((conn) => {
  svg += '\n<line x1="' + conn.from.x + '" y1="' + conn.from.y + '" x2="' + conn.to.x + '" y2="' + conn.to.y + '" stroke="rgba(255,109,56,0.15)" stroke-width="0.2" />';
});

connections.filter((_, i) => i % 3 === 0).forEach((conn, i) => {
  svg += '\n<line x1="' + conn.from.x + '" y1="' + conn.from.y + '" x2="' + conn.to.x + '" y2="' + conn.to.y + '" stroke="#ffcca8" stroke-width="0.4" class="synapse" style="animation-duration: ' + conn.duration + 's; animation-delay: ' + conn.delay + 's" />';
});

nodes.forEach((node, i) => {
  const dur = Math.random() * 2 + 1.5;
  const del = Math.random() * 3;
  svg += '\n<circle cx="' + node.x + '" cy="' + node.y + '" r="' + node.size + '" fill="#ff6d38" class="node" style="animation-duration: ' + dur + 's; animation-delay: ' + del + 's" />';
  svg += '\n<circle cx="' + node.x + '" cy="' + node.y + '" r="' + (node.size * 0.3) + '" fill="#fff" opacity="0.9" />';
});

svg += '\n</svg>';

fs.writeFileSync('brainstorm-skull.svg', svg);
console.log('SVG generated successfully!');
