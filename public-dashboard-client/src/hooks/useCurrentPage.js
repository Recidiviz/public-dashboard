import { useLocation } from "@reach/router";

export default function useCurrentPage() {
  const location = useLocation();
  // the id of the page is the last segment of the path
  return location.pathname.split("/").reverse()[0];
}
