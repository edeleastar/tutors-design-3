import {faClock, faEye, faHourglass, faHourglassEnd, faSignOutAlt, faVial} from "@fortawesome/free-solid-svg-icons";
import {faClock as farClock, faEye as farEye} from "@fortawesome/free-regular-svg-icons";

export const iconColours = {
  course: "#009688",
  topic: "#009688",
  talk: "#009688",
  reference: "#009688",
  lab: "#00BCD4",
  archive: "#453F78",
  panelvideo: "#F44336",
  video: "#F44336",
  adobeconnect: "grey",
  slack: "#573852",
  moodle: "#f87f2a",
  github: "black",
  youtube: "red",
  moduleHome: "",
  programHome: "",
  toc: "",
  film: "red",
  web: "",
  unit: "",
  pdf: "red",
  logout : "forestgreen",
  tutorsTime : "#85144b",
  labViewDetail : "",
  labViewSummary : "",
  labTimeDetail : "",
  LabTimeSummary : "",
  timeExport : "forestgreen"
};

export interface IconNav {
  link: string;
  icon: string;
  tip: string;
}

export interface IconNavBar {
  show : boolean;
  bar : IconNav[];
}
