const COLORS = ["#0E3B43", "#357266", "#65532F", "#312509", "#4A6741", "#7B3F2D"];

function pickColor(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function generateAvatarSvg(userId) {
  const bg = pickColor(userId);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${bg}"/>
  <rect x="44" y="18" width="12" height="64" fill="#F5F1E3" rx="3"/>
  <rect x="24" y="36" width="52" height="12" fill="#F5F1E3" rx="3"/>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

module.exports = { generateAvatarSvg };
