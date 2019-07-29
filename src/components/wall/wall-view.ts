import { CourseRepo } from "../../services/course-repo";
import { Lo } from "../../services/lo";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";

@autoinject
export class WallView {
  los: Lo[];
  name = "";
  show = false;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private authService: AuthService
  ) {}

  async activate(params, route) {
    this.los = await this.courseRepo.fetchWall(params.courseurl, route.name);
    const course = this.courseRepo.course;
    this.name = route.name;

    this.show = this.authService.checkAuth(this.courseRepo.course, "wall");

    this.navigatorProperties.title = `All ${route.name}'s in ${course.lo.title}`;
    this.navigatorProperties.subtitle = course.lo.properties.credits;
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";
  }

  determineActivationStrategy() {
    return "replace";
  }
}
