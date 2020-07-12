import { LoginEvent, User } from "./../../../services/events/event-definitions";
import environment from "../../../environment";
import { AuthService } from "../../../services/authentication/auth-service";
import { autoinject } from "aurelia-framework";
import { Course } from "../../../services/course/course";
import { EventBus, LoginListener } from "services/events/event-bus";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class NavigatorProperties implements LoginListener {
  version = "hello";
  toc = {
    visible: true,
  };

  titleCard = {
    title: "",
    subtitle: "",
    img: "",
    version: "",
    visible: true,
  };

  parent = {
    link: "",
    icon: "",
    tip: "",
    visible: true,
  };

  companions = {
    nav: [],
    visible: true,
  };

  walls = {
    nav: [],
    visible: true,
  };

  profile = {
    nav: [],
    visible: false,
  };

  url = "";

  constructor(private eb: EventBus, private authService: AuthService) {}

  user: User;
  courseUrl: string;
  isPortfolio = false;

  config(navBars, params) {
    this.titleCard.visible = navBars.titleCard;
    this.parent.visible = navBars.parent;
    this.companions.visible = navBars.companions;
    this.walls.visible = navBars.walls;
    // this.tutorsTime.visible = navBars.tutorsTime;
    this.profile.visible = navBars.profile;
    this.toc.visible = navBars.toc;

    this.titleCard.title = params.title;
    this.titleCard.subtitle = params.subtitle;
    this.titleCard.img = params.img;
    this.parent.link = params.parentLink;
    this.parent.icon = params.parentIcon;
    this.parent.tip = params.parentTip;
  }

  init(course: Course) {
    this.isPortfolio = course.isPortfolio();
    this.version = `${readerVersion} (${course.lo.version})`;
    if (course.url !== this.url) {
      this.url = course.url;
      this.createWallBar(course);
      this.createCompanionBar(course.lo.properties);
      if (course.authLevel > 0) {
        this.createProfileBar(course.isPortfolio());
      }
    }
  }

  clear() {
    this.companions.nav = this.profile.nav = this.walls.nav = this.companions.nav = [];
  }

  createWallBar(course: Course) {
    this.walls.nav = [];
    course.walls.forEach((los, type) => {
      this.walls.nav.push(this.createWallLink(type));
    });
    this.walls.nav.push({
      link: `${environment.urlPrefix}search/${this.url}`,
      icon: "search",
      tip: "Search this course",
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
        tip: "to youtube channel for this module",
      });
    this.companions.visible = this.companions.nav.length > 0;
  }

  createWallLink(type: string) {
    return {
      link: `${environment.urlPrefix}/${type}s/${this.url}`,
      icon: type,
      tip: `all ${type}'s in this module`,
    };
  }

  login(user: User, url: string): void {
    this.initProfile();
  }
  statusUpdate(status: string): void {}
  logout(): void {}

  initProfile() {
    this.profile.nav = [];
    if (this.authService.isAuthenticated()) {
      this.profile.nav.push({
        link: `https://tutors-metrics.netlify.app/time/${this.url}/${this.authService.getUserId()}`,
        icon: "tutorsTime",
        tip: "Tutors Time",
        target: "_blank",
      });
    }
    this.profile.nav.push({
      link: `https://tutors-metrics.netlify.app/live/${this.url}/`,
      icon: "timeLive",
      tip: "See who is doing labs right now",
      target: "_blank",
    });
    this.profile.nav.push({ link: `/logout`, icon: "logout", tip: "Logout form Tutors" });
    if (this.profile.visible) {
      this.profile.visible = this.authService.isAuthenticated();
      if (this.isPortfolio === true) {
        this.profile.visible = false;
      }
    }
  }
  createProfileBar(isPortfolio: boolean) {
    if (this.authService.hasId()) {
      this.initProfile();
    } else {
      this.eb.observeLogin(this);
    }
  }
}
