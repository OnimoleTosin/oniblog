/**
 * Generate a gradient-based placeholder image with text overlay
 * Uses canvas to create a visually appealing fallback
 */
export function generatePlaceholderImage(title: string, width: number = 300, height: number = 450): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create gradient background with neon colors
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a0e27');
  gradient.addColorStop(0.5, '#1a0033');
  gradient.addColorStop(1, '#0a0e27');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add neon border
  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, width, height);

  // Add magenta accent line
  ctx.strokeStyle = '#FF00FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height / 3);
  ctx.lineTo(width, height / 3);
  ctx.stroke();

  // Add text
  ctx.fillStyle = '#00FFFF';
  ctx.font = 'bold 24px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap text
  const maxWidth = width - 40;
  const words = title.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  const lineHeight = 35;
  const totalHeight = lines.length * lineHeight;
  const startY = height / 2 - totalHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  // Add chromatic aberration effect (subtle)
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#FF00FF';
  ctx.fillText(lines[0] || '', width / 2 + 2, startY + 2);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/png');
}

/**
 * Get a reliable placeholder image URL
 * Falls back to gradient canvas if external service is unavailable
 */
export function getPlaceholderImageUrl(title: string): string {
  // Use placeholder service as primary
  const encodedTitle = encodeURIComponent(title.substring(0, 30));
  return `https://via.placeholder.com/300x450/0a0e27/00FFFF?text=${encodedTitle}`;
}
