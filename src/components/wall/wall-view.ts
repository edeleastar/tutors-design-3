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

    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: this.courseRepo.course.lo.properties.parent != null,
        profile: true,
        companions: false,
        walls: true,
        tutorsTime: false
      },
      {
        title: `All ${route.name}'s in ${course.lo.title}`,
        subtitle: this.courseRepo.course.lo.properties.credits,
        img: this.courseRepo.course.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      });
  }

  determineActivationStrategy() {
    return "replace";
  }
}
