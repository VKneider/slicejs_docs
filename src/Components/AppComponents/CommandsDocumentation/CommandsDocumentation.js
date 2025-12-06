export default class CommandsDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Installation examples
      const installLocalCode = await slice.build('CodeVisualizer', {
         value: `npm install slicejs-cli --save-dev`,
         language: 'bash'
      });

      const installGlobalCode = await slice.build('CodeVisualizer', {
         value: `npm install -g slicejs-cli`,
         language: 'bash'
      });

      this.querySelector('.install-code').appendChild(installLocalCode);
      this.querySelector('.install-global-code').appendChild(installGlobalCode);

      // Project Lifecycle Commands
      const initExample = await slice.build('CodeVisualizer', {
         value: `# Initialize a new Slice.js project
slice init

# The command will:
# - Set up folder structure (src/ and api/)
# - Install initial Visual components from official repository
# - Configure npm scripts in package.json
# - Set up basic dependencies`,
         language: 'bash'
      });

      const devExample = await slice.build('CodeVisualizer', {
         value: `# Start development server (default port 3000)
slice dev

# Or with a custom port
slice dev -p 8080
slice dev --port 8080

# Alternative command (alias)
slice start
slice start -p 8080

# The server will:
# - Serve your application from /src directory
# - Enable live reload
# - Provide API access at /api

# Options:
# -p, --port <number>    Specify custom port (default: 3000)`,
         language: 'bash'
      });

      // Local Component Management
      const createExample = await slice.build('CodeVisualizer', {
         value: `# Create a new local component (interactive mode)
slice component create

# Short alias
slice comp create

# The CLI will prompt for:
# - Component name
# - Component category (Visual, Service, AppComponents)
# - Properties (for Visual components)

# Files automatically generated:
# - JavaScript file with component class
# - HTML template file (for Visual components)
# - CSS stylesheet file (for Visual components)

# Example structure for a Visual component:
# src/Components/Visual/MyComponent/
#   ├── MyComponent.js
#   ├── MyComponent.html
#   └── MyComponent.css`,
         language: 'bash'
      });

      const listExample = await slice.build('CodeVisualizer', {
         value: `# List all local components
slice component list

# Short aliases
slice comp ls
slice list           # Top-level shortcut

# Output shows:
# - Components organized by category (Visual, Service, AppComponents)
# - File paths for each component
# - Component types and structure

# Example output:
# Visual Components:
#   • Button → src/Components/Visual/Button
#   • Card → src/Components/Visual/Card
# 
# Service Components:
#   • FetchManager → src/Components/Service/FetchManager
# 
# AppComponents:
#   • HeaderComponent → src/Components/AppComponents/HeaderComponent`,
         language: 'bash'
      });

      const deleteExample = await slice.build('CodeVisualizer', {
         value: `# Delete a local component (interactive mode)
slice component delete

# Short alias
slice comp remove

# The CLI will:
# - Display a list of available components
# - Allow selection of component to delete
# - Request confirmation before deletion
# - Remove all related files (JS, HTML, CSS)

# Warning: This action is irreversible!
# Make sure to backup components before deletion if needed`,
         language: 'bash'
      });

      // Registry Component Management
      const getExample = await slice.build('CodeVisualizer', {
         value: `# Install Visual components from official repository
slice get Button Card Input

# Install a Service component
slice get FetchManager --service
slice get FetchManager -s

# Force overwrite existing components
slice get Button --force
slice get Button -f

# Long form (using registry command group)
slice registry get Button Card

# Interactive mode (no component names)
slice get
# This will launch an interactive selector

# Available options:
# -f, --force     Force overwrite existing components
# -s, --service   Install as Service instead of Visual

# The command will:
# - Download components from official repository
# - Install in correct category directory
# - Preserve local modifications (without --force)
# - Show installation progress and results`,
         language: 'bash'
      });

      const browseExample = await slice.build('CodeVisualizer', {
         value: `# Browse available components in the repository
slice browse

# Alternative command
slice registry list
slice registry ls

# The command displays:
# - Complete list of official components
# - Categories and file types
# - Installation examples for each component
# - Component descriptions

# Example output shows:
# Visual Components:
#   • Button
#   • Card
#   • Input
#   • Modal
#   ... and more
# 
# Service Components:
#   • FetchManager
#   • StateManager
#   ... and more`,
         language: 'bash'
      });

      const syncExample = await slice.build('CodeVisualizer', {
         value: `# Sync local components with repository versions
slice sync

# Force update all components without confirmation
slice sync --force
slice sync -f

# Alternative command (using registry group)
slice registry sync
slice registry sync --force

# The command will:
# - Detect components installed from official repository
# - Compare local versions with repository versions
# - Update to latest available versions
# - Preserve local modifications (without --force)
# - Show update progress and results

# Options:
# -f, --force    Force update without confirmation prompts`,
         language: 'bash'
      });

      // Maintenance Commands
      const versionExample = await slice.build('CodeVisualizer', {
         value: `# Display current CLI version
slice version
slice -v

# Output example:
# Slice.js CLI v1.2.3`,
         language: 'bash'
      });

      const updateExample = await slice.build('CodeVisualizer', {
         value: `# Check for and install available updates
slice update

# The command will:
# - Check for CLI updates
# - Check for framework updates
# - Display available updates
# - Prompt for confirmation before updating

# Automatic update (skip confirmation)
slice update --yes
slice update -y

# Update only the CLI
slice update --cli

# Update only the framework
slice update --framework
slice update -f

# Alternative command
slice upgrade

# The update process:
# 1. Detects current versions
# 2. Checks npm registry for latest versions
# 3. Shows available updates
# 4. Prompts for confirmation (unless --yes flag)
# 5. Installs selected updates
# 6. Verifies installation success`,
         language: 'bash'
      });

      const doctorExample = await slice.build('CodeVisualizer', {
         value: `# Run project diagnostics
slice doctor

# Alternative command
slice diagnose

# The doctor command checks:
# - Project folder structure (src/, api/, Components/)
# - Required directories and files
# - package.json configuration
# - Installed dependencies
# - Component integrity
# - Configuration files

# Example output:
# ✓ Project structure is correct
# ✓ All required directories exist
# ✓ package.json is properly configured
# ✓ Dependencies are installed
# ✓ Components are properly structured
# 
# Project health: GOOD

# If issues are found:
# ✗ Missing directory: src/Components/Visual
# ✗ package.json not found
# 
# The doctor will provide suggestions to fix issues`,
         language: 'bash'
      });

      const helpExample = await slice.build('CodeVisualizer', {
         value: `# Display comprehensive help
slice --help
slice help

# Get help for specific command
slice dev --help
slice component --help
slice registry --help

# The help output shows:
# - Available commands and options
# - Command descriptions
# - Usage examples
# - Command categories
# - Common workflows

# Example help sections:
# - Project Lifecycle: init, dev, start
# - Local Components: component create/list/delete
# - Registry Operations: get, browse, sync
# - Maintenance: version, update, doctor
# - Help: --help, help`,
         language: 'bash'
      });

      // Append code examples to their containers
      this.querySelector('.init-example').appendChild(initExample);
      this.querySelector('.dev-example').appendChild(devExample);
      this.querySelector('.create-example').appendChild(createExample);
      this.querySelector('.list-example').appendChild(listExample);
      this.querySelector('.delete-example').appendChild(deleteExample);
      this.querySelector('.get-example').appendChild(getExample);
      this.querySelector('.browse-example').appendChild(browseExample);
      this.querySelector('.sync-example').appendChild(syncExample);
      this.querySelector('.version-example').appendChild(versionExample);
      this.querySelector('.update-example').appendChild(updateExample);
      this.querySelector('.doctor-example').appendChild(doctorExample);
      this.querySelector('.help-example').appendChild(helpExample);

      // Complete workflow example
      const commandDemo = await slice.build('Details', {
         title: 'Complete CLI Workflow Example',
         text: 'Here is a typical workflow using all Slice.js CLI commands in a real development scenario.'
      });

      const demoContent = document.createElement('div');
      demoContent.classList.add('command-demo');

      const workflowExample = await slice.build('CodeVisualizer', {
         value: `# Step 1: Initialize your project
slice init

# Step 2: Start the development server
slice dev

# In another terminal...

# Step 3: Browse available components
slice browse

# Step 4: Install components from official repository
slice get Button Card Input Modal

# Step 5: Create custom components as needed
slice component create

# Step 6: List all local components
slice list

# Step 7: Run diagnostics to verify project health
slice doctor

# Step 8: Sync components to latest versions
slice sync

# Step 9: Check for CLI and framework updates
slice update

# Step 10: During development...
# The slice dev server remains running in first terminal
# Use second terminal for all other commands

# Step 11: Remove unused components (if needed)
slice component delete

# Step 12: Get help when needed
slice --help
slice component --help

# Additional useful commands:
# - slice version          Check current CLI version
# - slice get --service    Install Service components
# - slice sync --force     Force update all components`,
         language: 'bash'
      });

      demoContent.appendChild(workflowExample);
      commandDemo.addDetail(demoContent);
      this.querySelector('.command-workflow').appendChild(commandDemo);
   }
}

customElements.define('slice-commandsdocumentation', CommandsDocumentation);