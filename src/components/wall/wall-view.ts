import { Lo } from "../../services/lo";
import environment from "../../environment";
import { BaseView } from "../base/base-view";

export class WallView extends BaseView {
  los: Lo[];
  name = "";

  async activate(params, route) {
    this.los = await this.courseRepo.fetchWall(params.courseurl, route.name);
    const course = this.courseRepo.course;
    this.name = route.name;

    super.init(`${route.name}s/${params.courseurl}`);

    this.navigatorProperties.title = `All ${route.name}'s in ${course.lo.title}`;
    this.navigatorProperties.subtitle = course.lo.properties.credits;
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";
  }
}
