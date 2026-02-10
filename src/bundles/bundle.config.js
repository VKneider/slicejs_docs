/**
 * Slice.js Bundle Configuration
 * Generated: 2026-02-10T00:22:47.896Z
 * Strategy: hybrid
 */

// Direct bundle configuration (no fetch required)
export const SLICE_BUNDLE_CONFIG = {
  "version": "2.0.0",
  "strategy": "hybrid",
  "generated": "2026-02-10T00:22:47.895Z",
  "stats": {
    "totalComponents": 74,
    "totalRoutes": 44,
    "sharedComponents": 1,
    "sharedPercentage": "5.4",
    "totalSize": 2388489,
    "criticalSize": 1174
  },
  "bundles": {
    "critical": {
      "file": "slice-bundle.critical.js",
      "size": 1174,
      "components": [
        "Layout"
      ]
    },
    "routes": {
      "multiroute-DocumentationPage": {
        "path": [
          "/Documentation",
          "/Components"
        ],
        "file": "slice-bundle.multiroute-documentationpage.js",
        "size": 1542471,
        "components": [
          "DocumentationPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "ThemeSelector",
          "MultiRoute",
          "TreeView",
          "TreeItem",
          "InputSearchDocs",
          "MainMenu",
          "MyNavigation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "home": {
        "path": [
          "/"
        ],
        "file": "slice-bundle.home.js",
        "size": 1496932,
        "components": [
          "LandingPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "ThemeSelector",
          "LandingMenu"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "configuration": {
        "path": [
          "/Slice",
          "/SliceConfig",
          "/Themes",
          "/Slice-Styles",
          "/ThemeCreator"
        ],
        "file": "slice-bundle.configuration.js",
        "size": 1680578,
        "components": [
          "WhatIsSlice",
          "SliceConfigDocumentation",
          "CodeVisualizer",
          "Table",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "ThemesDocumentation",
          "Grid",
          "SliceStylesDocumentation",
          "ThemeCreator",
          "Navbar",
          "Link",
          "DropDown",
          "ThemeSelector",
          "Input",
          "Checkbox",
          "Switch"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "services": {
        "path": [
          "/Commands",
          "/Service"
        ],
        "file": "slice-bundle.services.js",
        "size": 1563110,
        "components": [
          "CommandsDocumentation",
          "CodeVisualizer",
          "Table",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "ServiceDocumentation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "general": {
        "path": [
          "/CLI",
          "/Installation",
          "/DropDown"
        ],
        "file": "slice-bundle.general.js",
        "size": 1548104,
        "components": [
          "CommandsDocumentation",
          "CodeVisualizer",
          "Table",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "Installation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "components": {
        "path": [
          "/Visual",
          "/Card",
          "/Button",
          "/Switch",
          "/Checkbox",
          "/Input",
          "/MultiRoute",
          "/Layout",
          "/Loading",
          "/Details",
          "/TreeView",
          "/Grid",
          "/NavBar",
          "/Select"
        ],
        "file": "slice-bundle.components.js",
        "size": 1820510,
        "components": [
          "VisualDocumentation",
          "CodeVisualizer",
          "Table",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "CardDocumentation",
          "Card",
          "ButtonDocumentation",
          "Grid",
          "SwitchDocumentation",
          "Switch",
          "CheckboxDocumentation",
          "Checkbox",
          "InputDocumentation",
          "Input",
          "MultiRouteDocumentation",
          "LayoutDocumentation",
          "Navbar",
          "Link",
          "DropDown",
          "LoadingDocumentation",
          "Loading",
          "DetailsDocumentation",
          "Details",
          "TreeViewDocumentation",
          "TreeView",
          "TreeItem",
          "GridDocumentation",
          "NavBarDocumentation",
          "SelectDocumentation",
          "Select"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "advanced": {
        "path": [
          "/Structural",
          "/Structural/EventManager",
          "/Structural/ContextManager",
          "/Structural/Logger",
          "/The-build-method",
          "/Static-Props",
          "/LifeCycle-Methods",
          "/LifeCycle-Methods/init",
          "/LifeCycle-Methods/update",
          "/LifeCycle-Methods/beforeDestroy"
        ],
        "file": "slice-bundle.advanced.js",
        "size": 1640155,
        "components": [
          "StructuralDocumentation",
          "Table",
          "CodeVisualizer",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "EventManagerDocumentation",
          "Details",
          "ContextManagerDocumentation",
          "LoggerDocumentation",
          "TheBuildMethod",
          "StaticPropsDocumentation",
          "LifeCycleMethods",
          "InitMethodDocumentation",
          "UpdateMethodDocumentation",
          "BeforeDestroyDocumentation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "routing": {
        "path": [
          "/Routing",
          "/Routing/Guards"
        ],
        "file": "slice-bundle.routing.js",
        "size": 1527348,
        "components": [
          "RoutingDocumentation",
          "Table",
          "CodeVisualizer",
          "CopyMarkdownMenu",
          "Button",
          "Icon",
          "RouterGuardsDocumentation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "tools": {
        "path": [
          "/Playground"
        ],
        "file": "slice-bundle.tools.js",
        "size": 1554859,
        "components": [
          "Playground",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "ThemeSelector",
          "Input",
          "Checkbox",
          "Switch",
          "Select",
          "Card",
          "Details"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "misc": {
        "path": [
          "/404",
          "/About",
          "/about"
        ],
        "file": "slice-bundle.misc.js",
        "size": 1510259,
        "components": [
          "NotFound",
          "TheSliceTeam",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "ThemeSelector",
          "SliceTeamCard"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "documentation": {
        "path": [
          "/Docum/${category}/${id}"
        ],
        "file": "slice-bundle.documentation.js",
        "size": 1496932,
        "components": [
          "LandingPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "ThemeSelector",
          "LandingMenu"
        ],
        "dependencies": [
          "critical"
        ]
      }
    }
  }
};

// Auto-initialization if slice is available
if (typeof window !== 'undefined' && window.slice && window.slice.controller) {
  window.slice.controller.bundleConfig = SLICE_BUNDLE_CONFIG;

  // Load critical bundle automatically
  if (SLICE_BUNDLE_CONFIG.bundles.critical && !window.slice.controller.criticalBundleLoaded) {
    import('./slice-bundle.critical.js').catch(err =>
      console.warn('Failed to load critical bundle:', err)
    );
    window.slice.controller.criticalBundleLoaded = true;
  }
}
