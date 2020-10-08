import { DEMOGRAPHIC_UNKNOWN } from "../constants";

export default function categoryIsNotUnknown([key]) {
  return key !== DEMOGRAPHIC_UNKNOWN;
}
