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

  let newStr = link.replace(BASE_REGEX, twtSiteWithPreviews);
  newStr = removeQueryFromUrl(newStr);
  // case where link is not a valid twitter link
  if (!newStr) {
    return link;
  }
  return newStr;
}
