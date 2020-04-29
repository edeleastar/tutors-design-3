import { faYoutube, faSlack, faGithub, faYoutubeSquare } from "@fortawesome/free-brands-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons/faAddressCard";
import { faClock as farClock, faEye as farEye } from "@fortawesome/free-regular-svg-icons";
import {
  faBook,
  faSitemap,
  faObjectGroup,
  faFlask,
  faFileArchive,
  faGraduationCap,
  faHome,
  faTh,
  faBars,
  faFilm,
  faBookmark,
  faChalkboardTeacher,
  faSearch,
  faFilePdf,
  faSignOutAlt,
  faHistory,
  faEye,
  faClock,
  faStopwatch,
  faFileExcel,
  faUserClock
} from "@fortawesome/free-solid-svg-icons";

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
  logout: "forestgreen",
  tutorsTime: "#85144b",
  labViewDetail: "",
  labViewSummary: "",
  labTimeDetail: "",
  LabTimeSummary: "",
  timeExport: "forestgreen"
};

export interface IconNav {
  link: string;
  icon: string;
  tip: string;
  target: "";
}

export interface IconNavBar {
  show: boolean;
  bar: IconNav[];
}

export const faIcons = {
  course: faBook,
  topic: faSitemap,
  talk: faObjectGroup,
  reference: faObjectGroup,
  lab: faFlask,
  archive: faFileArchive,
  panelvideo: faYoutube,
  video: faYoutube,
  adobeconnect: faAddressCard,
  slack: faSlack,
  moodle: faGraduationCap,
  github: faGithub,
  youtube: faYoutubeSquare,
  moduleHome: faHome,
  programHome: faTh,
  toc: faBars,
  film: faFilm,
  web: faBookmark,
  unit: faBookmark,
  tutors: faChalkboardTeacher,
  search: faSearch,
  pdf: faFilePdf,
  logout: faSignOutAlt,
  tutorsTime: faHistory,
  labViewDetail: faEye,
  labViewSummary: farEye,
  labTimeDetail: faClock,
  labTimeSummary: farClock,
  timeExport: faFileExcel,
  timeLive: faUserClock
};
