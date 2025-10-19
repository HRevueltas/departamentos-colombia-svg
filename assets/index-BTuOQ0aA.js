import{s as A,m as b,i as v,z as j,a as S}from"./d3-DK4Cgk9G.js";import{r as N,g as x}from"./jszip-Cut6eRK0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const r={dataUrl:"https://raw.githubusercontent.com/caticoa3/colombia_mapa/master/co_2018_MGN_MPIO_POLITICO.geojson",mapWidth:800,mapHeight:600,mapMargin:40,departmentCodes:[{code:"91",name:"Amazonas"},{code:"05",name:"Antioquia"},{code:"81",name:"Arauca"},{code:"08",name:"Atlántico"},{code:"11",name:"Bogotá D.C."},{code:"13",name:"Bolívar"},{code:"15",name:"Boyacá"},{code:"17",name:"Caldas"},{code:"18",name:"Caquetá"},{code:"85",name:"Casanare"},{code:"19",name:"Cauca"},{code:"20",name:"Cesar"},{code:"27",name:"Chocó"},{code:"23",name:"Córdoba"},{code:"25",name:"Cundinamarca"},{code:"94",name:"Guainía"},{code:"95",name:"Guaviare"},{code:"41",name:"Huila"},{code:"44",name:"La Guajira"},{code:"47",name:"Magdalena"},{code:"50",name:"Meta"},{code:"52",name:"Nariño"},{code:"54",name:"Norte de Santander"},{code:"86",name:"Putumayo"},{code:"63",name:"Quindío"},{code:"66",name:"Risaralda"},{code:"88",name:"San Andrés, Providencia y Santa Catalina"},{code:"68",name:"Santander"},{code:"70",name:"Sucre"},{code:"73",name:"Tolima"},{code:"76",name:"Valle del Cauca"},{code:"97",name:"Vaupés"},{code:"99",name:"Vichada"}],colors:{fill:"#6f9c76",stroke:"#ffffff",strokeWidth:"0.5"}},l={currentFeatures:[],allData:{departamentos:null,municipios:null},displayOption:"map",isAllDepartments:!1,jsonGenerated:{departamento:!1,all:!1}};function I(p){let t="",e="";return p.split(/>\s*</).forEach(a=>{a.match(/^\/\w/)&&(e=e.substring(2)),t+=e+"<"+a+`>\r
`,a.match(/^<?\w[^>]*[^\/]$/)&&!a.startsWith("?")&&(e+="  ")}),t.substring(1,t.length-3)}function C(p){const t=document.getElementById("loading");t&&(t.style.display=p?"block":"none")}function E(p){return p.replace(/[^\w-]/g,"\\$&")}function u(p,t="success"){const e=document.createElement("div");e.className=`notification ${t}`,e.textContent=p,e.style.cssText=`
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
  `,document.body.appendChild(e),setTimeout(()=>{e.style.animation="slideOut 0.3s ease",setTimeout(()=>e.remove(),300)},3e3)}function g(p){const t=new Blob([p]).size,e=t/1024;return e<1?`${t} bytes`:`${e.toFixed(2)} KB`}class T{svg;projection;path;zoom;g=null;constructor(t){this.svg=A(`#${t}`).append("svg").attr("id","mapa-svg").attr("viewBox",`0 0 ${r.mapWidth} ${r.mapHeight}`).attr("preserveAspectRatio","xMidYMid meet"),this.projection=b(),this.path=v().projection(this.projection),this.zoom=j().scaleExtent([.5,8]).on("zoom",e=>{this.g&&this.g.attr("transform",e.transform)}),this.svg.call(this.zoom)}renderMapa(t){if(this.svg.selectAll("*").remove(),l.currentFeatures=t,t.length===0)return;const e={type:"FeatureCollection",features:t};this.projection.fitSize([r.mapWidth,r.mapHeight],e),this.g=this.svg.append("g").attr("class","zoom-group");const o=t[0]?.properties?.DPTO_CCDGO||"";this.g.append("g").attr("class","municipios").attr("data-departamento-id",o).selectAll("path").data(t).enter().append("path").attr("class","municipio").attr("data-element-id",(s,n)=>s.properties.MPIO_CCNCT||`municipio-${n}`).attr("name",s=>s.properties.MPIO_CNMBR||"").attr("fill",r.colors.fill).attr("stroke",r.colors.stroke).attr("stroke-width",r.colors.strokeWidth).attr("d",this.path),this.svg.call(this.zoom.transform,S)}renderMunicipios(t){!l.allData.municipios||l.allData.municipios.features.filter(o=>o.properties.DPTO_CCDGO===t).length===0||this.svg.selectAll(".departamento").attr("stroke-width","0.3").attr("stroke-opacity","0.5")}renderEtiquetas(t){if(!this.g)return;this.g.append("g").attr("class","etiquetas").selectAll("text").data(t).enter().append("text").attr("class","etiqueta").attr("data-element-id",(o,a)=>o.properties.MPIO_CCNCT||`etiqueta-${a}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("x",o=>this.path.centroid(o)[0]).attr("y",o=>this.path.centroid(o)[1]).attr("text-anchor","middle").attr("font-size","10px").attr("fill","#333").attr("font-weight","bold").text(o=>o.properties.MPIO_CNMBR||"")}renderPuntos(t){if(!this.g)return;this.g.append("g").attr("class","puntos").selectAll("circle").data(t).enter().append("circle").attr("class","punto").attr("data-element-id",(o,a)=>o.properties.MPIO_CCNCT||`punto-${a}`).attr("name",o=>o.properties.MPIO_CNMBR||"").attr("cx",o=>this.path.centroid(o)[0]).attr("cy",o=>this.path.centroid(o)[1]).attr("r",3).attr("fill","#d32f2f").attr("stroke",r.colors.stroke).attr("stroke-width","1")}updateDisplayOption(t){l.displayOption=t,this.svg.selectAll(".etiquetas").remove(),this.svg.selectAll(".puntos").remove(),t==="map+labels"?this.renderEtiquetas(l.currentFeatures):t==="map+points"&&this.renderPuntos(l.currentFeatures)}highlightElement(t){const e=E(t);this.svg.select(`[data-id="${e}"]`).attr("stroke","#ff9800").attr("stroke-width","2")}unhighlightElement(t){const e=E(t);this.svg.select(`[data-id="${e}"]`).attr("stroke",r.colors.stroke).attr("stroke-width",r.colors.strokeWidth)}getSVGElement(){return this.svg.node()}getMunicipiosJSON(){const t=this.getSVGElement(),e=[],o=t.querySelectorAll(".municipio"),a=t.querySelector(".municipios")?.getAttribute("data-departamento-id")||"",n=r.departmentCodes.find(h=>h.code===a)?.name||"",i=t.getAttribute("viewBox")||"0 0 800 600";let c=r.colors.fill,d=r.colors.stroke,m=r.colors.strokeWidth;if(o.length>0){const h=o[0];c=h.getAttribute("fill")||c,d=h.getAttribute("stroke")||d,m=h.getAttribute("stroke-width")||String(m)}o.forEach(h=>{const y=h,w=y.getAttribute("data-element-id")||"",O=y.getAttribute("name")||"",D=y.getAttribute("d")||"";e.push({id:w,nombre:O,d:D})});const f={metadata:{departamento:{id:a,nombre:n},svg:{viewBox:i},styles:{fill:c,stroke:d,strokeWidth:parseFloat(m)}},municipios:e};return JSON.stringify(f,null,2)}clearMap(){this.svg.selectAll("*").remove(),l.currentFeatures=[]}zoomIn(){this.svg.transition().duration(300).call(this.zoom.scaleBy,1.5)}zoomOut(){this.svg.transition().duration(300).call(this.zoom.scaleBy,.67)}resetZoom(){this.svg.transition().duration(300).call(this.zoom.transform,S)}}var L=N();const z=x(L);class B{projection;path;constructor(){this.projection=b(),this.path=v().projection(this.projection)}prepareSVGForExport(t,e,o){const a=t.cloneNode(!0);e||a.querySelectorAll(".etiquetas").forEach(d=>d.remove()),o?a.querySelectorAll(".punto").forEach(d=>{d.style.opacity="0"}):a.querySelectorAll(".puntos").forEach(d=>d.remove()),this.applyStylesToSVG(a);const s=a.getBBox(),n=`${s.x} ${s.y} ${s.width} ${s.height}`;return a.setAttribute("viewBox",n),a.setAttribute("xmlns","http://www.w3.org/2000/svg"),a.removeAttribute("width"),a.removeAttribute("height"),`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(a)}applyStylesToSVG(t){t.querySelectorAll(".departamento").forEach(e=>{e.style.fill=r.colors.fill,e.style.stroke=r.colors.stroke,e.style.strokeWidth=r.colors.strokeWidth}),t.querySelectorAll(".municipio").forEach(e=>{e.style.fill="none",e.style.stroke=r.colors.stroke,e.style.strokeWidth="0.3",e.style.opacity="0.5"}),t.querySelectorAll(".etiqueta").forEach(e=>{e.style.fontSize="10px",e.style.fill="#333",e.style.fontWeight="bold",e.style.textAnchor="middle"}),t.querySelectorAll(".punto").forEach(e=>{e.style.fill="#d32f2f",e.style.stroke=r.colors.stroke,e.style.strokeWidth="1"})}generateSVGForDepartment(t){if(!l.allData.departamentos)return"";const e=l.allData.departamentos.features.filter(n=>n.properties.DPTO_CCDGO===t);if(e.length===0)return"";const o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("width",String(r.mapWidth)),o.setAttribute("height",String(r.mapHeight));const a={type:"FeatureCollection",features:e};this.projection.fitSize([r.mapWidth,r.mapHeight],a);const s=document.createElementNS("http://www.w3.org/2000/svg","g");return s.setAttribute("class","municipios"),e.forEach((n,i)=>{const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("class","municipio");const d=n.properties.MPIO_CCNCT||`municipio-${i}`,m=n.properties.MPIO_CNMBR||"";c.setAttribute("data-element-id",d),c.setAttribute("name",m),c.setAttribute("d",this.path(n)||""),s.appendChild(c)}),o.appendChild(s),l.displayOption==="map+labels"?this.addEtiquetasToTempSVG(o,e):l.displayOption==="map+points"&&this.addPuntosToTempSVG(o,e),this.prepareSVGForExport(o,l.displayOption==="map+labels",l.displayOption==="map+points")}addEtiquetasToTempSVG(t,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","etiquetas"),e.forEach((a,s)=>{const n=this.path.centroid(a),i=document.createElementNS("http://www.w3.org/2000/svg","text");i.setAttribute("class","etiqueta");const c=a.properties.MPIO_CCNCT||`etiqueta-${s}`,d=a.properties.MPIO_CNMBR||"";i.setAttribute("data-element-id",c),i.setAttribute("name",d),i.setAttribute("x",String(n[0])),i.setAttribute("y",String(n[1])),i.textContent=d,o.appendChild(i)}),t.appendChild(o)}addPuntosToTempSVG(t,e){const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("class","puntos"),e.forEach((a,s)=>{const n=this.path.centroid(a),i=document.createElementNS("http://www.w3.org/2000/svg","circle");i.setAttribute("class","punto");const c=a.properties.MPIO_CCNCT||`punto-${s}`,d=a.properties.MPIO_CNMBR||"";i.setAttribute("data-element-id",c),i.setAttribute("name",d),i.setAttribute("cx",String(n[0])),i.setAttribute("cy",String(n[1])),i.setAttribute("r","3"),o.appendChild(i)}),t.appendChild(o)}async downloadAllDepartments(){const t=new z;for(const s of r.departmentCodes){const n=this.generateSVGForDepartment(s.code);n&&t.file(`${s.name}.svg`,n)}const e=await t.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}),o=URL.createObjectURL(e),a=document.createElement("a");a.href=o,a.download="departamentos-colombia.zip",a.click(),URL.revokeObjectURL(o),u("ZIP descargado exitosamente")}downloadSingleDepartment(t,e){const o=this.generateSVGForDepartment(t);if(!o){u("Error al generar SVG","error");return}const a=new Blob([o],{type:"image/svg+xml"}),s=URL.createObjectURL(a),n=document.createElement("a");n.href=s,n.download=`${e}.svg`,n.click(),URL.revokeObjectURL(s),u("SVG descargado exitosamente")}downloadCurrentSVG(t,e){if(!t){u("Error: No hay código SVG para descargar","error");return}const o=new Blob([t],{type:"image/svg+xml"}),a=URL.createObjectURL(o),s=document.createElement("a");s.href=a,s.download=`${e}.svg`,s.click(),URL.revokeObjectURL(a),u("SVG descargado exitosamente")}}class G{codeDisplay;jsonDisplay;jsonAllDisplay;mapRenderer;constructor(t,e){const o=document.getElementById(t);if(!o)throw new Error(`Element with id ${t} not found`);this.codeDisplay=o,this.jsonDisplay=document.getElementById("json-display"),this.jsonAllDisplay=document.getElementById("json-all-display"),this.mapRenderer=e}updateSVGCode(){const t=this.mapRenderer.getSVGElement();if(!t)return;const e=t.cloneNode(!0);l.displayOption==="map"?e.querySelectorAll(".etiquetas, .puntos").forEach(s=>s.remove()):l.displayOption==="map+labels"?e.querySelectorAll(".puntos").forEach(s=>s.remove()):l.displayOption==="map+points"&&(e.querySelectorAll(".etiquetas").forEach(s=>s.remove()),e.querySelectorAll(".punto").forEach(s=>{s.style.opacity="0"}));const a=new XMLSerializer().serializeToString(e);this.renderCode(a),this.updateSizeInfo(a)}renderCode(t){const e=I(t);this.codeDisplay.innerHTML="",e.split(`
`).forEach((a,s)=>{const n=document.createElement("div");n.className="code-line";const i=document.createElement("span");i.className="line-number",i.textContent=String(s+1);const c=document.createElement("span");c.className="line-content",c.textContent=a;const d=a.match(/class="(municipio|etiqueta|punto)"/),m=a.match(/data-element-id="([^"]+)"/);d&&m&&(n.classList.add("code-hoverable"),n.dataset.elementType=d[1],n.dataset.elementId=m[1]),n.appendChild(i),n.appendChild(c),this.codeDisplay.appendChild(n)}),this.setupCodeHoverEvents()}setupCodeHoverEvents(){this.codeDisplay.querySelectorAll(".code-hoverable").forEach(e=>{e.addEventListener("mouseenter",o=>{const s=o.currentTarget.dataset.elementId;s&&this.highlightSVGElement(s)}),e.addEventListener("mouseleave",o=>{const s=o.currentTarget.dataset.elementId;s&&this.unhighlightSVGElement(s)})})}highlightSVGElement(t){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${t}"]`);if(o){const a=o;o.tagName==="text"?(a.style.fill="#ff9800",a.style.fontWeight="bold",a.style.fontSize="12px"):(a.style.stroke="#ff9800",a.style.strokeWidth="2",o.tagName==="path"&&(a.style.fill="#ffa726"),a.style.opacity="1")}}unhighlightSVGElement(t){const o=this.mapRenderer.getSVGElement().querySelector(`[data-element-id="${t}"]`);if(o){const a=o,s=o.tagName==="text",n=a.classList.contains("municipio"),i=a.classList.contains("punto");s?(a.style.fill="#333",a.style.fontWeight="bold",a.style.fontSize="10px"):(a.style.stroke="#ffffff",a.style.strokeWidth=n?"0.5":"1",n?a.style.fill="#6f9c76":i&&(a.style.fill="#d32f2f"),a.style.opacity="")}}copyCodeToClipboard(){const t=Array.from(this.codeDisplay.querySelectorAll(".line-content")).map(e=>e.textContent).join(`
`);navigator.clipboard.writeText(t).then(()=>{const e=document.querySelector(".copy-code-btn");e&&(e.innerHTML='<i class="fa-solid fa-check"></i> Copiado',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-copy"></i> Copiar'},2e3))})}getCurrentSVGCode(){return Array.from(this.codeDisplay.querySelectorAll(".line-content")).map(t=>t.textContent).join(`
`)}updateJSONCode(){l.jsonGenerated.departamento=!1,l.jsonGenerated.all=!1,this.jsonDisplay&&(this.jsonDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-brackets-curly"></i><p>Selecciona esta opción en el selector para generar el JSON</p></div>'),this.jsonAllDisplay&&(this.jsonAllDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-database"></i><p>Selecciona "Todos los departamentos" y luego esta opción para generar el JSON</p></div>')}generateJSONOnDemand(t,e=!1){t==="departamento"&&(!l.jsonGenerated.departamento||e)?(this.showJSONLoading(this.jsonDisplay),setTimeout(()=>{const o=this.mapRenderer.getMunicipiosJSON();this.renderJSON(o,this.jsonDisplay),l.jsonGenerated.departamento=!0,window.dispatchEvent(new CustomEvent("jsonGenerated",{detail:{type:"departamento"}}))},100)):t==="all"&&(!l.jsonGenerated.all||e)&&(this.showJSONLoading(this.jsonAllDisplay),setTimeout(()=>{this.updateAllDepartmentsJSON(),l.jsonGenerated.all=!0,window.dispatchEvent(new CustomEvent("jsonGenerated",{detail:{type:"all"}}))},100))}showJSONLoading(t){t&&(t.innerHTML=`
      <div class="code-placeholder">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Generando JSON...</p>
      </div>
    `)}updateAllDepartmentsJSON(){if(!l.allData.departamentos)return;const t=[],e=new Map;l.allData.departamentos.features.forEach(a=>{const s=a.properties.DPTO_CCDGO,n=a.properties.DPTO_CNMBR;e.has(s)||e.set(s,{code:s,nombre:n})}),e.forEach((a,s)=>{const n=l.allData.departamentos.features.filter(f=>f.properties.DPTO_CCDGO===s),i=b(),c=v().projection(i),d={type:"FeatureCollection",features:n};i.fitSize([800,600],d);const m=[];n.forEach(f=>{const h=c(f)||"";m.push({id:f.properties.MPIO_CCNCT||"",nombre:f.properties.MPIO_CNMBR||"",d:h})}),t.push({metadata:{departamento:{id:s,nombre:a.nombre},svg:{viewBox:"0 0 800 600"},styles:{fill:"#6f9c76",stroke:"#ffffff",strokeWidth:.5}},municipios:m})});const o=JSON.stringify({totalDepartamentos:e.size,departamentos:t},null,2);this.renderJSON(o,this.jsonAllDisplay)}renderJSON(t,e){if(!e)return;e.innerHTML="",t.split(`
`).forEach((a,s)=>{const n=document.createElement("div");n.className="code-line";const i=document.createElement("span");i.className="line-number",i.textContent=String(s+1);const c=document.createElement("span");c.className="line-content",c.textContent=a,n.appendChild(i),n.appendChild(c),e.appendChild(n)})}getCurrentJSONCode(){return this.jsonDisplay?Array.from(this.jsonDisplay.querySelectorAll(".line-content")).map(t=>t.textContent).join(`
`):""}getCurrentAllJSONCode(){return this.jsonAllDisplay?Array.from(this.jsonAllDisplay.querySelectorAll(".line-content")).map(t=>t.textContent).join(`
`):""}copyJSONToClipboard(){const t=this.getCurrentJSONCode();navigator.clipboard.writeText(t).then(()=>{const e=document.getElementById("btn-copiar-json");e&&(e.innerHTML='<i class="fa-solid fa-check"></i> Copiado',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-copy"></i> Copiar'},2e3))})}copyAllJSONToClipboard(){const t=this.getCurrentAllJSONCode();navigator.clipboard.writeText(t).then(()=>{const e=document.getElementById("btn-copiar-json-all");e&&(e.innerHTML='<i class="fa-solid fa-check"></i> Copiado',setTimeout(()=>{e.innerHTML='<i class="fa-solid fa-copy"></i> Copiar'},2e3))})}updateSizeInfo(t){const e=document.querySelector(".svg-size-info");if(e){const o=g(t);e.innerHTML=`<span class="size-value">${o}</span>`}}clearCode(){this.codeDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-code"></i><p>Selecciona un departamento para ver el código SVG</p></div>';const t=document.querySelector(".svg-size-info");t&&(t.innerHTML=`
        <span class="size-placeholder">
          <i class="fa-solid fa-circle-info"></i>
          Sin selección
        </span>
      `),this.jsonDisplay&&(this.jsonDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-brackets-curly"></i><p>Selecciona un departamento para ver los datos JSON</p></div>'),this.jsonAllDisplay&&(this.jsonAllDisplay.innerHTML='<div class="code-placeholder"><i class="fa-solid fa-database"></i><p>Selecciona "Todos los departamentos" para ver los datos JSON completos</p></div>')}}class V{mapRenderer;svgExporter;codeViewer;async init(){this.setupUI(),await this.loadData(),this.setupEventListeners(),this.loadFromURL()}setupUI(){document.querySelector("#app").innerHTML=`
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
                      ${r.departmentCodes.map(t=>`<option value="${t.code}">${t.name}</option>`).join("")}
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
    `,this.mapRenderer=new T("mapa-container"),this.svgExporter=new B,this.codeViewer=new G("code-display",this.mapRenderer)}async loadData(){C(!0);try{const t=await fetch(r.dataUrl).then(e=>e.json());l.allData.departamentos=t,l.allData.municipios=t,u("Datos cargados exitosamente")}catch(t){console.error("Error loading data:",t),u("Error al cargar los datos","error")}finally{C(!1)}}setupEventListeners(){const t=document.getElementById("departamento");t.addEventListener("change",()=>{this.handleDepartmentChange(t.value),this.updateURL(t.value)}),window.addEventListener("hashchange",()=>this.loadFromURL()),document.querySelectorAll('input[name="displayOption"]').forEach(e=>{e.addEventListener("change",o=>{const a=o.target.value;this.mapRenderer.updateDisplayOption(a),this.codeViewer.updateSVGCode(),this.codeViewer.updateJSONCode()})}),document.getElementById("btn-copiar")?.addEventListener("click",()=>{const e=this.mapRenderer.getSVGElement();if(e){const o=this.svgExporter.prepareSVGForExport(e,l.displayOption==="map+labels",l.displayOption==="map+points");navigator.clipboard.writeText(o).then(()=>{u("SVG copiado al portapapeles")})}}),document.getElementById("btn-descargar-todos")?.addEventListener("click",()=>{this.svgExporter.downloadAllDepartments()}),document.getElementById("btn-descargar")?.addEventListener("click",()=>{const o=document.getElementById("departamento").value,a=r.departmentCodes.find(n=>n.code===o)?.name||"",s=this.codeViewer.getCurrentSVGCode();this.svgExporter.downloadCurrentSVG(s,a)}),document.getElementById("code-type-select")?.addEventListener("change",e=>{const o=e.target.value;o==="json"?this.codeViewer.generateJSONOnDemand("departamento"):o==="json-all"&&this.codeViewer.generateJSONOnDemand("all"),this.switchCodeDisplay(o)}),document.querySelector(".copy-code-btn")?.addEventListener("click",()=>{const e=document.getElementById("code-type-select")?.value;e==="svg"?this.codeViewer.copyCodeToClipboard():e==="json"?this.codeViewer.copyJSONToClipboard():e==="json-all"&&this.codeViewer.copyAllJSONToClipboard()}),document.getElementById("btn-descargar-code")?.addEventListener("click",()=>{const o=document.getElementById("departamento").value,a=r.departmentCodes.find(n=>n.code===o)?.name||"",s=document.getElementById("code-type-select")?.value;if(s==="svg"){const n=this.codeViewer.getCurrentSVGCode();this.svgExporter.downloadCurrentSVG(n,a)}else if(s==="json"){const n=this.codeViewer.getCurrentJSONCode();this.downloadJSON(n,`${a}-municipios.json`)}else if(s==="json-all"){const n=this.codeViewer.getCurrentAllJSONCode();this.downloadJSON(n,"colombia-todos-municipios.json")}}),document.getElementById("zoom-in")?.addEventListener("click",()=>{this.mapRenderer.zoomIn()}),document.getElementById("zoom-out")?.addEventListener("click",()=>{this.mapRenderer.zoomOut()}),document.getElementById("zoom-reset")?.addEventListener("click",()=>{this.mapRenderer.resetZoom()}),window.addEventListener("jsonGenerated",()=>{const e=document.getElementById("code-type-select");e&&this.updateSizeInfoForCurrentDisplay(e.value)})}handleDepartmentChange(t){const e=document.querySelector("#mapa-container .map-placeholder");if(!t){this.disableButtons(),this.codeViewer.clearCode(),this.mapRenderer.clearMap(),this.hideJsonAllOption(),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-map"></i>
          <p>Selecciona un departamento para visualizar el mapa</p>
        `);return}if(t==="ALL"){l.isAllDepartments=!0,this.showDownloadAllButton(),this.showJsonAllOption(),this.codeViewer.clearCode(),this.codeViewer.updateJSONCode(),this.mapRenderer.clearMap();const s=document.getElementById("code-type-select");s&&s.value==="json-all"&&this.codeViewer.generateJSONOnDemand("all"),e&&(e.style.display="flex",e.innerHTML=`
          <i class="fa-solid fa-layer-group"></i>
          <p>Opción "Todos los departamentos" seleccionada</p>
          <p class="placeholder-hint">Usa el botón "Descargar Todos (ZIP)" para obtener todos los mapas, o selecciona "JSON Todos los Departamentos" en el selector de código</p>
        `);return}if(e&&(e.style.display="none"),l.isAllDepartments=!1,this.hideDownloadAllButton(),this.hideJsonAllOption(),!l.allData.departamentos)return;const o=l.allData.departamentos.features.filter(s=>s.properties.DPTO_CCDGO===t);this.mapRenderer.renderMapa(o),this.mapRenderer.renderMunicipios(t),l.displayOption==="map+labels"?this.mapRenderer.renderEtiquetas(o):l.displayOption==="map+points"&&this.mapRenderer.renderPuntos(o),this.codeViewer.updateSVGCode(),this.codeViewer.updateJSONCode(),this.enableButtons();const a=document.getElementById("code-type-select");a&&a.value==="json"?this.codeViewer.generateJSONOnDemand("departamento",!0):a&&a.value==="json-all"&&this.codeViewer.generateJSONOnDemand("all",!0)}enableButtons(){document.getElementById("btn-descargar").disabled=!1,document.getElementById("btn-copiar").disabled=!1,document.getElementById("btn-descargar-code").disabled=!1,document.getElementById("btn-descargar-json").disabled=!1,document.getElementById("btn-descargar-json-all").disabled=!1}disableButtons(){document.getElementById("btn-descargar").disabled=!0,document.getElementById("btn-copiar").disabled=!0,document.getElementById("btn-descargar-code").disabled=!0,document.getElementById("btn-descargar-json").disabled=!0,document.getElementById("btn-descargar-json-all").disabled=!0}showDownloadAllButton(){document.getElementById("btn-descargar").style.display="none",document.getElementById("btn-copiar").style.display="none",document.getElementById("btn-descargar-todos").style.display="inline-block"}hideDownloadAllButton(){document.getElementById("btn-descargar").style.display="inline-block",document.getElementById("btn-copiar").style.display="inline-block",document.getElementById("btn-descargar-todos").style.display="none"}showJsonAllOption(){const t=document.querySelector('#code-type-select option[value="json-all"]');t&&(t.style.display="block")}hideJsonAllOption(){const t=document.querySelector('#code-type-select option[value="json-all"]'),e=document.getElementById("code-type-select");t&&(t.style.display="none"),e&&e.value==="json-all"&&(e.value="svg",this.switchCodeDisplay("svg"))}updateURL(t){if(!t||t==="ALL"){window.location.hash&&history.pushState(null,"",window.location.pathname);return}const e=r.departmentCodes.find(o=>o.code===t);if(e){const o=this.createSlug(e.name);history.pushState(null,"",`#${o}`)}}loadFromURL(){const t=window.location.hash.slice(1);if(!t)return;const e=r.departmentCodes.find(o=>this.createSlug(o.name)===t);if(e){const o=document.getElementById("departamento");o.value=e.code,this.handleDepartmentChange(e.code)}}createSlug(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-")}downloadJSON(t,e){if(!t){u("Error: No hay datos JSON para descargar","error");return}const o=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(o),s=document.createElement("a");s.href=a,s.download=e,s.click(),URL.revokeObjectURL(a),u("JSON descargado exitosamente")}switchCodeDisplay(t){const e=document.getElementById("code-display"),o=document.getElementById("json-display"),a=document.getElementById("json-all-display");e&&(e.style.display="none"),o&&(o.style.display="none"),a&&(a.style.display="none"),t==="svg"?e&&(e.style.display="block"):t==="json"?o&&(o.style.display="block"):t==="json-all"&&a&&(a.style.display="block"),this.updateSizeInfoForCurrentDisplay(t)}updateSizeInfoForCurrentDisplay(t){const e=document.querySelector(".svg-size-info");if(!e)return;let o="";if(t==="svg"){const a=document.getElementById("code-display");if(a&&!a.querySelector(".code-placeholder")){const n=this.codeViewer.getCurrentSVGCode();o=`<span class="size-value">${g(n)}</span>`}else o='<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>'}else if(t==="json"){const a=document.getElementById("json-display");if(a&&!a.querySelector(".code-placeholder")){const n=this.codeViewer.getCurrentJSONCode();o=`<span class="size-value">${g(n)}</span>`}else o='<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>'}else if(t==="json-all"){const a=document.getElementById("json-all-display");if(a&&!a.querySelector(".code-placeholder")){const n=this.codeViewer.getCurrentAllJSONCode();o=`<span class="size-value">${g(n)}</span>`}else o='<span class="size-placeholder"><i class="fa-solid fa-circle-info"></i> Sin selección</span>'}e.innerHTML=o}}const M=new V;M.init();
//# sourceMappingURL=index-BTuOQ0aA.js.map
