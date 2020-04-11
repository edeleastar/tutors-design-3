import { Lo } from "../../services/course/lo";
import environment from "../../environment";
import { BaseView } from "../base/base-view";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

export class WallView extends BaseView {
  los: Lo[];
  panelVideos : Lo[];
  talkVideos : Lo[];

  routeName = "";

  async activate(params, route) {
    this.los = await this.courseRepo.fetchWall(params.courseurl, route.name);
    this.routeName = route.name;
    super.init(`${route.name}s/${params.courseurl}`);

    if (this.routeName == "video") {
      this.panelVideos = this.los.filter(lo => lo.type === 'panelvideo');
      this.talkVideos = this.los.filter(lo => lo.type !== 'panelvideo');
    }
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
        tutorsTime: false,
        toc: true
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
