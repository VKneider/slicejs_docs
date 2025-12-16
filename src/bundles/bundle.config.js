/**
 * Slice.js Bundle Configuration
 * Generated: 2025-12-16T04:19:20.331Z
 * Strategy: hybrid
 */

// Direct bundle configuration (no fetch required)
export const SLICE_BUNDLE_CONFIG = {
  "version": "2.0.0",
  "strategy": "hybrid",
  "generated": "2025-12-16T04:19:20.330Z",
  "stats": {
    "totalComponents": 62,
    "totalRoutes": 35,
    "sharedComponents": 1,
    "sharedPercentage": "3.2",
    "totalSize": 2235866,
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
      "documentation": {
        "path": [
          "/Documentation",
          "/Docum/${category}/${id}"
        ],
        "file": "slice-bundle.documentation.js",
        "size": 1517710,
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
          "MyNavigation",
          "LandingPage",
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
        "size": 1633716,
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
        "size": 72843,
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
          "/Components",
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
        "size": 1853111,
        "components": [
          "VisualDocumentation",
          "CodeVisualizer",
          "Details",
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
          "MyNavigation",
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
          "LoadingDocumentation",
          "Loading",
          "DetailsDocumentation",
          "TreeViewDocumentation",
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
        "size": 1586718,
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
        "size": 67199,
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
        "size": 10096,
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
          "/About"
        ],
        "file": "slice-bundle.misc.js",
        "size": 1496932,
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
