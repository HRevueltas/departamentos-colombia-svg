import{s as v,m as b,i as y,z as S,a as h}from"./d3-DK4Cgk9G.js";import{r as E,g as C}from"./jszip-Cut6eRK0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const i={dataUrl:"https://raw.githubusercontent.com/caticoa3/colombia_mapa/master/co_2018_MGN_MPIO_POLITICO.geojson",mapWidth:800,mapHeight:600,mapMargin:40,departmentCodes:[{code:"91",name:"Amazonas"},{code:"05",name:"Antioquia"},{code:"81",name:"Arauca"},{code:"08",name:"Atlántico"},{code:"11",name:"Bogotá D.C."},{code:"13",name:"Bolívar"},{code:"15",name:"Boyacá"},{code:"17",name:"Caldas"},{code:"18",name:"Caquetá"},{code:"85",name:"Casanare"},{code:"19",name:"Cauca"},{code:"20",name:"Cesar"},{code:"27",name:"Chocó"},{code:"23",name:"Córdoba"},{code:"25",name:"Cundinamarca"},{code:"94",name:"Guainía"},{code:"95",name:"Guaviare"},{code:"41",name:"Huila"},{code:"44",name:"La Guajira"},{code:"47",name:"Magdalena"},{code:"50",name:"Meta"},{code:"52",name:"Nariño"},{code:"54",name:"Norte de Santander"},{code:"86",name:"Putumayo"},{code:"63",name:"Quindío"},{code:"66",name:"Risaralda"},{code:"88",name:"San Andrés, Providencia y Santa Catalina"},{code:"68",name:"Santander"},{code:"70",name:"Sucre"},{code:"73",name:"Tolima"},{code:"76",name:"Valle del Cauca"},{code:"97",name:"Vaupés"},{code:"99",name:"Vichada"}],colors:{fill:"#6f9c76",stroke:"#ffffff",strokeWidth:"0.5"}},r={currentFeatures:[],allData:{departamentos:null,municipios:null},displayOption:"map",isAllDepartments:!1};function w(d){let t="",e="";return d.split(/>\s*</).forEach(a=>{a.match(/^\/\w/)&&(e=e.substring(2)),t+=e+"<"+a+`>\r
`,a.match(/^<?\w[^>]*[^\/]$/)&&!a.startsWith("?")&&(e+="  ")}),t.substring(1,t.length-3)}function g(d){const t=document.getElementById("loading");t&&(t.style.display=d?"block":"none")}function f(d){return d.replace(/[^\w-]/g,"\\$&")}function m(d,t="success"){const e=document.createElement("div");e.className=`notification ${t}`,e.textContent=d,e.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${t==="success"?"#4caf50":"#f44336"};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `,document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOut 0.3s ease",setTimeout(()=>e.remove(),300)},3e3)}function x(d){const t=new Blob([d]).size,e=t/1024;return e<1?`${t} bytes`:`${e.toFixed(2)} KB`}class A{svg;projection;path;zoom;g=null;constructor(t){this.svg=v(`#${t}`).append("svg").attr("id","mapa-svg").attr("viewBox",`0 0 ${i.mapWidth} ${i.mapHeight}`).attr("preserveAspectRatio","xMidYMid meet"),this.projection=b(),this.path=y().projection(this.projection),this.zoom=S().scaleExtent([.5,8]).on("zoom",e=>{this.g&&this.g.attr("transform",e.transform)}),this.svg.call(this.zoom)}renderMapa(t){if(this.svg.selectAll("*").remove(),r.currentFeatures=t,t.length===0)return;const e={type:"FeatureCollection",features:t};this.projection.fitSize([i.mapWidth,i.mapHeight],e),this.g=this.svg.append("g").attr("class","zoom-group"),this.g.append("g").attr("class","municipios").selectAll("path").data(t).enter().append("path").attr("class","municipio").attr("data-element-id",(a,s)=>a.properties.MPIO_CCNCT||`municipio-${s}`).attr("name",a=>a.properties.MPIO_CNMBR||"").attr("fill",i.colors.fill).attr("stroke",i.colors.stroke).attr("stroke-width",i.colors.strokeWidth).attr("d",this.path),this.svg.call(this.zoom.transform,h)}renderMunicipios(t){!r.allData.municipios||r.allData.municipios.features.filter(o=>o.properties.DPTO_CCDGO===t).length===0||this.svg.selectAll(".departamento").attr("stroke-width","0.3").attr("stroke-opacity","0.5")}renderEtiquetas(t){if(!this.g)return;this.g.append("g").attr("class","etiquetas").selectAll("text").data(t).enter().append("text").attr("class","etiqueta").attr("data-element-id",(o,a)=>o.properties.MPIO_CCNCT||`etiqueta-${a}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("x",o=>this.path.centroid(o)[0]).attr("y",o=>this.path.centroid(o)[1]).attr("text-anchor","middle").attr("font-size","10px").attr("fill","#333").attr("font-weight","bold").text(o=>o.properties.MPIO_CNMBR||"")}renderPuntos(t){if(!this.g)return;this.g.append("g").attr("class","puntos").selectAll("circle").data(t).enter().append("circle").attr("class","punto").attr("data-element-id",(o,a)=>o.properties.MPIO_CCNCT||`punto-${a}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("cx",o=>this.path.centroid(o)[0]).attr("cy",o=>this.path.centroid(o)[1]).attr("r",3).attr("fill","#d32f2f").attr("stroke",i.colors.stroke).attr("stroke-width","1")}updateDisplayOption(t){r.displayOption=t,this.svg.selectAll(".etiquetas").remove(),this.svg.selectAll(".puntos").remove(),t==="map+labels"?this.renderEtiquetas(r.currentFeatures):t==="map+points"&&this.renderPuntos(r.currentFeatures)}highlightElement(t){const e=f(t);this.svg.select(`[data-id="${e}"]`).attr("stroke","#ff9800").attr("stroke-width","2")}unhighlightElement(t){const e=f(t);this.svg.select(`[data-id="${e}"]`).attr("stroke",i.colors.stroke).attr("stroke-width",i.colors.strokeWidth)}getSVGElement(){return this.svg.node()}clearMap(){this.svg.selectAll("*").remove(),r.currentFeatures=[]}zoomIn(){this.svg.transition().duration(300).call(this.zoom.scaleBy,1.5)}zoomOut(){this.svg.transition().duration(300).call(this.zoom.scaleBy,.67)}resetZoom(){this.svg.transition().duration(300).call(this.zoom.transform,h)}}var G=E();const V=C(G);class D{projection;path;constructor(){this.projection=b(),this.path=y().projection(this.projection)}prepareSVGForExport(t,e,o){const a=t.cloneNode(!0);e||a.querySelectorAll(".etiquetas").forEach(c=>c.remove()),o?a.querySelectorAll(".punto").forEach(c=>{c.style.opacity="0"}):a.querySelectorAll(".puntos").forEach(c=>c.remove()),this.applyStylesToSVG(a);const s=a.getBBox(),n=`${s.x} ${s.y} ${s.width} ${s.height}`;return a.setAttribute("viewBox",n),a.setAttribute("xmlns","http://www.w3.org/2000/svg"),a.removeAttribute("width"),a.removeAttribute("height"),`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(a)}applyStylesToSVG(t){t.querySelectorAll(".departamento").forEach(e=>{e.style.fill=i.colors.fill,e.style.stroke=i.colors.stroke,e.style.strokeWidth=i.colors.strokeWidth}),t.querySelectorAll(".municipio").forEach(e=>{e.style.fill="none",e.style.stroke=i.colors.stroke,e.style.strokeWidth="0.3",e.style.opacity="0.5"}),t.querySelectorAll(".etiqueta").forEach(e=>{e.style.fontSize="10px",e.style.fill="#333",e.style.fontWeight="bold",e.style.textAnchor="middle"}),t.querySelectorAll(".punto").forEach(e=>{e.style.fill="#d32f2f",e.style.stroke=i.colors.stroke,e.style.strokeWidth="1"})}generateSVGForDepartment(t){if(!r.allData.departamentos)return"";const e=r.allData.departamentos.features.filter(n=>n.properties.DPTO_CCDGO===t);if(e.length===0)return"";const o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("width",String(i.mapWidth)),o.setAttribute("height",String(i.mapHeight));const a={type:"FeatureCollection",features:e};this.projection.fitSize([i.mapWidth,i.mapHeight],a);const s=document.createElementNS("http://www.w3.org/2000/svg","g");return s.setAttribute("class","municipios"),e.forEach((n,l)=>{const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("class","municipio");const c=n.properties.MPIO_CCNCT||`municipio-${l}`,u=n.properties.MPIO_CNMBR||"";p.setAttribute("data-element-id",c),p.setAttribute("name",u),p.setAttribute("d",this.path(n)||""),s.appendChild(p)}),o.appendChild(s),r.displayOption==="map+labels"?this.addEtiquetasToTempSVG(o,e):r.displayOption==="map+points"&&this.addPuntosToTempSVG(o,e),this.prepareSVGForExport(o,r.displayOption==="map+labels",r.displayOption==="map+points")}addEtiquetasToTempSVG(t,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","etiquetas"),e.forEach((a,s)=>{const n=this.path.centroid(a),l=document.createElementNS("http://www.w3.org/2000/svg","text");l.setAttribute("class","etiqueta");const p=a.properties.MPIO_CCNCT||`etiqueta-${s}`,c=a.properties.MPIO_CNMBR||"";l.setAttribute("data-element-id",p),l.setAttribute("name",c),l.setAttribute("x",String(n[0])),l.setAttribute("y",String(n[1])),l.textContent=c,o.appendChild(l)}),t.appendChild(o)}addPuntosToTempSVG(t,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","puntos"),e.forEach((a,s)=>{const n=this.path.centroid(a),l=document.createElementNS("http://www.w3.org/2000/svg","circle");l.setAttribute("class","punto");const p=a.properties.MPIO_CCNCT||`punto-${s}`,c=a.properties.MPIO_CNMBR||"";l.setAttribute("data-element-id",p),l.setAttribute("name",c),l.setAttribute("cx",String(n[0])),l.setAttribute("cy",String(n[1])),l.setAttribute("r","3"),o.appendChild(l)}),t.appendChild(o)}async downloadAllDepartments(){const t=new V;for(const s of i.departmentCodes){const n=this.generateSVGForDepartment(s.code);n&&t.file(`${s.name}.svg`,n)}const e=await t.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}),o=URL.createObjectURL(e),a=document.createElement("a");a.href=o,a.download="departamentos-colombia.zip",a.click(),URL.revokeObjectURL(o),m("ZIP descargado exitosamente")}downloadSingleDepartment(t,e){const o=this.generateSVGForDepartment(t);if(!o){m("Error al generar SVG","error");return}const a=new Blob([o],{type:"image/svg+xml"}),s=URL.createObjectURL(a),n=document.createElement("a");n.href=s,n.download=`${e}.svg`,n.click(),URL.revokeObjectURL(s),m("SVG descargado exitosamente")}downloadCurrentSVG(t,e){if(!t){m("Error: No hay código SVG para descargar","error");return}const o=new Blob([t],{type:"image/svg+xml"}),a=URL.createObjectURL(o),s=document.createElement("a");s.href=a,s.download=`${e}.svg`,s.click(),URL.revokeObjectURL(a),m("SVG descargado exitosamente")}}class z{codeDisplay;mapRenderer;constructor(t,e){const o=document.getElementById(t);if(!o)throw new Error(`Element with id ${t} not found`);this.codeDisplay=o,this.mapRenderer=e}updateSVGCode(){const t=this.mapRenderer.getSVGElement();if(!t)return;const e=t.cloneNode(!0);r.displayOption==="map"?e.querySelectorAll(".etiquetas, .puntos").forEach(s=>s.remove()):r.displayOption==="map+labels"?e.querySelectorAll(".puntos").forEach(s=>s.remove()):r.displayOption==="map+points"&&(e.querySelectorAll(".etiquetas").forEach(s=>s.remove()),e.querySelectorAll(".punto").forEach(s=>{s.style.opacity="0"}));const a=new XMLSerializer().serializeToString(e);this.renderCode(a),this.updateSizeInfo(a)}renderCode(t){const e=w(t);this.codeDisplay.innerHTML="",e.split(`
`).forEach((a,s)=>{const n=document.createElement("div");n.className="code-line";const l=document.createElement("span");l.className="line-number",l.textContent=String(s+1);const p=document.createElement("span");p.className="line-content",p.textContent=a;const c=a.match(/class="(municipio|etiqueta|punto)"/),u=a.match(/data-element-id="([^"]+)"/);c&&u&&(n.classList.add("code-hoverable"),n.dataset.elementType=c[1],n.dataset.elementId=u[1]),n.appendChild(l),n.appendChild(p),this.codeDisplay.appendChild(n)}),this.setupCodeHoverEvents()}setupCodeHoverEvents(){this.codeDisplay.querySelectorAll(".code-hoverable").forEach(e=>{e.addEventListener("mouseenter",o=>{const s=o.currentTarget.dataset.elementId;s&&this.highlightSVGElement(s)}),e.addEventListener("mouseleave",o=>{const s=o.currentTarget.dataset.elementId;s&&this.unhighlightSVGElement(s)})})}highlightSVGElement(t){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${t}"]`);if(o){const a=o;o.tagName==="text"?(a.style.fill="#ff9800",a.style.fontWeight="bold",a.style.fontSize="12px"):(a.style.stroke="#ff9800",a.style.strokeWidth="2",o.tagName==="path"&&(a.style.fill="#ffa726"),a.style.opacity="1")}}unhighlightSVGElement(t){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${t}"]`);if(o){const a=o,s=o.tagName==="text",n=a.classList.contains("municipio"),l=a.classList.contains("punto");s?(a.style.fill="#333",a.style.fontWeight="bold",a.style.fontSize="10px"):(a.style.stroke="#ffffff",a.style.strokeWidth=n?"0.5":"1",n?a.style.fill="#6f9c76":l&&(a.style.fill="#d32f2f"),a.style.opacity="")}}copyCodeToClipboard(){const t=Array.from(this.codeDisplay.querySelectorAll(".line-content")).map(e=>e.textContent).join(`
`);navigator.clipboard.writeText(t).then(()=>{const e=document.querySelector(".copy-code-btn");e&&(e.innerHTML='<i class="fa-solid fa-check"></i> Copiado',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-copy"></i> Copiar'},2e3))})}getCurrentSVGCode(){return Array.from(this.codeDisplay.querySelectorAll(".line-content")).map(t=>t.textContent).join(`
`)}updateSizeInfo(t){const e=document.querySelector(".svg-size-info");if(e){const o=x(t);e.innerHTML=`<span class="size-value">${o}</span>`}}clearCode(){this.codeDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-code"></i><p>Selecciona un departamento para ver el código SVG</p></div>';const t=document.querySelector(".svg-size-info");t&&(t.innerHTML=`
        <span class="size-placeholder">
          <i class="fa-solid fa-circle-info"></i>
          Sin selección
        </span>
      `)}}class L{mapRenderer;svgExporter;codeViewer;async init(){this.setupUI(),await this.loadData(),this.setupEventListeners(),this.loadFromURL()}setupUI(){document.querySelector("#app").innerHTML=`
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
                      ${i.departmentCodes.map(t=>`<option value="${t.code}">${t.name}</option>`).join("")}
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
                  <h3>Código SVG</h3>
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
                    title="Descargar archivo SVG"
                    aria-label="Descargar archivo SVG"
                    disabled
                  >
                    <i class="fa-solid fa-download"></i> Descargar
                  </button>
                  <button 
                    class="copy-code-btn" 
                    title="Copiar código al portapapeles"
                    aria-label="Copiar código SVG al portapapeles"
                  >
                    <i class="fa-solid fa-copy"></i> Copiar
                  </button>
                </div>
              </div>
              <div 
                id="code-display" 
                class="code-display" 
                role="code"
                aria-label="Código SVG formateado"
                tabindex="0"
              >
                <div class="code-placeholder">
                  <i class="fa-solid fa-code"></i>
                  <p>Selecciona un departamento para ver el código SVG</p>
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
    `,this.mapRenderer=new A("mapa-container"),this.svgExporter=new D,this.codeViewer=new z("code-display",this.mapRenderer)}async loadData(){g(!0);try{const t=await fetch(i.dataUrl).then(e=>e.json());r.allData.departamentos=t,r.allData.municipios=t,m("Datos cargados exitosamente")}catch(t){console.error("Error loading data:",t),m("Error al cargar los datos","error")}finally{g(!1)}}setupEventListeners(){const t=document.getElementById("departamento");t.addEventListener("change",()=>{this.handleDepartmentChange(t.value),this.updateURL(t.value)}),window.addEventListener("hashchange",()=>this.loadFromURL()),document.querySelectorAll('input[name="displayOption"]').forEach(e=>{e.addEventListener("change",o=>{const a=o.target.value;this.mapRenderer.updateDisplayOption(a),this.codeViewer.updateSVGCode()})}),document.getElementById("btn-copiar")?.addEventListener("click",()=>{const e=this.mapRenderer.getSVGElement();if(e){const o=this.svgExporter.prepareSVGForExport(e,r.displayOption==="map+labels",r.displayOption==="map+points");navigator.clipboard.writeText(o).then(()=>{m("SVG copiado al portapapeles")})}}),document.getElementById("btn-descargar-todos")?.addEventListener("click",()=>{this.svgExporter.downloadAllDepartments()}),document.querySelector(".copy-code-btn")?.addEventListener("click",()=>{this.codeViewer.copyCodeToClipboard()}),document.getElementById("btn-descargar-code")?.addEventListener("click",()=>{const o=document.getElementById("departamento").value,a=i.departmentCodes.find(n=>n.code===o)?.name||"",s=this.codeViewer.getCurrentSVGCode();this.svgExporter.downloadCurrentSVG(s,a)}),document.getElementById("btn-descargar")?.addEventListener("click",()=>{const o=document.getElementById("departamento").value,a=i.departmentCodes.find(n=>n.code===o)?.name||"",s=this.codeViewer.getCurrentSVGCode();this.svgExporter.downloadCurrentSVG(s,a)}),document.getElementById("zoom-in")?.addEventListener("click",()=>{this.mapRenderer.zoomIn()}),document.getElementById("zoom-out")?.addEventListener("click",()=>{this.mapRenderer.zoomOut()}),document.getElementById("zoom-reset")?.addEventListener("click",()=>{this.mapRenderer.resetZoom()})}handleDepartmentChange(t){const e=document.querySelector("#mapa-container .map-placeholder");if(!t){this.disableButtons(),this.codeViewer.clearCode(),this.mapRenderer.clearMap(),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-map"></i>
          <p>Selecciona un departamento para visualizar el mapa</p>
        `);return}if(t==="ALL"){r.isAllDepartments=!0,this.showDownloadAllButton(),this.codeViewer.clearCode(),this.mapRenderer.clearMap(),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-layer-group"></i>
          <p>Opción "Todos los departamentos" seleccionada</p>
          <p class="placeholder-hint">Usa el botón "Descargar Todos (ZIP)" para obtener todos los mapas</p>
        `);return}if(e&&(e.style.display="none"),r.isAllDepartments=!1,this.hideDownloadAllButton(),!r.allData.departamentos)return;const o=r.allData.departamentos.features.filter(a=>a.properties.DPTO_CCDGO===t);this.mapRenderer.renderMapa(o),this.mapRenderer.renderMunicipios(t),r.displayOption==="map+labels"?this.mapRenderer.renderEtiquetas(o):r.displayOption==="map+points"&&this.mapRenderer.renderPuntos(o),this.codeViewer.updateSVGCode(),this.enableButtons()}enableButtons(){document.getElementById("btn-descargar").disabled=!1,document.getElementById("btn-copiar").disabled=!1,document.getElementById("btn-descargar-code").disabled=!1}disableButtons(){document.getElementById("btn-descargar").disabled=!0,document.getElementById("btn-copiar").disabled=!0,document.getElementById("btn-descargar-code").disabled=!0}showDownloadAllButton(){document.getElementById("btn-descargar").style.display="none",document.getElementById("btn-copiar").style.display="none",document.getElementById("btn-descargar-todos").style.display="inline-block"}hideDownloadAllButton(){document.getElementById("btn-descargar").style.display="inline-block",document.getElementById("btn-copiar").style.display="inline-block",document.getElementById("btn-descargar-todos").style.display="none"}updateURL(t){if(!t||t==="ALL"){window.location.hash&&history.pushState(null,"",window.location.pathname);return}const e=i.departmentCodes.find(o=>o.code===t);if(e){const o=this.createSlug(e.name);history.pushState(null,"",`#${o}`)}}loadFromURL(){const t=window.location.hash.slice(1);if(!t)return;const e=i.departmentCodes.find(o=>this.createSlug(o.name)===t);if(e){const o=document.getElementById("departamento");o.value=e.code,this.handleDepartmentChange(e.code)}}createSlug(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-")}}const I=new L;I.init();
//# sourceMappingURL=index-DDdXBiJg.js.map
