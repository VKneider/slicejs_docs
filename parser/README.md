<div align="center">
  <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Slice.js logo" width="120" />
  <h3>Slice.js Markdown Parser</h3>
  <p>Convierte archivos markdown en componentes Slice.js para el sitio de documentación</p>
</div>

## Sobre este módulo

Este parser convierte los archivos markdown de `markdown/` en componentes Slice.js dentro de `src/Components/AppComponents/`. También genera el índice de documentos (`docsIndex.js`) y un reporte de componentes generados.

## Uso

```bash
node parser/index.js
```

Esto procesa todos los archivos `.md` en `markdown/` (incluyendo subdirectorios) y:
- Genera archivos HTML, JS y CSS por cada documento en `src/Components/AppComponents/`
- Actualiza `src/Components/AppComponents/DocumentationPage/docsIndex.js`
- Escribe un reporte en `parser/report.json`

## Formato de archivos markdown

Cada archivo markdown debe incluir frontmatter YAML:

```yaml
---
title: Título
route: /Documentation/Ruta
component: NombreComponente
generate: true
---
```

Los archivos con `generate: false` son skipeados por el parser.

## Bloques especiales

El parser soporta bloques personalizados dentro del markdown:

| Bloque | Sintaxis | Descripción |
|--------|----------|-------------|
| Código | ```` ```lenguaje ```` | Renderizado con CodeVisualizer |
| Detalles | `:::details title="Título"` | Acordeón expandible |
| Tips | `:::tip` | Caja de información |
| Advertencias | `:::warning` | Caja de advertencia |
| Pasos | `:::steps` | Lista numerada con estilo |
| Componente | `:::component name="MiComp"` | Embed de componente Slice.js |
| HTML | `:::html` | HTML directo |
| Script | `:::script` | JavaScript ejecutable |
| Tablas | tablas markdown | Renderizado con componente Table |
| Título | `:::title` | Título de página |

## Tests

```bash
node --test parser/tests/
```

## Estructura

```
parser/
├── index.js              # Entry point
├── lib/
│   ├── markdownParser.js # Parseo de markdown → bloques
│   ├── generator.js      # Generación de archivos componente
│   ├── docsIndex.js      # Generación del índice de documentos
│   └── report.js         # Reporte de componentes candidatos
├── tests/                # Tests del parser
└── report.json           # Último reporte generado
```
