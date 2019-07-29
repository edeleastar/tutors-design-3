import { autoinject } from "aurelia-framework";
import { AuthService } from "services/auth-service";
import {CourseRepo} from "../../services/course-repo";
import {NavigatorProperties} from "../../resources/elements/navigators/navigator-properties";

@autoinject
export class Logout {
  navigatorProperties = new NavigatorProperties()
  constructor(private auth: AuthService, private courseRepo: CourseRepo) {
    auth.logout();
    courseRepo.course = null;
    this.navigatorProperties.title = "Tutors Tuition System"
    this.navigatorProperties.subtitle = "Eamonn de Leastar, WIT Computing"
  }
}
