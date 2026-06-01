let linkCutActive = false;

export const triggerLinkCut = () => {
  linkCutActive = true;
  return { linkCutActive };
};

export const restoreLinkCut = () => {
  linkCutActive = false;
  return { linkCutActive };
};

export const getLinkCutState = () => {
  return { linkCutActive };
};
