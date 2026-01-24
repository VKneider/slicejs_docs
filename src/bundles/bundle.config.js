/**
 * Slice.js Bundle Configuration
 * Generated: 2026-01-24T05:38:19.280Z
 * Strategy: hybrid
 */

// Direct bundle configuration (no fetch required)
export const SLICE_BUNDLE_CONFIG = {
  "version": "2.0.0",
  "strategy": "hybrid",
  "generated": "2026-01-24T05:38:19.278Z",
  "stats": {
    "totalComponents": 62,
    "totalRoutes": 36,
    "sharedComponents": 1,
    "sharedPercentage": "4.8",
    "totalSize": 2202696,
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
        "size": 1507425,
        "components": [
          "DocumentationPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
          "MultiRoute",
          "TreeView",
          "TreeItem",
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
        "size": 1483535,
        "components": [
          "LandingPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
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
          "/ThemeCreator"
        ],
        "file": "slice-bundle.configuration.js",
        "size": 1632921,
        "components": [
          "WhatIsSlice",
          "SliceConfigDocumentation",
          "CodeVisualizer",
          "Details",
          "ThemesDocumentation",
          "Grid",
          "Button",
          "Icon",
          "ThemeCreator",
          "Navbar",
          "Link",
          "DropDown",
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
        "size": 51439,
        "components": [
          "CommandsDocumentation",
          "CodeVisualizer",
          "Details",
          "ServiceDocumentation"
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
        "size": 1827951,
        "components": [
          "VisualDocumentation",
          "CodeVisualizer",
          "Details",
          "CardDocumentation",
          "Card",
          "Icon",
          "Button",
          "ButtonDocumentation",
          "Grid",
          "SwitchDocumentation",
          "Switch",
          "CheckboxDocumentation",
          "Checkbox",
          "InputDocumentation",
          "Input",
          "MultiRouteDocumentation",
          "MultiRoute",
          "LayoutDocumentation",
          "Navbar",
          "Link",
          "DropDown",
          "LoadingDocumentation",
          "Loading",
          "DetailsDocumentation",
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
          "/The-build-method",
          "/Static-Props",
          "/LifeCycle-Methods"
        ],
        "file": "slice-bundle.advanced.js",
        "size": 1585786,
        "components": [
          "StructuralDocumentation",
          "CodeVisualizer",
          "Details",
          "TheBuildMethod",
          "StaticPropsDocumentation",
          "Card",
          "Icon",
          "Button",
          "LifeCycleMethods"
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
        "size": 66347,
        "components": [
          "RoutingDocumentation",
          "CodeVisualizer",
          "Details",
          "RouterGuardsDocumentation"
        ],
        "dependencies": [
          "critical"
        ]
      },
      "general": {
        "path": [
          "/Installation",
          "/DropDown"
        ],
        "file": "slice-bundle.general.js",
        "size": 10027,
        "components": [
          "Installation"
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
        "size": 1542171,
        "components": [
          "Playground",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
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
        "size": 1497170,
        "components": [
          "NotFound",
          "TheSliceTeam",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
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
        "size": 1483535,
        "components": [
          "LandingPage",
          "Navbar",
          "Link",
          "DropDown",
          "Button",
          "Icon",
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
