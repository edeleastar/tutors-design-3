import { Topic } from "../../services/topic";
import { BaseView } from "../base/base-view";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

export class TopicView extends BaseView {
  topic: Topic;

  async activate(params, route) {
    this.topic = await this.courseRepo.fetchTopic(params.topicurl);
    super.init(`topic/${params.topicurl}`, this.topic.lo);
  }

  configMainNav(nav: NavigatorProperties) {
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: true,
        profile: true,
        companions: true,
        walls: true,
        tutorsTime: false
      },
      {
        title: this.topic.lo.title,
        subtitle: this.courseRepo.course.lo.title,
        img: this.topic.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      }
    );
  }
}
