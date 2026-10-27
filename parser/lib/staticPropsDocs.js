// Builds the optional "Static Props" documentation section from a page's front
// matter. The docs pipeline imports this module, but its implementation was
// never committed to master, which broke `node parser/index.js` for every page.
//
// Keep the generator working for pages that do not use `staticProps`, and fail
// loudly if a page starts using the feature before it is implemented. Replace
// this stub with the real source-reading implementation when the feature lands.
export function buildStaticPropsSectionForFrontMatter({ frontMatter } = {}) {
  if (!frontMatter || frontMatter.staticProps === undefined) {
    return null;
  }

  throw new Error(
    'staticProps front matter is not supported yet: implement parser/lib/staticPropsDocs.js',
  );
}
