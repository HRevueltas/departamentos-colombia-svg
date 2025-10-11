import * as d3 from 'd3';
import type { GeoJSONFeature, DisplayOption } from './types';
import { CONFIG, STATE } from './config';
import { escapeSelectorId } from './utils';

export class MapRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private projection: d3.GeoProjection;
  private path: d3.GeoPath;
  private zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private g: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null;

  constructor(containerId: string) {
    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('id', 'mapa-svg')
      .attr('viewBox', `0 0 ${CONFIG.mapWidth} ${CONFIG.mapHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%')
      .style('max-width', '100%')
      .style('max-height', '100%');

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);
    
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        if (this.g) {
          this.g.attr('transform', event.transform);
        }
      });
    
    this.svg.call(this.zoom);
  }

  renderMapa(features: GeoJSONFeature[]): void {
    this.svg.selectAll('*').remove();
    STATE.currentFeatures = features;

    if (features.length === 0) return;

    const featureCollection = {
      type: 'FeatureCollection',
      features: features
    };

    this.projection.fitSize([CONFIG.mapWidth, CONFIG.mapHeight], featureCollection as any);

  
    this.g = this.svg.append('g').attr('class', 'zoom-group');
    
    const mapGroup = this.g.append('g').attr('class', 'municipios');

    mapGroup.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'municipio')
      .attr('data-element-id', (d: any, i: number) => d.properties.MPIO_CCNCT || `municipio-${i}`)
      .attr('name', (d: any) => d.properties.MPIO_CNMBR || '')
      .attr('fill', CONFIG.colors.fill)
      .attr('stroke', CONFIG.colors.stroke)
      .attr('stroke-width', CONFIG.colors.strokeWidth)
      .attr('d', this.path as any);
    

    this.svg.call(this.zoom.transform, d3.zoomIdentity);
  }

  renderMunicipios(departmentCode: string): void {
    if (!STATE.allData.municipios) return;

    const municipios = STATE.allData.municipios.features.filter(
      (f: any) => f.properties.DPTO_CCDGO === departmentCode
    );

    if (municipios.length === 0) return;

    this.svg.selectAll('.departamento')
      .attr('stroke-width', '0.3')
      .attr('stroke-opacity', '0.5');
  }

  renderEtiquetas(features: GeoJSONFeature[]): void {
    if (!this.g) return;
    
    const etiquetasGroup = this.g.append('g').attr('class', 'etiquetas');

    etiquetasGroup.selectAll('text')
      .data(features)
      .enter()
      .append('text')
      .attr('class', 'etiqueta')
      .attr('data-element-id', (d: any, i: number) => d.properties.MPIO_CCNCT || `etiqueta-${i}`)
      .attr('name', (d: any) => d.properties.MPIO_CNMBR || '')
      .attr('x', (d: any) => {
        const centroid = this.path.centroid(d);
        return centroid[0];
      })
      .attr('y', (d: any) => {
        const centroid = this.path.centroid(d);
        return centroid[1];
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text((d: any) => d.properties.MPIO_CNMBR || '');
  }

  renderPuntos(features: GeoJSONFeature[]): void {
    if (!this.g) return;
    
    const puntosGroup = this.g.append('g').attr('class', 'puntos');

    puntosGroup.selectAll('circle')
      .data(features)
      .enter()
      .append('circle')
      .attr('class', 'punto')
      .attr('data-element-id', (d: any, i: number) => d.properties.MPIO_CCNCT || `punto-${i}`)
      .attr('name', (d: any) => d.properties.MPIO_CNMBR || '')
      .attr('cx', (d: any) => {
        const centroid = this.path.centroid(d);
        return centroid[0];
      })
      .attr('cy', (d: any) => {
        const centroid = this.path.centroid(d);
        return centroid[1];
      })
      .attr('r', 3)
      .attr('fill', '#d32f2f')
      .attr('stroke', CONFIG.colors.stroke)
      .attr('stroke-width', '1');
  }

  updateDisplayOption(option: DisplayOption): void {
    STATE.displayOption = option;

    this.svg.selectAll('.etiquetas').remove();
    this.svg.selectAll('.puntos').remove();

    if (option === 'map+labels') {
      this.renderEtiquetas(STATE.currentFeatures);
    } else if (option === 'map+points') {
      this.renderPuntos(STATE.currentFeatures);
    }
  }

  highlightElement(elementId: string): void {
    const escapedId = escapeSelectorId(elementId);
    this.svg.select(`[data-id="${escapedId}"]`)
      .attr('stroke', '#ff9800')
      .attr('stroke-width', '2');
  }

  unhighlightElement(elementId: string): void {
    const escapedId = escapeSelectorId(elementId);
    this.svg.select(`[data-id="${escapedId}"]`)
      .attr('stroke', CONFIG.colors.stroke)
      .attr('stroke-width', CONFIG.colors.strokeWidth);
  }

  getSVGElement(): SVGSVGElement {
    return this.svg.node() as SVGSVGElement;
  }

  clearMap(): void {
    this.svg.selectAll('*').remove();
    STATE.currentFeatures = [];
  }
  
  zoomIn(): void {
    this.svg.transition().duration(300).call(this.zoom.scaleBy, 1.5);
  }
  
  zoomOut(): void {
    this.svg.transition().duration(300).call(this.zoom.scaleBy, 0.67);
  }
  
  resetZoom(): void {
    this.svg.transition().duration(300).call(this.zoom.transform, d3.zoomIdentity);
  }
}
