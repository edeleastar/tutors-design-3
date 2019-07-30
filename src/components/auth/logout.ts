import { autoinject } from "aurelia-framework";
import { AuthService } from "services/auth-service";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { BaseView } from "../base/base-view";

@autoinject
export class Logout extends BaseView {
  async activate(params, route) {
    this.navigatorProperties.title = "Tutors Tuition System";
    this.navigatorProperties.subtitle = "Eamonn de Leastar, WIT Computing";
    super.clearNavigator();
    this.authService.logout();
  }
}
