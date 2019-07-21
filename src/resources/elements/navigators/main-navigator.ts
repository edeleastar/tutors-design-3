import { autoinject } from "aurelia-framework";
import { CourseRepo } from "../../../services/course-repo";
import { NavigatorProperties } from "../iconography/styles";
import { bindable } from "aurelia-framework";
const readerVersion = require("../../../../package.json").version;

interface Properties {
  [key: string]: any;
}

@autoinject
export class MainNavigator {
  @bindable
  navigatorProperties: NavigatorProperties;

  constructor(private courseRepo: CourseRepo) {}
}
