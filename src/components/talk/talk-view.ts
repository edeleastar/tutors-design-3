import { inject } from "aurelia-framework";
import { CourseRepo } from "../../services/course-repo";
import { Lo } from "../../services/lo";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";

@autoinject
export class TalkView {
  lo: Lo;
  show = false;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private authService: AuthService
  ) {}

  async activate(params) {
    const course = await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}talk/${params.courseUrl}/${params.talkid}`;
    this.lo = course.talks.get(ref);

    this.navigatorProperties.init(this.lo);
    this.show = this.authService.checkAuth(this.courseRepo.course, "talk");
  }

  determineActivationStrategy() {
    return "replace";
  }
}
