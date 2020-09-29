import { SITE_TITLE } from "../constants";

export default function getSiteTitle({ pageTitle } = {}) {
  let titleStr = "";
  if (pageTitle) {
    titleStr += `${pageTitle}: `;
  }
  titleStr += `${SITE_TITLE} Dashboard`;
  return titleStr;
}
