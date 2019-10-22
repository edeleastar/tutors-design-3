import { Lo } from "../../services/lo";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { BaseView } from "../base/base-view";

@autoinject
export class TalkView extends BaseView {
  lo: Lo;

  async activate(params, route) {
    await this.courseRepo.fetchCourseFromTalk(params.courseUrl);
    const ref = `${environment.urlPrefix}talk/${params.courseUrl}/${params.talkid}`;
    this.lo = this.courseRepo.course.talks.get(ref);
    super.init(`talk/${params.courseUrl}/${params.talkid}`, this.lo);
  }
}
