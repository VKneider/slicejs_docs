const collectDocCandidates = (components) => {
  const markdownCandidates = [];
  const requiresCustomBlocks = [];

  for (const component of components) {
    const { filePath, content } = component;
    if (content.includes('createMultiRouteExample') || content.includes('slice.build("MultiRoute"')) {
      requiresCustomBlocks.push({
        filePath,
        reason: 'Interactive MultiRoute demo likely needs :::component or :::html block'
      });
    }

    if (content.includes('Details') && content.includes('faq')) {
      markdownCandidates.push({ filePath, reason: 'Details-based FAQ can map to :::details blocks' });
    }
  }

  return { markdownCandidates, requiresCustomBlocks };
};

export { collectDocCandidates };
