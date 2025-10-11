export function formatXML(xml: string): string {
  let formatted = '';
  let indent = '';
  const tab = '  ';
  
  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    formatted += indent + '<' + node + '>\r\n';
    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) {
      indent += tab;
    }
  });
  
  return formatted.substring(1, formatted.length - 3);
}

export function showLoading(show: boolean): void {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.style.display = show ? 'block' : 'none';
  }
}

export function escapeSelectorId(id: string): string {
  return id.replace(/[^\w-]/g, '\\$&');
}

export function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function calculateSVGSize(svgString: string): string {
  const bytes = new Blob([svgString]).size;
  const kb = bytes / 1024;
  return kb < 1 ? `${bytes} bytes` : `${kb.toFixed(2)} KB`;
}
