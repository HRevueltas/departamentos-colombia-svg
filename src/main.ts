import './style.css';
import { MapRenderer } from './map-renderer';
import { SVGExporter } from './svg-exporter';
import { CodeViewer } from './code-viewer';
import { CONFIG, STATE } from './config';
import { showLoading, showNotification, calculateSVGSize } from './utils';
import type { GeoJSONCollection, DisplayOption } from './types';

class App {
  private mapRenderer!: MapRenderer;
  private svgExporter!: SVGExporter;
  private codeViewer!: CodeViewer;

  async init(): Promise<void> {
    this.setupUI();
    await this.loadData();
    this.setupEventListeners();
    this.loadFromURL(); // Cargar departamento desde URL
  }

  private setupUI(): void {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="container">
        <header role="banner">
          <div class="header-content">
            <h1><i class="fa-solid fa-map-location-dot"></i> Departamentos de Colombia</h1>
            <p>Departamentos de Colombia en SVG vectoriales</p>
          </div>
        </header>

        <main role="main">          
          <div class="controls" id="controls">
            <div class="controls-grid">
              <!-- Selector de Departamento y Acciones -->
              <div class="control-section">
                <div class="control-group">
                  <label for="departamento" class="control-label">
                    <span class="label-icon"><i class="fa-solid fa-map-location-dot"></i></span>
                    <span>Departamento</span>
                    <span class="label-info" aria-label="Más información"><i class="fa-solid fa-circle-info"></i></span>
                    <span id="departamento-help" class="help-text" role="tooltip">
                      Selecciona un departamento para visualizar y descargar su mapa
                    </span>
                  </label>
                  <div class="select-wrapper">
                    <select 
                      id="departamento" 
                      aria-label="Seleccionar departamento"
                      aria-describedby="departamento-help"
                    >
                      <option value="">Selecciona un departamento</option>
                      <option value="ALL"><i class="fa-solid fa-box-archive"></i> Todos los departamentos (ZIP)</option>
                      ${CONFIG.departmentCodes.map(dept => 
                        `<option value="${dept.code}">${dept.name}</option>`
                      ).join('')}
                    </select>
                    <span class="select-arrow" aria-hidden="true">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Acciones debajo del selector -->
                <div class="control-actions">
                  <div class="button-group">
                    <button 
                      id="btn-descargar" 
                      class="btn btn-primary"
                      disabled 
                      aria-label="Descargar SVG del departamento seleccionado"
                      data-tooltip="Descarga el archivo SVG del departamento seleccionado"
                    >
                      <span class="btn-icon"><i class="fa-solid fa-download"></i></span>
                      <span class="btn-text">Descargar SVG</span>
                    </button>
                    <button 
                      id="btn-copiar" 
                      class="btn btn-secondary"
                      disabled
                      aria-label="Copiar código SVG al portapapeles"
                      data-tooltip="Copia el código SVG al portapapeles"
                    >
                      <span class="btn-icon"><i class="fa-solid fa-copy"></i></span>
                      <span class="btn-text">Copiar SVG</span>
                    </button>
                    <button 
                      id="btn-descargar-todos" 
                      class="btn btn-accent"
                      style="display: none;"
                      aria-label="Descargar archivo ZIP con todos los 32 departamentos"
                      data-tooltip="Descarga un ZIP con los 32 departamentos"
                    >
                      <span class="btn-icon"><i class="fa-solid fa-file-zipper"></i></span>
                      <span class="btn-text">Descargar ZIP</span>
                      <span class="btn-badge">32 dptos y el distrito capital</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Opciones de Visualización -->
              <div class="control-section">
                <div class="control-group">
                  <label id="display-options-label" class="control-label">
                    <span class="label-icon"><i class="fa-solid fa-eye"></i></span>
                    <span>Visualización</span>
                  </label>
                  <div class="radio-group" role="radiogroup" aria-labelledby="display-options-label">
                    <label class="radio-card">
                      <input 
                        type="radio" 
                        name="displayOption" 
                        value="map" 
                        checked
                        aria-label="Mostrar solo el mapa sin etiquetas"
                      >
                      <span class="radio-content">
                        <span class="radio-icon">🗾</span>
                        <span class="radio-text">
                          <strong>Solo mapa</strong>
                          <small>Sin etiquetas</small>
                        </span>
                      </span>
                    </label>
                    <label class="radio-card">
                      <input 
                        type="radio" 
                        name="displayOption" 
                        value="map+labels"
                        aria-label="Mostrar mapa con nombres de municipios"
                      >
                      <span class="radio-content">
                        <span class="radio-icon">🏷️</span>
                        <span class="radio-text">
                          <strong>Con etiquetas</strong>
                          <small>Nombres de municipios</small>
                        </span>
                      </span>
                    </label>
                    <label class="radio-card">
                      <input 
                        type="radio" 
                        name="displayOption" 
                        value="map+points"
                        aria-label="Mostrar mapa con puntos de referencia"
                      >
                      <span class="radio-content">
                        <span class="radio-icon">📍</span>
                        <span class="radio-text">
                          <strong>Con puntos</strong>
                          <small>Puntos de referencia</small>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="loading" style="display: none;" role="status" aria-live="polite">
            <p>Cargando datos...</p>
          </div>

          <div class="content-wrapper">
            <div class="map-section" role="region" aria-label="Visualización del mapa">
              <div class="map-controls">
                <button 
                  id="zoom-in" 
                  class="map-control-btn" 
                  title="Acercar zoom"
                  aria-label="Acercar zoom"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
                <button 
                  id="zoom-out" 
                  class="map-control-btn" 
                  title="Alejar zoom"
                  aria-label="Alejar zoom"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <button 
                  id="zoom-reset" 
                  class="map-control-btn" 
                  title="Restablecer vista"
                  aria-label="Restablecer vista"
                >
                  <i class="fa-solid fa-maximize"></i>
                </button>
              </div>
              <div id="mapa-container" aria-live="polite">
                <div class="map-placeholder">
                  <i class="fa-solid fa-map"></i>
                  <p>Selecciona un departamento para visualizar el mapa</p>
                </div>
              </div>
            </div>
            
            <div class="code-section" role="region" aria-label="Código fuente SVG">
              <div class="code-header">
                <div class="code-header-left">
                  <div class="code-type-selector">
                    <select id="code-type-select" aria-label="Tipo de código">
                      <option value="svg">Código SVG</option>
                      <option value="json">JSON Municipios</option>
                      <option value="json-all" style="display: none;">JSON Departamentos</option>
                    </select>
                  </div>
                  <span class="svg-size-info" role="status" aria-live="polite">
                    <span class="size-placeholder">
                      <i class="fa-solid fa-circle-info"></i>
                      Sin selección
                    </span>
                  </span>
                </div>
                <div class="code-header-actions">
                  <button 
                    id="btn-descargar-code" 
                    class="download-code-btn" 
                    title="Descargar archivo"
                    aria-label="Descargar archivo"
                    disabled
                  >
                    <i class="fa-solid fa-download"></i> Descargar
                  </button>
                  <button 
                    class="copy-code-btn" 
                    title="Copiar código al portapapeles"
                    aria-label="Copiar código al portapapeles"
                  >
                    <i class="fa-solid fa-copy"></i> Copiar
                  </button>
                </div>
              </div>
              <div 
                id="code-display" 
                class="code-display" 
                role="code"
                aria-label="Código formateado"
                tabindex="0"
              >
                <div class="code-placeholder">
                  <i class="fa-solid fa-code"></i>
                  <p>Selecciona un departamento para ver el código SVG</p>
                </div>
              </div>
              <div 
                id="json-display" 
                class="code-display" 
                role="code"
                aria-label="JSON formateado"
                tabindex="0"
                style="display: none;"
              >
                <div class="code-placeholder">
                  <i class="fa-solid fa-brackets-curly"></i>
                  <p>Selecciona un departamento para ver los datos JSON</p>
                </div>
              </div>
              <div 
                id="json-all-display" 
                class="code-display" 
                role="code"
                aria-label="JSON formateado de todos los departamentos"
                tabindex="0"
                style="display: none;"
              >
                <div class="code-placeholder">
                  <i class="fa-solid fa-database"></i>
                  <p>Selecciona 'Todos los departamentos' para ver los datos JSON completos</p>
                </div>
              </div>
            </div>
          </div>

        </main>

        <footer role="contentinfo">
          <p>💡 Los mapas se generan en formato SVG vectorial escalable</p>
          <p class="data-source">
            Datos: <a href="https://geoportal.dane.gov.co/" target="_blank" rel="noopener">DANE Colombia 2018</a> • 
            Procesado por <a href="https://github.com/caticoa3/colombia_mapa" target="_blank" rel="noopener">caticoa3/colombia_mapa</a>
          </p>
          <p class="developer-credit">
            Desarrollado por <a href="https://github.com/Hrevueltas" target="_blank" rel="noopener">Hrevueltas</a>
          </p>
        </footer>
      </div>
    `;

    this.mapRenderer = new MapRenderer('mapa-container');
    this.svgExporter = new SVGExporter();
    this.codeViewer = new CodeViewer('code-display', this.mapRenderer);
  }

  private async loadData(): Promise<void> {
    showLoading(true);

    try {
      const data = await fetch(CONFIG.dataUrl).then(res => res.json());
      
      STATE.allData.departamentos = data as GeoJSONCollection;
      STATE.allData.municipios = data as GeoJSONCollection;

      showNotification('Datos cargados exitosamente');
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error al cargar los datos', 'error');
    } finally {
      showLoading(false);
    }
  }

  private setupEventListeners(): void {
    const deptSelect = document.getElementById('departamento') as HTMLSelectElement;
    deptSelect.addEventListener('change', () => {
      this.handleDepartmentChange(deptSelect.value);
      this.updateURL(deptSelect.value); // Actualizar URL cuando cambia selección
    });

    // Escuchar cambios en la URL (botón atrás/adelante del navegador)
    window.addEventListener('hashchange', () => this.loadFromURL());

    document.querySelectorAll('input[name="displayOption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const option = (e.target as HTMLInputElement).value as DisplayOption;
        this.mapRenderer.updateDisplayOption(option);
        this.codeViewer.updateSVGCode();
        this.codeViewer.updateJSONCode();
      });
    });

    document.getElementById('btn-copiar')?.addEventListener('click', () => {
      const svgElement = this.mapRenderer.getSVGElement();
      if (svgElement) {
        const svgContent = this.svgExporter.prepareSVGForExport(
          svgElement,
          STATE.displayOption === 'map+labels',
          STATE.displayOption === 'map+points'
        );
        navigator.clipboard.writeText(svgContent).then(() => {
          showNotification('SVG copiado al portapapeles');
        });
      }
    });

    document.getElementById('btn-descargar-todos')?.addEventListener('click', () => {
      this.svgExporter.downloadAllDepartments();
    });

    document.getElementById('btn-descargar')?.addEventListener('click', () => {
      const deptSelect = document.getElementById('departamento') as HTMLSelectElement;
      const selectedDept = deptSelect.value;
      const deptName = CONFIG.departmentCodes.find(d => d.code === selectedDept)?.name || '';
      const currentSVGCode = this.codeViewer.getCurrentSVGCode();
      this.svgExporter.downloadCurrentSVG(currentSVGCode, deptName);
    });
    
    // Event listener para el selector de tipo de código
    document.getElementById('code-type-select')?.addEventListener('change', (e) => {
      const selectedType = (e.target as HTMLSelectElement).value;
      
      // Generar JSON bajo demanda
      if (selectedType === 'json') {
        this.codeViewer.generateJSONOnDemand('departamento');
      } else if (selectedType === 'json-all') {
        this.codeViewer.generateJSONOnDemand('all');
      }
      
      this.switchCodeDisplay(selectedType);
    });

    // Event listeners para copiar y descargar (ahora manejan SVG o JSON según la selección)
    document.querySelector('.copy-code-btn')?.addEventListener('click', () => {
      const codeType = (document.getElementById('code-type-select') as HTMLSelectElement)?.value;
      if (codeType === 'svg') {
        this.codeViewer.copyCodeToClipboard();
      } else if (codeType === 'json') {
        this.codeViewer.copyJSONToClipboard();
      } else if (codeType === 'json-all') {
        this.codeViewer.copyAllJSONToClipboard();
      }
    });

    document.getElementById('btn-descargar-code')?.addEventListener('click', () => {
      const deptSelect = document.getElementById('departamento') as HTMLSelectElement;
      const selectedDept = deptSelect.value;
      const deptName = CONFIG.departmentCodes.find(d => d.code === selectedDept)?.name || '';
      const codeType = (document.getElementById('code-type-select') as HTMLSelectElement)?.value;
      
      if (codeType === 'svg') {
        const currentSVGCode = this.codeViewer.getCurrentSVGCode();
        this.svgExporter.downloadCurrentSVG(currentSVGCode, deptName);
      } else if (codeType === 'json') {
        const jsonCode = this.codeViewer.getCurrentJSONCode();
        this.downloadJSON(jsonCode, `${deptName}-municipios.json`);
      } else if (codeType === 'json-all') {
        const jsonCode = this.codeViewer.getCurrentAllJSONCode();
        this.downloadJSON(jsonCode, 'colombia-todos-municipios.json');
      }
    });
    
    document.getElementById('zoom-in')?.addEventListener('click', () => {
      this.mapRenderer.zoomIn();
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
      this.mapRenderer.zoomOut();
    });
    
    document.getElementById('zoom-reset')?.addEventListener('click', () => {
      this.mapRenderer.resetZoom();
    });
    
    // Escuchar cuando se genera JSON para actualizar la UI
    window.addEventListener('jsonGenerated', (e: Event) => {
      const customEvent = e as CustomEvent;
      const codeTypeSelect = document.getElementById('code-type-select') as HTMLSelectElement;
      if (codeTypeSelect) {
        this.updateSizeInfoForCurrentDisplay(codeTypeSelect.value);
      }
    });
  }

  private handleDepartmentChange(value: string): void {
    const mapPlaceholder = document.querySelector('#mapa-container .map-placeholder') as HTMLElement;
    
    if (!value) {
      this.disableButtons();
      this.codeViewer.clearCode();
      this.mapRenderer.clearMap();
      this.hideJsonAllOption();
      if (mapPlaceholder) {
        mapPlaceholder.style.display = 'flex';
        mapPlaceholder.innerHTML = `
          <i class="fa-solid fa-map"></i>
          <p>Selecciona un departamento para visualizar el mapa</p>
        `;
      }
      return;
    }

    if (value === 'ALL') {
      STATE.isAllDepartments = true;
      this.showDownloadAllButton();
      this.showJsonAllOption();
      this.codeViewer.clearCode();
      this.codeViewer.updateJSONCode();
      this.mapRenderer.clearMap();
      
      // Si el usuario tiene seleccionado JSON All, generar el JSON de todos
      const codeTypeSelect = document.getElementById('code-type-select') as HTMLSelectElement;
      if (codeTypeSelect && codeTypeSelect.value === 'json-all') {
        this.codeViewer.generateJSONOnDemand('all');
      }
      
      if (mapPlaceholder) {
        mapPlaceholder.style.display = 'flex';
        mapPlaceholder.innerHTML = `
          <i class="fa-solid fa-layer-group"></i>
          <p>Opción "Todos los departamentos" seleccionada</p>
          <p class="placeholder-hint">Usa el botón "Descargar Todos (ZIP)" para obtener todos los mapas, o selecciona "JSON Todos los Departamentos" en el selector de código</p>
        `;
      }
      return;
    }

    if (mapPlaceholder) {
      mapPlaceholder.style.display = 'none';
    }

    STATE.isAllDepartments = false;
    this.hideDownloadAllButton();
    this.hideJsonAllOption();

    if (!STATE.allData.departamentos) return;

    const features = STATE.allData.departamentos.features.filter(
      (f: any) => f.properties.DPTO_CCDGO === value
    );

    this.mapRenderer.renderMapa(features);
    this.mapRenderer.renderMunicipios(value);

    if (STATE.displayOption === 'map+labels') {
      this.mapRenderer.renderEtiquetas(features);
    } else if (STATE.displayOption === 'map+points') {
      this.mapRenderer.renderPuntos(features);
    }

    this.codeViewer.updateSVGCode();
    this.codeViewer.updateJSONCode();
    this.enableButtons();
    
    // Si el usuario tiene seleccionado JSON, generar el JSON del nuevo departamento
    const codeTypeSelect = document.getElementById('code-type-select') as HTMLSelectElement;
    if (codeTypeSelect && codeTypeSelect.value === 'json') {
      // Forzar regeneración cuando cambiamos de departamento y estamos en vista JSON
      this.codeViewer.generateJSONOnDemand('departamento', true);
    } else if (codeTypeSelect && codeTypeSelect.value === 'json-all') {
      // Forzar regeneración del JSON completo si estamos en esa vista
      this.codeViewer.generateJSONOnDemand('all', true);
    }
  }

  private enableButtons(): void {
    (document.getElementById('btn-descargar') as HTMLButtonElement).disabled = false;
    (document.getElementById('btn-copiar') as HTMLButtonElement).disabled = false;
    (document.getElementById('btn-descargar-code') as HTMLButtonElement).disabled = false;
    (document.getElementById('btn-descargar-json') as HTMLButtonElement | null)!.disabled = false;
    (document.getElementById('btn-descargar-json-all') as HTMLButtonElement | null)!.disabled = false;
  }

  private disableButtons(): void {
    (document.getElementById('btn-descargar') as HTMLButtonElement).disabled = true;
    (document.getElementById('btn-copiar') as HTMLButtonElement).disabled = true;
    (document.getElementById('btn-descargar-code') as HTMLButtonElement).disabled = true;
    (document.getElementById('btn-descargar-json') as HTMLButtonElement | null)!.disabled = true;
    (document.getElementById('btn-descargar-json-all') as HTMLButtonElement | null)!.disabled = true;
  }

  private showDownloadAllButton(): void {
    document.getElementById('btn-descargar')!.style.display = 'none';
    document.getElementById('btn-copiar')!.style.display = 'none';
    document.getElementById('btn-descargar-todos')!.style.display = 'inline-block';
  }

  private hideDownloadAllButton(): void {
    document.getElementById('btn-descargar')!.style.display = 'inline-block';
    document.getElementById('btn-copiar')!.style.display = 'inline-block';
    document.getElementById('btn-descargar-todos')!.style.display = 'none';
  }

  private showJsonAllOption(): void {
    const jsonAllOption = document.querySelector('#code-type-select option[value="json-all"]') as HTMLOptionElement;
    if (jsonAllOption) {
      jsonAllOption.style.display = 'block';
    }
  }

  private hideJsonAllOption(): void {
    const jsonAllOption = document.querySelector('#code-type-select option[value="json-all"]') as HTMLOptionElement;
    const codeTypeSelect = document.getElementById('code-type-select') as HTMLSelectElement;
    
    if (jsonAllOption) {
      jsonAllOption.style.display = 'none';
    }
    
    // Si estaba seleccionada, volver a SVG
    if (codeTypeSelect && codeTypeSelect.value === 'json-all') {
      codeTypeSelect.value = 'svg';
      this.switchCodeDisplay('svg');
    }
  }

  private updateURL(departmentCode: string): void {
    if (!departmentCode || departmentCode === 'ALL') {
      // Limpiar hash si no hay departamento o es "todos"
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
      return;
    }

    const dept = CONFIG.departmentCodes.find(d => d.code === departmentCode);
    if (dept) {
      const slug = this.createSlug(dept.name);
      history.pushState(null, '', `#${slug}`);
    }
  }

  private loadFromURL(): void {
    const hash = window.location.hash.slice(1); // Remover el #
    if (!hash) return;

    // Buscar departamento por slug
    const dept = CONFIG.departmentCodes.find(d => 
      this.createSlug(d.name) === hash
    );

    if (dept) {
      const select = document.getElementById('departamento') as HTMLSelectElement;
      select.value = dept.code;
      this.handleDepartmentChange(dept.code);
    }
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD') // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/[^a-z0-9-]/g, '') // Solo letras, números y guiones
      .replace(/-+/g, '-'); // Múltiples guiones a uno solo
  }

  private downloadJSON(jsonContent: string, filename: string): void {
    if (!jsonContent) {
      showNotification('Error: No hay datos JSON para descargar', 'error');
      return;
    }

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('JSON descargado exitosamente');
  }

  private switchCodeDisplay(codeType: string): void {
    const codeDisplay = document.getElementById('code-display');
    const jsonDisplay = document.getElementById('json-display');
    const jsonAllDisplay = document.getElementById('json-all-display');

    // Ocultar todos los displays
    if (codeDisplay) codeDisplay.style.display = 'none';
    if (jsonDisplay) jsonDisplay.style.display = 'none';
    if (jsonAllDisplay) jsonAllDisplay.style.display = 'none';

    // Mostrar el display correspondiente
    if (codeType === 'svg') {
      if (codeDisplay) codeDisplay.style.display = 'block';
    } else if (codeType === 'json') {
      if (jsonDisplay) jsonDisplay.style.display = 'block';
    } else if (codeType === 'json-all') {
      if (jsonAllDisplay) jsonAllDisplay.style.display = 'block';
    }

    // Actualizar el tamaño mostrado
    this.updateSizeInfoForCurrentDisplay(codeType);
  }

  private updateSizeInfoForCurrentDisplay(codeType: string): void {
    const sizeInfo = document.querySelector('.svg-size-info');
    if (!sizeInfo) return;

    let content = '';
    if (codeType === 'svg') {
      const codeDisplay = document.getElementById('code-display');
      const hasContent = codeDisplay && !codeDisplay.querySelector('.code-placeholder');
      if (hasContent) {
        const svgCode = this.codeViewer.getCurrentSVGCode();
        const sizeText = calculateSVGSize(svgCode);
        content = `<span class="size-value">${sizeText}</span>`;
      } else {
        content = `<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>`;
      }
    } else if (codeType === 'json') {
      const jsonDisplay = document.getElementById('json-display');
      const hasContent = jsonDisplay && !jsonDisplay.querySelector('.code-placeholder');
      if (hasContent) {
        const jsonCode = this.codeViewer.getCurrentJSONCode();
        const sizeText = calculateSVGSize(jsonCode);
        content = `<span class="size-value">${sizeText}</span>`;
      } else {
        content = `<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>`;
      }
    } else if (codeType === 'json-all') {
      const jsonAllDisplay = document.getElementById('json-all-display');
      const hasContent = jsonAllDisplay && !jsonAllDisplay.querySelector('.code-placeholder');
      if (hasContent) {
        const jsonCode = this.codeViewer.getCurrentAllJSONCode();
        const sizeText = calculateSVGSize(jsonCode);
        content = `<span class="size-value">${sizeText}</span>`;
      } else {
        content = `<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>`;
      }
    }

    sizeInfo.innerHTML = content;
  }
}

const app = new App();
app.init();
