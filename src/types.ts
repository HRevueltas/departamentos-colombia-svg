// Type definitions for GeoJSON data structures

export interface DepartmentProperties {
  DPTO: string;
  NOMBRE_DPT: string;
  [key: string]: any;
}

export interface MunicipioProperties {
  DPTO_CCDGO: string;
  MPIO_CCDGO: string;
  MPIO_CNMBR: string;
  [key: string]: any;
}

export interface GeoJSONFeature {
  type: string;
  properties: DepartmentProperties | MunicipioProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONCollection {
  type: string;
  features: GeoJSONFeature[];
}

export interface DepartmentCode {
  code: string;
  name: string;
}

export type DisplayOption = 'map' | 'map+labels' | 'map+points';

export interface AppState {
  currentFeatures: GeoJSONFeature[];
  allData: {
    departamentos: GeoJSONCollection | null;
    municipios: GeoJSONCollection | null;
  };
  displayOption: DisplayOption;
  isAllDepartments: boolean;
  jsonGenerated: {
    departamento: boolean;
    all: boolean;
  };
}
