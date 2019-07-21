import { Course } from "../../../services/course";

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
  pdf: "red"
};

export interface IconNav {
  link: string;
  icon: string;
}

export class NavigatorProperties {
  title: string;
  subtitle: string;
  icon: string;
  iconColour: string;
  img: string;
  parentLink: string;
  parentIcon: string;
  parentIconColour: string;
  parentIconTip: string;

  init(course: Course) {
    this.title = course.lo.title;
    this.subtitle = course.lo.properties.credits;
    this.icon = course.lo.properties.icon;
    this.img = course.lo.img;
    this.iconColour = course.lo.properties.faColour;
    this.parentLink = course.lo.properties.parent;
    this.parentIcon = "programHome";
    this.parentIconTip = "To programme home...";
    this.parentIconColour = "";
  }
}
