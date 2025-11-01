const BASE_REGEX =
  /https?:\/\/(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion|x\.com)/;

// cause i hate spam twt adds to links lol
const queryReg = /\?.+/g;
const removeQueryFromUrl = (link: string) => link.replace(queryReg, "");

export function isTwitterLink(link: string) {
  return BASE_REGEX.test(link);
}

export function parseTwitterLink(link: string) {
  const twtSiteWithPreviews = "https://vxtwitter.com";

  const previewSite = link.replace(BASE_REGEX, twtSiteWithPreviews);
  const removedQuery = removeQueryFromUrl(previewSite);
  // case where link is not a valid twitter link
  if (!removedQuery) {
    return link;
  }
  return removedQuery;
}
