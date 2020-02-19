import { Lo } from "../../services/lo";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { BaseView } from "../base/base-view";

@autoinject
export class VideoView extends BaseView {
  lo: Lo;

  async activate(params, route) {
    await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}video/${params.courseUrl}/${params.videoid}`;
    this.lo = this.courseRepo.course.videos.get(ref);
   // super.init("talk", this.lo);
    super.init(`video/${params.courseUrl}/${params.videoid}`, this.lo);

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

  determineActivationStrategy() {
    return "replace";
  }
}
