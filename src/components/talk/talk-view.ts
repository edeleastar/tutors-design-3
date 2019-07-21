import { inject } from "aurelia-framework";
import { CourseRepo } from "../../services/course-repo";
import { Lo } from "../../services/lo";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/iconography/styles";
import { autoinject } from "aurelia-framework";

@autoinject
export class TalkView {
  lo: Lo;

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {}

  async activate(params) {
    const course = await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}talk/${params.courseUrl}/${params.talkid}`;
    this.lo = course.talks.get(ref);

    this.navigatorProperties.subtitle = this.lo.title;
    this.navigatorProperties.title = this.lo.parent.lo.title;
    this.navigatorProperties.parentLink = this.lo.parent.lo.route;
    this.navigatorProperties.parentIcon = "topic";
    this.navigatorProperties.parentIconTip = "To parent topic...";
  }

  determineActivationStrategy() {
    return "replace";
  }
}
