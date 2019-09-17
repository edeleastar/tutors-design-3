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
    super.init("talk", this.lo);
  }

  determineActivationStrategy() {
    return "replace";
  }
}
