/**
 * Slice.js Bundle Configuration
 * Generated: 2026-02-02T06:53:10.650Z
 * Strategy: hybrid
 */

// Direct bundle configuration (no fetch required)
export const SLICE_BUNDLE_CONFIG = {
  "version": "2.0.0",
  "strategy": "hybrid",
  "generated": "2026-02-02T06:53:10.649Z",
  "stats": {
    "totalComponents": 70,
    "totalRoutes": 41,
    "sharedComponents": 1,
    "sharedPercentage": "4.3",
    "totalSize": 2277371,
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
        "size": 1525891,
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
        "size": 1649365,
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
        "size": 1552723,
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
        "size": 1810202,
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
          "/The-build-method",
          "/Static-Props",
          "/LifeCycle-Methods",
          "/LifeCycle-Methods/init",
          "/LifeCycle-Methods/update",
          "/LifeCycle-Methods/beforeDestroy"
        ],
        "file": "slice-bundle.advanced.js",
        "size": 1597293,
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
        "size": 1522577,
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
          "/About",
          "/about"
        ],
        "file": "slice-bundle.misc.js",
        "size": 1497288,
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
