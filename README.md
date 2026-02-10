<!-- Improved compatibility of back to top link: See: https://github.com/VKneider/slice.js/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Slice.js Documentation. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/VKneider/slicejs_docs">
    <img src="https://raw.githubusercontent.com/VKneider/slicejs_docs/master/src/images/Slice.js-logo.svg" alt="Logo" width="150" height="150">
  </a>

  <h3 align="center">Slice.js Documentation</h3>

  <p align="center">
    Comprehensive documentation site for the Slice.js web framework
    <br />
    <a href="https://slice-js-docs.vercel.app/"><strong>View Live Documentation »</strong></a>
    <br />
    <br />
    <a href="https://slice-js-docs.vercel.app/">Live Demo</a>
    ·
    <a href="https://github.com/VKneider/slice.js">Framework Repository</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/VKneider/slicejs_docs/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#local-development">Local Development</a></li>
        <li><a href="#contributing-to-docs">Contributing to Docs</a></li>
      </ul>
    </li>
    <li><a href="#documentation-tools">Documentation Tools</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://slice-js-docs.vercel.app/)

This repository contains the comprehensive documentation site for [Slice.js](https://github.com/VKneider/slice.js), a component-based web development framework. The documentation is built using Slice.js itself and provides guides, API references, and examples for developers.

### Key Features
- **Interactive Examples**: Live code examples embedded in documentation
- **Comprehensive Coverage**: From basic concepts to advanced features
- **Component Library**: Visual component references with live demos
- **Searchable Content**: Full-text search across all documentation
- **Responsive Design**: Mobile-friendly documentation interface

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Basic knowledge of web development

### Local Development

1. **Clone the documentation repository**
   ```sh
   git clone https://github.com/VKneider/slicejs_docs.git
   cd slicejs_docs
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the documentation locally.

### Contributing to Docs

1. **Fork the repository** and create your feature branch
   ```sh
   git checkout -b feature/AmazingFeature
   ```

2. **Write documentation** in `markdown/` folder using the established format

3. **Add frontmatter** to new `.md` files:
   ```yaml
   ---
   title: Your Page Title
   route: /Documentation/Your-Path
   component: YourComponent
   ---
   ```

4. **Test locally** and ensure proper navigation

5. **Submit a pull request** with your changes

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- DOCUMENTATION TOOLS -->
## Documentation Tools

### MCP Server
Slice.js provides an MCP (Model Context Protocol) server for programmatic access to documentation:

```bash
npx slicejs-mcp
```

This allows AI assistants and tools to query, search, and retrieve Slice.js documentation seamlessly.

**Available Tools:**
- `list_docs`: List all documentation sections
- `search_docs`: Search documentation by keywords
- `get_doc_content`: Fetch specific documentation pages
- `get_llm_full_context`: Get complete documentation bundle

### Markdown Guide
Refer to `markdown/markdown-guide.md` for the complete guide on writing documentation files, including supported syntax, frontmatter format, and best practices.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Complete component library documentation
- [x] Interactive code examples
- [x] Mobile-responsive design
- [ ] Multi-language support
- [ ] Offline documentation bundle
- [ ] Video tutorials integration

See the [open issues](https://github.com/VKneider/slicejs_docs/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

We welcome contributions to the Slice.js documentation! Whether it's fixing typos, adding examples, or documenting new features, your help is appreciated.

### Types of Contributions
- **Content Updates**: Fix errors, improve clarity, add examples
- **New Documentation**: Document new features or components
- **Code Examples**: Add interactive examples to existing docs
- **UI Improvements**: Enhance the documentation site interface

### Guidelines
- Follow the [Markdown Guide](markdown/markdown-guide.md)
- Test changes locally before submitting
- Use clear, concise language
- Include code examples where applicable
- Update navigation if adding new sections

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Slice.js - [@VKneider](https://github.com/VKneider)

Project Link: [https://github.com/VKneider/slicejs_docs](https://github.com/VKneider/slicejs_docs)

Framework Link: [https://github.com/VKneider/slice.js](https://github.com/VKneider/slice.js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/VKneider/slicejs_docs.svg?style=for-the-badge
[contributors-url]: https://github.com/VKneider/slicejs_docs/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/VKneider/slicejs_docs.svg?style=for-the-badge
[forks-url]: https://github.com/VKneider/slicejs_docs/network/members
[stars-shield]: https://img.shields.io/github/stars/VKneider/slicejs_docs.svg?style=for-the-badge
[stars-url]: https://github.com/VKneider/slicejs_docs/stargazers
[issues-shield]: https://img.shields.io/github/issues/VKneider/slicejs_docs.svg?style=for-the-badge
[issues-url]: https://github.com/VKneider/slicejs_docs/issues
[license-shield]: https://img.shields.io/github/license/VKneider/slicejs_docs.svg?style=for-the-badge
[license-url]: https://github.com/VKneider/slicejs_docs/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/VKneider
[product-screenshot]: https://raw.githubusercontent.com/VKneider/slice.js/master/readme_images/screenshot.JPG