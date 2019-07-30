import { autoinject } from "aurelia-framework";
import { CourseRepo } from "../../../services/course-repo";
import { NavigatorProperties } from "./navigator-properties";

@autoinject
export class MainNavigator {
  constructor(private navigatorProperties: NavigatorProperties) {}
}
