import { iconColours } from "./styles";
import { bindable } from "aurelia-framework";

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
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import { faYoutube, faSlack, faGithub, faYoutubeSquare } from "@fortawesome/free-brands-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons/faAddressCard";

export class Icon {
  @bindable type: string;
  @bindable size: string;
  @bindable colour: string;

  FaIcons = {
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
    logout : faSignOutAlt
  };

  icon(type: string) {
    return this.FaIcons[type];
  }

  iconStyle() {
    let c = iconColours[this.type];
    if (this.colour) {
      c = this.colour;
    }
    return c;
  }
}
