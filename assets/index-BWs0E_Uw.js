import{s as v,m as b,i as y,z as S,a as h}from"./d3-DK4Cgk9G.js";import{r as E,g as C}from"./jszip-Cut6eRK0.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function e(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=e(t);fetch(t.href,s)}})();const l={dataUrl:"https://raw.githubusercontent.com/caticoa3/colombia_mapa/master/co_2018_MGN_MPIO_POLITICO.geojson",mapWidth:800,mapHeight:600,mapMargin:40,departmentCodes:[{code:"91",name:"Amazonas"},{code:"05",name:"Antioquia"},{code:"81",name:"Arauca"},{code:"08",name:"Atlántico"},{code:"11",name:"Bogotá D.C."},{code:"13",name:"Bolívar"},{code:"15",name:"Boyacá"},{code:"17",name:"Caldas"},{code:"18",name:"Caquetá"},{code:"85",name:"Casanare"},{code:"19",name:"Cauca"},{code:"20",name:"Cesar"},{code:"27",name:"Chocó"},{code:"23",name:"Córdoba"},{code:"25",name:"Cundinamarca"},{code:"94",name:"Guainía"},{code:"95",name:"Guaviare"},{code:"41",name:"Huila"},{code:"44",name:"La Guajira"},{code:"47",name:"Magdalena"},{code:"50",name:"Meta"},{code:"52",name:"Nariño"},{code:"54",name:"Norte de Santander"},{code:"86",name:"Putumayo"},{code:"63",name:"Quindío"},{code:"66",name:"Risaralda"},{code:"88",name:"San Andrés, Providencia y Santa Catalina"},{code:"68",name:"Santander"},{code:"70",name:"Sucre"},{code:"73",name:"Tolima"},{code:"76",name:"Valle del Cauca"},{code:"97",name:"Vaupés"},{code:"99",name:"Vichada"}],colors:{fill:"#6f9c76",stroke:"#ffffff",strokeWidth:"0.5"}},n={currentFeatures:[],allData:{departamentos:null,municipios:null},displayOption:"map",isAllDepartments:!1};function w(d){let a="",e="";return d.split(/>\s*</).forEach(t=>{t.match(/^\/\w/)&&(e=e.substring(2)),a+=e+"<"+t+`>\r
`,t.match(/^<?\w[^>]*[^\/]$/)&&!t.startsWith("?")&&(e+="  ")}),a.substring(1,a.length-3)}function g(d){const a=document.getElementById("loading");a&&(a.style.display=d?"block":"none")}function f(d){return d.replace(/[^\w-]/g,"\\$&")}function m(d,a="success"){const e=document.createElement("div");e.className=`notification ${a}`,e.textContent=d,e.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${a==="success"?"#4caf50":"#f44336"};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `,document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOut 0.3s ease",setTimeout(()=>e.remove(),300)},3e3)}function x(d){const a=new Blob([d]).size,e=a/1024;return e<1?`${a} bytes`:`${e.toFixed(2)} KB`}class A{svg;projection;path;zoom;g=null;constructor(a){this.svg=v(`#${a}`).append("svg").attr("id","mapa-svg").attr("viewBox",`0 0 ${l.mapWidth} ${l.mapHeight}`).attr("preserveAspectRatio","xMidYMid meet"),this.projection=b(),this.path=y().projection(this.projection),this.zoom=S().scaleExtent([.5,8]).on("zoom",e=>{this.g&&this.g.attr("transform",e.transform)}),this.svg.call(this.zoom)}renderMapa(a){if(this.svg.selectAll("*").remove(),n.currentFeatures=a,a.length===0)return;const e={type:"FeatureCollection",features:a};this.projection.fitSize([l.mapWidth,l.mapHeight],e),this.g=this.svg.append("g").attr("class","zoom-group"),this.g.append("g").attr("class","municipios").selectAll("path").data(a).enter().append("path").attr("class","municipio").attr("data-element-id",(t,s)=>t.properties.MPIO_CCNCT||`municipio-${s}`).attr("name",t=>t.properties.MPIO_CNMBR||"").attr("fill",l.colors.fill).attr("stroke",l.colors.stroke).attr("stroke-width",l.colors.strokeWidth).attr("d",this.path),this.svg.call(this.zoom.transform,h)}renderMunicipios(a){!n.allData.municipios||n.allData.municipios.features.filter(o=>o.properties.DPTO_CCDGO===a).length===0||this.svg.selectAll(".departamento").attr("stroke-width","0.3").attr("stroke-opacity","0.5")}renderEtiquetas(a){if(!this.g)return;this.g.append("g").attr("class","etiquetas").selectAll("text").data(a).enter().append("text").attr("class","etiqueta").attr("data-element-id",(o,t)=>o.properties.MPIO_CCNCT||`etiqueta-${t}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("x",o=>this.path.centroid(o)[0]).attr("y",o=>this.path.centroid(o)[1]).attr("text-anchor","middle").attr("font-size","10px").attr("fill","#333").attr("font-weight","bold").text(o=>o.properties.MPIO_CNMBR||"")}renderPuntos(a){if(!this.g)return;this.g.append("g").attr("class","puntos").selectAll("circle").data(a).enter().append("circle").attr("class","punto").attr("data-element-id",(o,t)=>o.properties.MPIO_CCNCT||`punto-${t}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("cx",o=>this.path.centroid(o)[0]).attr("cy",o=>this.path.centroid(o)[1]).attr("r",3).attr("fill","#d32f2f").attr("stroke",l.colors.stroke).attr("stroke-width","1")}updateDisplayOption(a){n.displayOption=a,this.svg.selectAll(".etiquetas").remove(),this.svg.selectAll(".puntos").remove(),a==="map+labels"?this.renderEtiquetas(n.currentFeatures):a==="map+points"&&this.renderPuntos(n.currentFeatures)}highlightElement(a){const e=f(a);this.svg.select(`[data-id="${e}"]`).attr("stroke","#ff9800").attr("stroke-width","2")}unhighlightElement(a){const e=f(a);this.svg.select(`[data-id="${e}"]`).attr("stroke",l.colors.stroke).attr("stroke-width",l.colors.strokeWidth)}getSVGElement(){return this.svg.node()}clearMap(){this.svg.selectAll("*").remove(),n.currentFeatures=[]}zoomIn(){this.svg.transition().duration(300).call(this.zoom.scaleBy,1.5)}zoomOut(){this.svg.transition().duration(300).call(this.zoom.scaleBy,.67)}resetZoom(){this.svg.transition().duration(300).call(this.zoom.transform,h)}}var z=E();const D=C(z);class G{projection;path;constructor(){this.projection=b(),this.path=y().projection(this.projection)}prepareSVGForExport(a,e,o){const t=a.cloneNode(!0);e||t.querySelectorAll(".etiquetas").forEach(c=>c.remove()),o?t.querySelectorAll(".punto").forEach(c=>{c.style.opacity="0"}):t.querySelectorAll(".puntos").forEach(c=>c.remove()),this.applyStylesToSVG(t);const s=t.getBBox(),i=`${s.x} ${s.y} ${s.width} ${s.height}`;return t.setAttribute("viewBox",i),t.setAttribute("xmlns","http://www.w3.org/2000/svg"),t.removeAttribute("width"),t.removeAttribute("height"),`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(t)}applyStylesToSVG(a){a.querySelectorAll(".departamento").forEach(e=>{e.style.fill=l.colors.fill,e.style.stroke=l.colors.stroke,e.style.strokeWidth=l.colors.strokeWidth}),a.querySelectorAll(".municipio").forEach(e=>{e.style.fill="none",e.style.stroke=l.colors.stroke,e.style.strokeWidth="0.3",e.style.opacity="0.5"}),a.querySelectorAll(".etiqueta").forEach(e=>{e.style.fontSize="10px",e.style.fill="#333",e.style.fontWeight="bold",e.style.textAnchor="middle"}),a.querySelectorAll(".punto").forEach(e=>{e.style.fill="#d32f2f",e.style.stroke=l.colors.stroke,e.style.strokeWidth="1"})}generateSVGForDepartment(a){if(!n.allData.departamentos)return"";const e=n.allData.departamentos.features.filter(i=>i.properties.DPTO_CCDGO===a);if(e.length===0)return"";const o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("width",String(l.mapWidth)),o.setAttribute("height",String(l.mapHeight));const t={type:"FeatureCollection",features:e};this.projection.fitSize([l.mapWidth,l.mapHeight],t);const s=document.createElementNS("http://www.w3.org/2000/svg","g");return s.setAttribute("class","municipios"),e.forEach((i,r)=>{const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("class","municipio");const c=i.properties.MPIO_CCNCT||`municipio-${r}`,u=i.properties.MPIO_CNMBR||"";p.setAttribute("data-element-id",c),p.setAttribute("name",u),p.setAttribute("d",this.path(i)||""),s.appendChild(p)}),o.appendChild(s),n.displayOption==="map+labels"?this.addEtiquetasToTempSVG(o,e):n.displayOption==="map+points"&&this.addPuntosToTempSVG(o,e),this.prepareSVGForExport(o,n.displayOption==="map+labels",n.displayOption==="map+points")}addEtiquetasToTempSVG(a,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","etiquetas"),e.forEach((t,s)=>{const i=this.path.centroid(t),r=document.createElementNS("http://www.w3.org/2000/svg","text");r.setAttribute("class","etiqueta");const p=t.properties.MPIO_CCNCT||`etiqueta-${s}`,c=t.properties.MPIO_CNMBR||"";r.setAttribute("data-element-id",p),r.setAttribute("name",c),r.setAttribute("x",String(i[0])),r.setAttribute("y",String(i[1])),r.textContent=c,o.appendChild(r)}),a.appendChild(o)}addPuntosToTempSVG(a,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","puntos"),e.forEach((t,s)=>{const i=this.path.centroid(t),r=document.createElementNS("http://www.w3.org/2000/svg","circle");r.setAttribute("class","punto");const p=t.properties.MPIO_CCNCT||`punto-${s}`,c=t.properties.MPIO_CNMBR||"";r.setAttribute("data-element-id",p),r.setAttribute("name",c),r.setAttribute("cx",String(i[0])),r.setAttribute("cy",String(i[1])),r.setAttribute("r","3"),o.appendChild(r)}),a.appendChild(o)}async downloadAllDepartments(){const a=new D;for(const s of l.departmentCodes){const i=this.generateSVGForDepartment(s.code);i&&a.file(`${s.name}.svg`,i)}const e=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}),o=URL.createObjectURL(e),t=document.createElement("a");t.href=o,t.download="departamentos-colombia.zip",t.click(),URL.revokeObjectURL(o),m("ZIP descargado exitosamente")}downloadSingleDepartment(a,e){const o=this.generateSVGForDepartment(a);if(!o){m("Error al generar SVG","error");return}const t=new Blob([o],{type:"image/svg+xml"}),s=URL.createObjectURL(t),i=document.createElement("a");i.href=s,i.download=`${e}.svg`,i.click(),URL.revokeObjectURL(s),m("SVG descargado exitosamente")}}class I{codeDisplay;mapRenderer;constructor(a,e){const o=document.getElementById(a);if(!o)throw new Error(`Element with id ${a} not found`);this.codeDisplay=o,this.mapRenderer=e}updateSVGCode(){const a=this.mapRenderer.getSVGElement();if(!a)return;const e=a.cloneNode(!0);n.displayOption==="map"?e.querySelectorAll(".etiquetas, .puntos").forEach(s=>s.remove()):n.displayOption==="map+labels"?e.querySelectorAll(".puntos").forEach(s=>s.remove()):n.displayOption==="map+points"&&(e.querySelectorAll(".etiquetas").forEach(s=>s.remove()),e.querySelectorAll(".punto").forEach(s=>{s.style.opacity="0"}));const t=new XMLSerializer().serializeToString(e);this.renderCode(t),this.updateSizeInfo(t)}renderCode(a){const e=w(a);this.codeDisplay.innerHTML="",e.split(`
`).forEach((t,s)=>{const i=document.createElement("div");i.className="code-line";const r=document.createElement("span");r.className="line-number",r.textContent=String(s+1);const p=document.createElement("span");p.className="line-content",p.textContent=t;const c=t.match(/class="(municipio|etiqueta|punto)"/),u=t.match(/data-element-id="([^"]+)"/);c&&u&&(i.classList.add("code-hoverable"),i.dataset.elementType=c[1],i.dataset.elementId=u[1]),i.appendChild(r),i.appendChild(p),this.codeDisplay.appendChild(i)}),this.setupCodeHoverEvents()}setupCodeHoverEvents(){this.codeDisplay.querySelectorAll(".code-hoverable").forEach(e=>{e.addEventListener("mouseenter",o=>{const s=o.currentTarget.dataset.elementId;s&&this.highlightSVGElement(s)}),e.addEventListener("mouseleave",o=>{const s=o.currentTarget.dataset.elementId;s&&this.unhighlightSVGElement(s)})})}highlightSVGElement(a){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${a}"]`);if(o){const t=o;o.tagName==="text"?(t.style.fill="#ff9800",t.style.fontWeight="bold",t.style.fontSize="12px"):(t.style.stroke="#ff9800",t.style.strokeWidth="2",o.tagName==="path"&&(t.style.fill="#ffa726"),t.style.opacity="1")}}unhighlightSVGElement(a){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${a}"]`);if(o){const t=o,s=o.tagName==="text",i=t.classList.contains("municipio"),r=t.classList.contains("punto");s?(t.style.fill="#333",t.style.fontWeight="bold",t.style.fontSize="10px"):(t.style.stroke="#ffffff",t.style.strokeWidth=i?"0.5":"1",i?t.style.fill="#6f9c76":r&&(t.style.fill="#d32f2f"),t.style.opacity="")}}copyCodeToClipboard(){const a=Array.from(this.codeDisplay.querySelectorAll(".line-content")).map(e=>e.textContent).join(`
`);navigator.clipboard.writeText(a).then(()=>{const e=document.querySelector(".copy-code-btn");e&&(e.innerHTML='<i class="fa-solid fa-check"></i> Copiado',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-copy"></i> Copiar'},2e3))})}updateSizeInfo(a){const e=document.querySelector(".svg-size-info");if(e){const o=x(a);e.innerHTML=`<span class="size-value">${o}</span>`}}clearCode(){this.codeDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-code"></i><p>Selecciona un departamento para ver el código SVG</p></div>';const a=document.querySelector(".svg-size-info");a&&(a.innerHTML=`
        <span class="size-placeholder">
          <i class="fa-solid fa-circle-info"></i>
          Sin selección
        </span>
      `)}}class O{mapRenderer;svgExporter;codeViewer;async init(){this.setupUI(),await this.loadData(),this.setupEventListeners()}setupUI(){document.querySelector("#app").innerHTML=`
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
                      ${l.departmentCodes.map(a=>`<option value="${a.code}">${a.name}</option>`).join("")}
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
                      aria-label="Descargar archivo ZIP con todos los 33 departamentos"
                      data-tooltip="Descarga un ZIP con los 33 departamentos"
                    >
                      <span class="btn-icon"><i class="fa-solid fa-file-zipper"></i></span>
                      <span class="btn-text">Descargar ZIP</span>
                      <span class="btn-badge">33 dptos</span>
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
    `,this.mapRenderer=new A("mapa-container"),this.svgExporter=new G,this.codeViewer=new I("code-display",this.mapRenderer)}async loadData(){g(!0);try{const a=await fetch(l.dataUrl).then(e=>e.json());n.allData.departamentos=a,n.allData.municipios=a,m("Datos cargados exitosamente")}catch(a){console.error("Error loading data:",a),m("Error al cargar los datos","error")}finally{g(!1)}}setupEventListeners(){const a=document.getElementById("departamento");a.addEventListener("change",()=>this.handleDepartmentChange(a.value)),document.querySelectorAll('input[name="displayOption"]').forEach(e=>{e.addEventListener("change",o=>{const t=o.target.value;this.mapRenderer.updateDisplayOption(t),this.codeViewer.updateSVGCode()})}),document.getElementById("btn-descargar")?.addEventListener("click",()=>{const e=a.value,o=l.departmentCodes.find(t=>t.code===e)?.name||"";this.svgExporter.downloadSingleDepartment(e,o)}),document.getElementById("btn-copiar")?.addEventListener("click",()=>{const e=this.mapRenderer.getSVGElement();if(e){const o=this.svgExporter.prepareSVGForExport(e,n.displayOption==="map+labels",n.displayOption==="map+points");navigator.clipboard.writeText(o).then(()=>{m("SVG copiado al portapapeles")})}}),document.getElementById("btn-descargar-todos")?.addEventListener("click",()=>{this.svgExporter.downloadAllDepartments()}),document.querySelector(".copy-code-btn")?.addEventListener("click",()=>{this.codeViewer.copyCodeToClipboard()}),document.getElementById("zoom-in")?.addEventListener("click",()=>{this.mapRenderer.zoomIn()}),document.getElementById("zoom-out")?.addEventListener("click",()=>{this.mapRenderer.zoomOut()}),document.getElementById("zoom-reset")?.addEventListener("click",()=>{this.mapRenderer.resetZoom()})}handleDepartmentChange(a){const e=document.querySelector("#mapa-container .map-placeholder");if(!a){this.disableButtons(),this.codeViewer.clearCode(),this.mapRenderer.clearMap(),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-map"></i>
          <p>Selecciona un departamento para visualizar el mapa</p>
        `);return}if(a==="ALL"){n.isAllDepartments=!0,this.showDownloadAllButton(),this.codeViewer.clearCode(),this.mapRenderer.clearMap(),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-layer-group"></i>
          <p>Opción "Todos los departamentos" seleccionada</p>
          <p class="placeholder-hint">Usa el botón "Descargar Todos (ZIP)" para obtener todos los mapas</p>
        `);return}if(e&&(e.style.display="none"),n.isAllDepartments=!1,this.hideDownloadAllButton(),!n.allData.departamentos)return;const o=n.allData.departamentos.features.filter(t=>t.properties.DPTO_CCDGO===a);this.mapRenderer.renderMapa(o),this.mapRenderer.renderMunicipios(a),n.displayOption==="map+labels"?this.mapRenderer.renderEtiquetas(o):n.displayOption==="map+points"&&this.mapRenderer.renderPuntos(o),this.codeViewer.updateSVGCode(),this.enableButtons()}enableButtons(){document.getElementById("btn-descargar").disabled=!1,document.getElementById("btn-copiar").disabled=!1}disableButtons(){document.getElementById("btn-descargar").disabled=!0,document.getElementById("btn-copiar").disabled=!0}showDownloadAllButton(){document.getElementById("btn-descargar").style.display="none",document.getElementById("btn-copiar").style.display="none",document.getElementById("btn-descargar-todos").style.display="inline-block"}hideDownloadAllButton(){document.getElementById("btn-descargar").style.display="inline-block",document.getElementById("btn-copiar").style.display="inline-block",document.getElementById("btn-descargar-todos").style.display="none"}}const V=new O;V.init();
//# sourceMappingURL=index-BWs0E_Uw.js.map
