import type { MapRenderer } from './map-renderer';
import { STATE } from './config';
import { formatXML, calculateSVGSize } from './utils';

export class CodeViewer {
  private codeDisplay: HTMLElement;
  private mapRenderer: MapRenderer;

  constructor(codeDisplayId: string, mapRenderer: MapRenderer) {
    const element = document.getElementById(codeDisplayId);
    if (!element) throw new Error(`Element with id ${codeDisplayId} not found`);
    
    this.codeDisplay = element;
    this.mapRenderer = mapRenderer;
  }

  updateSVGCode(): void {
    const svgElement = this.mapRenderer.getSVGElement();
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    
    if (STATE.displayOption === 'map') {
      clonedSvg.querySelectorAll('.etiquetas, .puntos').forEach(el => el.remove());
    } else if (STATE.displayOption === 'map+labels') {
      clonedSvg.querySelectorAll('.puntos').forEach(el => el.remove());
    } else if (STATE.displayOption === 'map+points') {
      clonedSvg.querySelectorAll('.etiquetas').forEach(el => el.remove());
      clonedSvg.querySelectorAll('.punto').forEach(el => {
        (el as SVGElement).style.opacity = '0';
      });
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    
    this.renderCode(svgString);
    this.updateSizeInfo(svgString);
  }

  private renderCode(svgString: string): void {
    const formatted = formatXML(svgString);

    this.codeDisplay.innerHTML = '';

    const lines = formatted.split('\n');
    lines.forEach((line, index) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-line';
      
      const lineNumberSpan = document.createElement('span');
      lineNumberSpan.className = 'line-number';
      lineNumberSpan.textContent = String(index + 1);
      
      const lineContentSpan = document.createElement('span');
      lineContentSpan.className = 'line-content';
      lineContentSpan.textContent = line;
      
      const classMatch = line.match(/class="(municipio|etiqueta|punto)"/);
      const idMatch = line.match(/data-element-id="([^"]+)"/);
      
      if (classMatch && idMatch) {
        lineDiv.classList.add('code-hoverable');
        lineDiv.dataset.elementType = classMatch[1];
        lineDiv.dataset.elementId = idMatch[1];
      }
      
      lineDiv.appendChild(lineNumberSpan);
      lineDiv.appendChild(lineContentSpan);
      this.codeDisplay.appendChild(lineDiv);
    });

    this.setupCodeHoverEvents();
  }

  private setupCodeHoverEvents(): void {
    const hoverableLines = this.codeDisplay.querySelectorAll('.code-hoverable');
    
    hoverableLines.forEach(line => {
      line.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget as HTMLElement;
        const elementId = target.dataset.elementId;
        
        if (elementId) {
          this.highlightSVGElement(elementId);
        }
      });

      line.addEventListener('mouseleave', (e) => {
        const target = e.currentTarget as HTMLElement;
        const elementId = target.dataset.elementId;
        
        if (elementId) {
          this.unhighlightSVGElement(elementId);
        }
      });
    });
  }

  private highlightSVGElement(elementId: string): void {
    const svgElement = this.mapRenderer.getSVGElement();
    const element = svgElement.querySelector(`[data-element-id="${elementId}"]`);
    
    if (element) {
      const svgEl = element as SVGElement;
      const isText = element.tagName === 'text';
      
      if (isText) {
        svgEl.style.fill = '#ff9800';
        svgEl.style.fontWeight = 'bold';
        svgEl.style.fontSize = '12px';
      } else {
        svgEl.style.stroke = '#ff9800';
        svgEl.style.strokeWidth = '2';
        if (element.tagName === 'path') {
          svgEl.style.fill = '#ffa726';
        }
        svgEl.style.opacity = '1';
      }
    }
  }

  private unhighlightSVGElement(elementId: string): void {
    const svgElement = this.mapRenderer.getSVGElement();
    const element = svgElement.querySelector(`[data-element-id="${elementId}"]`);
    
    if (element) {
      const svgEl = element as SVGElement;
      const isText = element.tagName === 'text';
      const isMunicipio = svgEl.classList.contains('municipio');
      const isPunto = svgEl.classList.contains('punto');
      
      if (isText) {
        svgEl.style.fill = '#333';
        svgEl.style.fontWeight = 'bold';
        svgEl.style.fontSize = '10px';
      } else {
        svgEl.style.stroke = '#ffffff';
        svgEl.style.strokeWidth = isMunicipio ? '0.5' : '1';
        if (isMunicipio) {
          svgEl.style.fill = '#6f9c76';
        } else if (isPunto) {
          svgEl.style.fill = '#d32f2f';
        }
        svgEl.style.opacity = '';
      }
    }
  }

  copyCodeToClipboard(): void {
    const codeText = Array.from(this.codeDisplay.querySelectorAll('.line-content'))
      .map(el => el.textContent)
      .join('\n');

    navigator.clipboard.writeText(codeText).then(() => {
      const copyBtn = document.querySelector('.copy-code-btn');
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
        }, 2000);
      }
    });
  }

  getCurrentSVGCode(): string {
    return Array.from(this.codeDisplay.querySelectorAll('.line-content'))
      .map(el => el.textContent)
      .join('\n');
  }

  private updateSizeInfo(svgString: string): void {
    const sizeDisplay = document.querySelector('.svg-size-info');
    
    if (sizeDisplay) {
      const sizeText = calculateSVGSize(svgString);
      sizeDisplay.innerHTML = `<span class="size-value">${sizeText}</span>`;
    }
  }

  clearCode(): void {
    this.codeDisplay.innerHTML = '<div class="code-placeholder"><i class="fa-solid fa-code"></i><p>Selecciona un departamento para ver el código SVG</p></div>';
    
    const sizeDisplay = document.querySelector('.svg-size-info');
    if (sizeDisplay) {
      sizeDisplay.innerHTML = `
        <span class="size-placeholder">
          <i class="fa-solid fa-circle-info"></i>
          Sin selección
        </span>
      `;
    }
  }
}

