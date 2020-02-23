import environment from "../../../environment";
import { AuthService } from "../../../services/auth-service";
import { autoinject } from "aurelia-framework";
import { Course } from "../../../services/course";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class NavigatorProperties {
  version = "";
  toc = {
    visible: true
  };

  titleCard = {
    title: "",
    subtitle: "",
    img: "",
    version: "",
    visible: true
  };

  parent = {
    link: "",
    icon: "",
    tip: "",
    visible: true
  };

  companions = {
    nav: [],
    visible: true
  };

  walls = {
    nav: [],
    visible: true
  };

  tutorsTime = {
    nav: [],
    visible: false
  };

  profile = {
    nav: [],
    visible: false
  };

  url = "";

  constructor(private authService: AuthService) {}

  config(navBars, params) {
    this.titleCard.visible = navBars.titleCard;
    this.parent.visible = navBars.parent;
    this.companions.visible = navBars.companions;
    this.walls.visible = navBars.walls;
    this.tutorsTime.visible = navBars.tutorsTime;

    this.titleCard.title = params.title;
    this.titleCard.subtitle = params.subtitle;
    this.titleCard.img = params.img;
    this.parent.link = params.parentLink;
    this.parent.icon = params.parentIcon;
    this.parent.tip = params.parentTip;
  }

  init(course: Course) {
    this.version = `${readerVersion} (${course.lo.version})`;
    if (course.url !== this.url) {
      this.url = course.url;
      this.createWallBar(course);
      this.createCompanionBar(course.lo.properties);
      this.createTimeSheets();
      if (course.authLevel > 0) {
        this.createProfileBar(course.isPortfolio());
      }
    }
  }

  clear() {
    this.companions.nav = this.profile.nav = this.tutorsTime.nav = this.walls.nav = this.companions.nav = [];
  }

  createWallBar(course: Course) {
    this.walls.nav = [];
    course.walls.forEach((los, type) => {
      this.walls.nav.push(this.createWallLink(type));
    });
    this.walls.nav.push({
      link: `${environment.urlPrefix}search/${this.url}`,
      icon: "search",
      tip: "Search this course"
    });
  }

  createCompanionBar(properties: Properties) {
    this.companions.nav = [];
    if (properties.slack)
      this.companions.nav.push({ link: properties["slack"], icon: "slack", tip: "to slack channel for this module" });
    if (properties.moodle)
      this.companions.nav.push({ link: properties["moodle"], icon: "moodle", tip: "to moodle module for this module" });
    if (properties.youtube)
      this.companions.nav.push({
        link: properties["youtube"],
        icon: "youtube",
        tip: "to youtube channel for this module"
      });
    this.companions.visible = this.companions.nav.length > 0;
  }

  createWallLink(type: string) {
    return {
      link: `${environment.urlPrefix}/${type}s/${this.url}`,
      icon: type,
      tip: `all ${type}'s in this module`
    };
  }

  createTimeSheets() {
    this.tutorsTime.nav = [];
    this.tutorsTime.nav.push({
      link: `${environment.urlPrefix}time/${this.url}/viewdetail`,
      icon: "lab",
      tip: "Views by Lab Step"
    });
    this.tutorsTime.nav.push({
      link: `${environment.urlPrefix}time/${this.url}/viewsummary`,
      icon: "vial",
      tip: "Views by Lab"
    });
    this.tutorsTime.nav.push({
      link: `${environment.urlPrefix}time/${this.url}/timedetail`,
      icon: "hourglass",
      tip: "Minutes by Lab Step"
    });
    this.tutorsTime.nav.push({
      link: `${environment.urlPrefix}time/${this.url}/timesummary`,
      icon: "hourglassend",
      tip: "Minutes by lab"
    });
  }

  createProfileBar(isPortfolio: boolean) {
    this.profile.nav = [];
    this.profile.nav.push({
      link: `${environment.urlPrefix}time/${this.url}/viewsummary`,
      icon: "hourglassend",
      tip: "Tutors Time"
    });
    this.profile.nav.push({ link: `/logout`, icon: "logout", tip: "Logout form Tutors" });
    this.profile.visible = this.authService.isAuthenticated();
    if (isPortfolio) {
      this.profile.visible = false;
    }
  }
}
