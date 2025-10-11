# 🗺️ Generador de Mapas SVG - Departamentos de Colombia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg)](https://vitejs.dev/)
[![D3.js](https://img.shields.io/badge/D3.js-7.9-orange.svg)](https://d3js.org/)

Herramienta web para generar y descargar mapas vectoriales SVG de los 32 departamentos de Colombia con sus municipios y el distrito capital. Utiliza datos oficiales del DANE 2018.

🔗 **Demo**: [https://hrevueltas.github.io/departamentos-colombia-svg/](https://hrevueltas.github.io/departamentos-colombia-svg/)

## ¿Qué hace?

Genera mapas SVG editables de cualquier departamento colombiano con tres opciones de visualización:
- **Solo mapa**: Contornos de municipios
- **Mapa + etiquetas**: Con nombres de municipios
- **Mapa + puntos**: Con marcadores centrales

Permite descargar mapas individuales o todos los departamentos en un archivo ZIP.


## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```


## Tecnologías

- **Vite** + **TypeScript** - Base del proyecto
- **D3.js** - Proyecciones geográficas y renderizado SVG
- **JSZip** - Generación de archivos ZIP


## Licencia

- **Código**: MIT License
- **Datos geográficos**: Dominio público (DANE Colombia)

Ver archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Créditos

- **[Hrevueltas](https://github.com/Hrevueltas)** - Desarrollo y diseño de la aplicación
- **DANE Colombia** - Datos geográficos oficiales
- **[caticoa3](https://github.com/caticoa3)** - Procesamiento y conversión a GeoJSON
- **D3.js Team** - Librería de visualización
- **Vite Team** - Build tool moderno
---

Hecho con ❤️ por [Hrevueltas](https://github.com/Hrevueltas) 
