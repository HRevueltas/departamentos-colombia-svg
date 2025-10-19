import * as d3 from 'd3';
import type { MapRenderer } from './map-renderer';
import { STATE } from './config';
import { formatXML, calculateSVGSize } from './utils';

export class CodeViewer {
  private codeDisplay: HTMLElement;
  private jsonDisplay: HTMLElement | null;
  private jsonAllDisplay: HTMLElement | null;
  private mapRenderer: MapRenderer;

  constructor(codeDisplayId: string, mapRenderer: MapRenderer) {
    const element = document.getElementById(codeDisplayId);
    if (!element) throw new Error(`Element with id ${codeDisplayId} not found`);
    
    this.codeDisplay = element;
    this.jsonDisplay = document.getElementById('json-display');
    this.jsonAllDisplay = document.getElementById('json-all-display');
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

  updateJSONCode(): void {
    // No generar JSON automáticamente, solo limpiar el estado
    STATE.jsonGenerated.departamento = false;
    STATE.jsonGenerated.all = false;
    
    // Mostrar placeholder en los displays JSON
    if (this.jsonDisplay) {
      this.jsonDisplay.innerHTML = '<div class="code-placeholder"><i class="fa-solid fa-brackets-curly"></i><p>Selecciona esta opción en el selector para generar el JSON</p></div>';
    }
    
    if (this.jsonAllDisplay) {
      this.jsonAllDisplay.innerHTML = '<div class="code-placeholder"><i class="fa-solid fa-database"></i><p>Selecciona "Todos los departamentos" y luego esta opción para generar el JSON</p></div>';
    }
  }

  generateJSONOnDemand(type: 'departamento' | 'all', forceRegenerate: boolean = false): void {
    if (type === 'departamento' && (!STATE.jsonGenerated.departamento || forceRegenerate)) {
      this.showJSONLoading(this.jsonDisplay);
      
      // Usar setTimeout para permitir que se muestre el loading
      setTimeout(() => {
        const jsonString = this.mapRenderer.getMunicipiosJSON();
        this.renderJSON(jsonString, this.jsonDisplay);
        STATE.jsonGenerated.departamento = true;
        
        // Disparar evento personalizado para notificar que el JSON se generó
        window.dispatchEvent(new CustomEvent('jsonGenerated', { detail: { type: 'departamento' } }));
      }, 100);
    } else if (type === 'all' && (!STATE.jsonGenerated.all || forceRegenerate)) {
      this.showJSONLoading(this.jsonAllDisplay);
      
      // Usar setTimeout para permitir que se muestre el loading
      setTimeout(() => {
        this.updateAllDepartmentsJSON();
        STATE.jsonGenerated.all = true;
        
        // Disparar evento personalizado para notificar que el JSON se generó
        window.dispatchEvent(new CustomEvent('jsonGenerated', { detail: { type: 'all' } }));
      }, 100);
    }
  }

  private showJSONLoading(displayElement: HTMLElement | null): void {
    if (!displayElement) return;
    
    displayElement.innerHTML = `
      <div class="code-placeholder">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Generando JSON...</p>
      </div>
    `;
  }

  private updateAllDepartmentsJSON(): void {
    if (!STATE.allData.departamentos) return;
    
    const departamentosData: any[] = [];
    const departamentosMap = new Map<string, any>();
    
    // Primero, recopilar todos los departamentos únicos
    STATE.allData.departamentos.features.forEach((feature: any) => {
      const deptCode = feature.properties.DPTO_CCDGO;
      const deptNombre = feature.properties.DPTO_CNMBR;
      if (!departamentosMap.has(deptCode)) {
        departamentosMap.set(deptCode, { code: deptCode, nombre: deptNombre });
      }
    });
    
    // Para cada departamento, crear un SVG temporal para obtener los paths
    departamentosMap.forEach((deptInfo, deptCode) => {
      const features = STATE.allData.departamentos!.features.filter(
        (f: any) => f.properties.DPTO_CCDGO === deptCode
      );
      
      // Crear proyección y path temporal
      const tempProjection = d3.geoMercator();
      const tempPath = d3.geoPath().projection(tempProjection);
      
      const featureCollection = {
        type: 'FeatureCollection',
        features: features
      };
      
      tempProjection.fitSize([800, 600], featureCollection as any);
      
      const municipios: any[] = [];
      
      features.forEach((feature: any) => {
        const pathData = tempPath(feature as any) || '';
        
        municipios.push({
          id: feature.properties.MPIO_CCNCT || '',
          nombre: feature.properties.MPIO_CNMBR || '',
          d: pathData
        });
      });
      
      // Agregar departamento con su metadata y municipios
      departamentosData.push({
        metadata: {
          departamento: {
            id: deptCode,
            nombre: deptInfo.nombre
          },
          svg: {
            viewBox: '0 0 800 600'
          },
          styles: {
            fill: '#6f9c76',
            stroke: '#ffffff',
            strokeWidth: 0.5
          }
        },
        municipios
      });
    });
    
    const jsonAllString = JSON.stringify({ 
      totalDepartamentos: departamentosMap.size,
      departamentos: departamentosData 
    }, null, 2);
    
    this.renderJSON(jsonAllString, this.jsonAllDisplay);
  }

  private renderJSON(jsonString: string, displayElement: HTMLElement | null): void {
    if (!displayElement) return;
    
    displayElement.innerHTML = '';
    
    const lines = jsonString.split('\n');
    lines.forEach((line, index) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-line';
      
      const lineNumberSpan = document.createElement('span');
      lineNumberSpan.className = 'line-number';
      lineNumberSpan.textContent = String(index + 1);
      
      const lineContentSpan = document.createElement('span');
      lineContentSpan.className = 'line-content';
      lineContentSpan.textContent = line;
      
      lineDiv.appendChild(lineNumberSpan);
      lineDiv.appendChild(lineContentSpan);
      displayElement.appendChild(lineDiv);
    });
  }

  getCurrentJSONCode(): string {
    if (!this.jsonDisplay) return '';
    return Array.from(this.jsonDisplay.querySelectorAll('.line-content'))
      .map(el => el.textContent)
      .join('\n');
  }

  getCurrentAllJSONCode(): string {
    if (!this.jsonAllDisplay) return '';
    return Array.from(this.jsonAllDisplay.querySelectorAll('.line-content'))
      .map(el => el.textContent)
      .join('\n');
  }

  copyJSONToClipboard(): void {
    const jsonText = this.getCurrentJSONCode();

    navigator.clipboard.writeText(jsonText).then(() => {
      const copyBtn = document.getElementById('btn-copiar-json');
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
        }, 2000);
      }
    });
  }

  copyAllJSONToClipboard(): void {
    const jsonText = this.getCurrentAllJSONCode();

    navigator.clipboard.writeText(jsonText).then(() => {
      const copyBtn = document.getElementById('btn-copiar-json-all');
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar';
        }, 2000);
      }
    });
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

    // Limpiar JSON displays
    if (this.jsonDisplay) {
      this.jsonDisplay.innerHTML = '<div class="code-placeholder"><i class="fa-solid fa-brackets-curly"></i><p>Selecciona un departamento para ver los datos JSON</p></div>';
    }
    
    if (this.jsonAllDisplay) {
      this.jsonAllDisplay.innerHTML = '<div class="code-placeholder"><i class="fa-solid fa-database"></i><p>Selecciona "Todos los departamentos" para ver los datos JSON completos</p></div>';
    }
  }
}

