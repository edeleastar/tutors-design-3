import { Lo } from "../../services/lo";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { BaseView } from "../base/base-view";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

@autoinject
export class TalkView extends BaseView {
  lo: Lo;

  async activate(params, route) {
    await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}talk/${params.courseUrl}/${params.talkid}`;
    this.lo = this.courseRepo.course.talks.get(ref);
    super.init(`talk/${params.courseUrl}/${params.talkid}`, this.lo);
  }

  configMainNav(nav: NavigatorProperties) {
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: true,
        profile: true,
        companions: false,
        walls: true,
        tutorsTime: false
      },
      {
        title: this.lo.title,
        subtitle: this.courseRepo.course.lo.title,
        img: this.lo.img,
        parentLink: this.lo.parent.lo.route,
        parentIcon: "topic",
        parentTip: "To parent topic ..."
      }
    );
  }
}
