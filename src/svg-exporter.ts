import * as d3 from 'd3';
import JSZip from 'jszip';
import type { GeoJSONFeature } from './types';
import { CONFIG, STATE } from './config';
import { showNotification } from './utils';

export class SVGExporter {
  private projection: d3.GeoProjection;
  private path: d3.GeoPath;

  constructor() {
    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);
  }

  prepareSVGForExport(svg: SVGSVGElement, includeLabels: boolean, includePoints: boolean): string {
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

    // Remove labels if not needed
    if (!includeLabels) {
      clonedSvg.querySelectorAll('.etiquetas').forEach(el => el.remove());
    }

    // Make points invisible in export
    if (includePoints) {
      clonedSvg.querySelectorAll('.punto').forEach(el => {
        (el as SVGElement).style.opacity = '0';
      });
    } else {
      clonedSvg.querySelectorAll('.puntos').forEach(el => el.remove());
    }

    // Apply inline styles
    this.applyStylesToSVG(clonedSvg);

    const bounds = clonedSvg.getBBox();
    const viewBox = `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`;
    clonedSvg.setAttribute('viewBox', viewBox);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.removeAttribute('width');
    clonedSvg.removeAttribute('height');

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
  }

  private applyStylesToSVG(svg: SVGSVGElement): void {
    svg.querySelectorAll('.departamento').forEach(el => {
      (el as SVGElement).style.fill = CONFIG.colors.fill;
      (el as SVGElement).style.stroke = CONFIG.colors.stroke;
      (el as SVGElement).style.strokeWidth = CONFIG.colors.strokeWidth;
    });

    svg.querySelectorAll('.municipio').forEach(el => {
      (el as SVGElement).style.fill = 'none';
      (el as SVGElement).style.stroke = CONFIG.colors.stroke;
      (el as SVGElement).style.strokeWidth = '0.3';
      (el as SVGElement).style.opacity = '0.5';
    });

    svg.querySelectorAll('.etiqueta').forEach(el => {
      (el as SVGElement).style.fontSize = '10px';
      (el as SVGElement).style.fill = '#333';
      (el as SVGElement).style.fontWeight = 'bold';
      (el as SVGElement).style.textAnchor = 'middle';
    });

    svg.querySelectorAll('.punto').forEach(el => {
      (el as SVGElement).style.fill = '#d32f2f';
      (el as SVGElement).style.stroke = CONFIG.colors.stroke;
      (el as SVGElement).style.strokeWidth = '1';
    });
  }

  generateSVGForDepartment(departmentCode: string): string {
    if (!STATE.allData.departamentos) return '';

    const features = STATE.allData.departamentos.features.filter(
      (f: any) => f.properties.DPTO_CCDGO === departmentCode
    );

    if (features.length === 0) return '';

    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.setAttribute('width', String(CONFIG.mapWidth));
    tempSvg.setAttribute('height', String(CONFIG.mapHeight));

    const featureCollection = {
      type: 'FeatureCollection',
      features: features
    };

    this.projection.fitSize([CONFIG.mapWidth, CONFIG.mapHeight], featureCollection as any);

    const mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mapGroup.setAttribute('class', 'municipios');

    features.forEach((feature, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'municipio');
      const municipioId = (feature.properties as any).MPIO_CCNCT || `municipio-${index}`;
      const municipioName = (feature.properties as any).MPIO_CNMBR || '';
      path.setAttribute('data-element-id', municipioId);
      path.setAttribute('name', municipioName);
      path.setAttribute('d', this.path(feature as any) || '');
      mapGroup.appendChild(path);
    });

    tempSvg.appendChild(mapGroup);

    if (STATE.displayOption === 'map+labels') {
      this.addEtiquetasToTempSVG(tempSvg, features);
    } else if (STATE.displayOption === 'map+points') {
      this.addPuntosToTempSVG(tempSvg, features);
    }

    return this.prepareSVGForExport(tempSvg, STATE.displayOption === 'map+labels', STATE.displayOption === 'map+points');
  }

  private addEtiquetasToTempSVG(svg: SVGSVGElement, features: GeoJSONFeature[]): void {
    const etiquetasGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    etiquetasGroup.setAttribute('class', 'etiquetas');

    features.forEach((feature, index) => {
      const centroid = this.path.centroid(feature as any);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'etiqueta');
      const municipioId = (feature.properties as any).MPIO_CCNCT || `etiqueta-${index}`;
      const municipioName = (feature.properties as any).MPIO_CNMBR || '';
      text.setAttribute('data-element-id', municipioId);
      text.setAttribute('name', municipioName);
      text.setAttribute('x', String(centroid[0]));
      text.setAttribute('y', String(centroid[1]));
      text.textContent = municipioName;
      etiquetasGroup.appendChild(text);
    });

    svg.appendChild(etiquetasGroup);
  }

  private addPuntosToTempSVG(svg: SVGSVGElement, features: GeoJSONFeature[]): void {
    const puntosGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    puntosGroup.setAttribute('class', 'puntos');

    features.forEach((feature, index) => {
      const centroid = this.path.centroid(feature as any);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'punto');
      const municipioId = (feature.properties as any).MPIO_CCNCT || `punto-${index}`;
      const municipioName = (feature.properties as any).MPIO_CNMBR || '';
      circle.setAttribute('data-element-id', municipioId);
      circle.setAttribute('name', municipioName);
      circle.setAttribute('cx', String(centroid[0]));
      circle.setAttribute('cy', String(centroid[1]));
      circle.setAttribute('r', '3');
      puntosGroup.appendChild(circle);
    });

    svg.appendChild(puntosGroup);
  }

  async downloadAllDepartments(): Promise<void> {
    const zip = new JSZip();
    
    for (const dept of CONFIG.departmentCodes) {
      const svgContent = this.generateSVGForDepartment(dept.code);
      if (svgContent) {
        zip.file(`${dept.name}.svg`, svgContent);
      }
    }

    const blob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'departamentos-colombia.zip';
    a.click();
    URL.revokeObjectURL(url);

    showNotification('ZIP descargado exitosamente');
  }

  downloadSingleDepartment(departmentCode: string, departmentName: string): void {
    const svgContent = this.generateSVGForDepartment(departmentCode);
    
    if (!svgContent) {
      showNotification('Error al generar SVG', 'error');
      return;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${departmentName}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('SVG descargado exitosamente');
  }
}
