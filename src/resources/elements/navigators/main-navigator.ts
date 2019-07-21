import { autoinject } from "aurelia-framework";
import { CourseRepo } from "../../../services/course-repo";
import { IconNav, NavigatorProperties } from "../iconography/styles";
import { bindable } from "aurelia-framework";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class MainNavigator {
  @bindable
  navigatorProperties: NavigatorProperties;

  companions: IconNav[] = [];
  version = `${readerVersion} (${this.courseRepo.course.lo.version})`;

  constructor(private courseRepo: CourseRepo) {
    this.createCompanionBar(this.courseRepo.course.lo.properties);
  }

  createCompanionBar(properties: Properties) {
    if (properties.slack) this.companions.push({ link: properties["slack"], icon: "slack", tip: "to slack channel for this module" });
    if (properties.moodle) this.companions.push({ link: properties["moodle"], icon: "moodle", tip: "to moodle module for this module" });
    if (properties.youtube) this.companions.push({ link: properties["youtube"], icon: "youtube", tip: "to youtube channel for this module" });
  }
}
