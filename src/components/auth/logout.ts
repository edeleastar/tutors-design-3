import { autoinject } from "aurelia-framework";
import { AuthService } from "services/auth-service";
import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { BaseView } from "../base/base-view";

@autoinject
export class Logout extends BaseView {
  async activate(params, route) {
    this.navigatorProperties.clear();
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: false,
        profile: false,
        companions: false,
        walls: true,
        tutorsTime: false
      },
      {
        title: "Tutors Tuition System",
        subtitle: "Eamonn de Leastar, WIT Computing"
        //img: this.courseRepo.course.lo.img,
      }
    );
    this.authService.logout();
  }
}
