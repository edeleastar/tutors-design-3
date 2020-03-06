import { Lo } from "../../services/lo";
import environment from "../../environment";
import { BaseView } from "../base/base-view";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

export class WallView extends BaseView {
  los: Lo[];
  name = "";
  routeName = "";

  async activate(params, route) {
    this.los = await this.courseRepo.fetchWall(params.courseurl, route.name);
    this.routeName = route.name;
    super.init(`${route.name}s/${params.courseurl}`);
  }

  determineActivationStrategy() {
    return "replace";
  }

  configMainNav(nav: NavigatorProperties) {
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
        title: `All ${this.routeName}'s in ${this.course.lo.title}`,
        subtitle: this.courseRepo.course.lo.properties.credits,
        img: this.courseRepo.course.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      }
    );
  }
}
