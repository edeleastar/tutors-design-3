import { autoinject } from "aurelia-framework";
import { CourseRepo } from "../../../services/course-repo";
import { bindable } from "aurelia-framework";
import environment from "../../../environment";
import { NavigatorProperties } from "./navigator-properties";
import { IconNav } from "../iconography/styles";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class MainNavigator {
  @bindable navigatorProperties: NavigatorProperties;

  companions: IconNav[] = [];
  walls: IconNav[] = [];
  version = `${readerVersion}`;
  searchroute = "";
  logoutroute = "/logout";

  constructor(private courseRepo: CourseRepo) {
    if (this.courseRepo.course) {
      this.createCompanionBar(this.courseRepo.course.lo.properties);
      this.createWallBar();
      this.version = this.version + `(${this.courseRepo.course.lo.version})`;
      this.searchroute = `${environment.urlPrefix}search/${this.courseRepo.courseUrl}`;
    }
  }

  createCompanionBar(properties: Properties) {
    if (properties.slack)
      this.companions.push({ link: properties["slack"], icon: "slack", tip: "to slack channel for this module" });
    if (properties.moodle)
      this.companions.push({ link: properties["moodle"], icon: "moodle", tip: "to moodle module for this module" });
    if (properties.youtube)
      this.companions.push({ link: properties["youtube"], icon: "youtube", tip: "to youtube channel for this module" });
  }

  createWallBar() {
    this.courseRepo.course.walls.forEach((los, type) => {
      this.walls.push(this.createWallLink(type));
    });
  }

  createWallLink(type: string) {
    return {
      link: `${environment.urlPrefix}/${type}s/${this.courseRepo.courseUrl}`,
      icon: type,
      tip: `all ${type}'s in this module`
    };
  }
}
