<div align="center">
  <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Slice.js logo" width="150" />
  <h1>Slice.js Documentation</h1>
  <p>Comprehensive documentation site for the Slice.js web framework</p>
  <p>
    <a href="https://slice-js-docs.vercel.app/"><strong>View Live Documentation »</strong></a>
    <br />
    <a href="https://github.com/VKneider/slice.js">Framework Repository</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## Sobre este repositorio

Este repositorio contiene el sitio de documentación oficial de Slice.js. Está construido con el propio framework Slice.js e incluye guías, referencias de API, ejemplos interactivos y documentación de componentes visuales.

### Características
- **Ejemplos interactivos**: Ejemplos de código en vivo embebidos en la documentación
- **Cobertura completa**: Desde conceptos básicos hasta características avanzadas
- **Librería de componentes**: Referencia de componentes visuales con demos en vivo
- **Búsqueda**: Búsqueda de texto completo en toda la documentación
- **Diseño responsive**: Interfaz adaptable a dispositivos móviles

## Requisitos

- Node.js >= 20
- npm o pnpm

## Desarrollo local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/VKneider/slicejs_docs.git
   cd slicejs_docs
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir navegador**
   Navegar a `http://localhost:3000`

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `node parser/index.js` | Regenerar componentes desde markdown |
| `npm run slice:build` | Compilar para producción |

## Escribir documentación

La documentación se escribe en archivos markdown dentro de la carpeta `markdown/`.

### Formato de frontmatter

```yaml
---
title: Título de la página
route: /Documentation/Ruta
navLabel: Etiqueta
section: Sección
group: Grupo
order: 1
description: Descripción breve
component: NombreComponente
tags: [tag1, tag2]
generate: true
---
```

### Regenerar componentes

Después de crear o modificar archivos markdown, regenera los componentes:

```bash
node parser/index.js
```

Esto genera los archivos HTML, JS y CSS en `src/Components/AppComponents/` y actualiza el índice de documentos.

### Guía de markdown

Ver `markdown/markdown-guide.md` para la guía completa de sintaxis soportada, bloques especiales (`:::tip`, `:::warning`, `:::details`, `:::component`, `:::script`) y mejores prácticas.

## Servidor MCP

Slice.js provee un servidor MCP para acceso programático a la documentación:

```bash
npx slicejs-mcp
```

**Herramientas disponibles:**
- `list_docs`: Listar todas las secciones de documentación
- `search_docs`: Buscar documentación por palabras clave
- `get_doc_content`: Obtener páginas específicas
- `get_llm_full_context`: Obtener bundle completo de documentación

## Estructura del proyecto

```
slicejs_docs/
├── markdown/           # Fuentes en markdown de la documentación
├── parser/             # Parseador markdown → componentes Slice.js
│   ├── index.js        # Entry point del parser
│   └── lib/            # markdownParser, generator, docsIndex, report
├── src/                # Código fuente del sitio
│   ├── App/            # Configuración de la aplicación
│   ├── Components/     # Componentes visuales y de documentación
│   └── bundles/        # Configuración de bundles
└── api/                # API server
```

## Contribuir

Agradecemos contribuciones a la documentación de Slice.js. Ya sea corregir errores, agregar ejemplos o documentar nuevas características.

### Guías
- Sigue el [Markdown Guide](markdown/markdown-guide.md)
- Prueba los cambios localmente antes de enviar
- Usa lenguaje claro y conciso
- Incluye ejemplos de código cuando sea posible

## Licencia

Distribuido bajo licencia MIT. Ver `LICENSE` para más información.

## Contacto

Slice.js - [@VKneider](https://github.com/VKneider)

Project Link: [https://github.com/VKneider/slicejs_docs](https://github.com/VKneider/slicejs_docs)
