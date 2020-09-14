import { parseISO } from "date-fns";
import { vizWithDateGetter } from "../viz-population-over-time";

const getSupervisionDate = (record) => parseISO(record.date_of_supervision);

const VizSupervisionPopulationOverTime = vizWithDateGetter(getSupervisionDate);

export default VizSupervisionPopulationOverTime;
