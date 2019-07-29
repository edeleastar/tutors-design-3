import { CourseRepo } from "../../services/course-repo";
import { Lo } from "../../services/lo";
import { autoinject } from "aurelia-framework";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";

@autoinject
export class VideoView {
  lo: Lo;
  show = false;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private authService: AuthService
  ) {}

  async activate(params) {
    const course = await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}video/${params.courseUrl}/${params.videoid}`;
    this.lo = course.videos.get(ref);

    this.show = this.authService.checkAuth(this.courseRepo.course, "talk");
    this.navigatorProperties.init(this.lo);
  }

  determineActivationStrategy() {
    return "replace";
  }
}
