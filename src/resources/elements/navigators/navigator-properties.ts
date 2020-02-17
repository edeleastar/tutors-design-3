import { CourseRepo } from "../../../services/course-repo";
import { Lo } from "../../../services/lo";
import environment from "../../../environment";
import { AuthService } from "../../../services/auth-service";
import { autoinject } from "aurelia-framework";
import { IconNav } from "../iconography/styles";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class NavigatorProperties {
  title: string;
  subtitle: string;
  img: string;
  parentLink: string;
  parentIcon: string;
  parentIconTip: string;
  showLogout = false;
  version = "";
  walls: IconNav[] = [];
  companions: IconNav[] = [];
  searchroute = "";
  timeroute = "";
  logoutroute = "/logout";
  tutorstime = false;

  timesheets: IconNav[] = [
    { link: '', icon: "lab", tip: "Labs Views" },
    { link: '', icon: "vial", tip: "Labs View Summaries" },
    { link: '', icon: "hourglass", tip: "Labs Minutes" },
    { link: '', icon: "hourglassend", tip: "Labs Minutes Summary" },
  ];


  constructor(private courseRepo: CourseRepo, private authService: AuthService) {}

  init(lo: Lo) {
    this.title = lo.title;
    this.img = lo.img;
    this.version = `${readerVersion} (${this.courseRepo.course.lo.version})`;
    if (lo.type == "course") {
      this.subtitle = this.courseRepo.course.lo.properties.credits;
      this.parentLink = this.courseRepo.course.lo.properties.parent;
      this.parentIcon = "programHome";
      //this.parentIconTip = "To programme home...";
    } else if (lo.type == "topic") {
      this.subtitle = this.courseRepo.course.lo.title;
      this.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
      this.parentIcon = "moduleHome";
      //this.parentIconTip = "To module home ...";
    } else if (lo.type == "talk" || lo.type == "video" || lo.type == 'lab') {
      this.subtitle = lo.title;
      this.title = lo.parent.lo.title;
      this.parentLink = lo.parent.lo.route;
      this.parentIcon = "topic";
      //this.parentIconTip = "To parent topic...";
    }
    this.showLogout =
      this.authService.isAuthenticated() || this.authService.isProtected(this.courseRepo.course, "course");
    this.tutorstime = this.showLogout;
    this.searchroute = `${environment.urlPrefix}search/${this.courseRepo.courseUrl}`;
    this.timeroute = `${environment.urlPrefix}time/${this.courseRepo.courseUrl}/viewsummary`;

    this.createWallBar();
    this.createCompanionBar(this.courseRepo.course.lo.properties);
    this.createTimeSheets();
  }

  createWallBar() {
    this.walls = [];
    this.courseRepo.course.walls.forEach((los, type) => {
      this.walls.push(this.createWallLink(type));
    });
  }

  createCompanionBar(properties: Properties) {
    this.companions = [];
    if (properties.slack)
      this.companions.push({ link: properties["slack"], icon: "slack", tip: "to slack channel for this module" });
    if (properties.moodle)
      this.companions.push({ link: properties["moodle"], icon: "moodle", tip: "to moodle module for this module" });
    if (properties.youtube)
      this.companions.push({ link: properties["youtube"], icon: "youtube", tip: "to youtube channel for this module" });
  }

  createWallLink(type: string) {
    return {
      link: `${environment.urlPrefix}/${type}s/${this.courseRepo.courseUrl}`,
      icon: type,
      tip: `all ${type}'s in this module`
    };
  }

  createTimeSheets () {
    this.timesheets[0].link = `time/${environment.urlPrefix}${this.courseRepo.courseUrl}viewdetail`;
    this.timesheets[1].link = `time/${environment.urlPrefix}${this.courseRepo.courseUrl}viewsummary`;
    this.timesheets[2].link = `time/${environment.urlPrefix}${this.courseRepo.courseUrl}timedetail`;
    this.timesheets[3].link = `time/${environment.urlPrefix}${this.courseRepo.courseUrl}timesummary`;
  }

  clear() {
    this.walls = [];
    this.companions = [];
  }
}
