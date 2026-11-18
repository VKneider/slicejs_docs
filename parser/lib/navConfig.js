// The documentation information architecture.
//
// `section` and `group` in each page's front matter are the source of truth;
// this file only decides the order in which those names are presented. Add a
// section or group here deliberately when the IA changes.
export const SECTION_ORDER = [
  'Getting Started',
  'Components',
  'State & Routing',
  'Guides',
  'Configuration',
  'Tooling',
  'Reference'
];

export const GROUP_ORDER = {
  Components: ['Component Model', 'Lifecycle']
};

export const sectionRank = (section) => {
  const index = SECTION_ORDER.indexOf(section);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

export const groupRank = (section, group) => {
  if (!group) return -1;
  const order = GROUP_ORDER[section] || [];
  const index = order.indexOf(group);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};
