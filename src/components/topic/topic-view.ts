import { Topic } from "../../services/topic";
import { BaseView } from "../base/base-view";

export class TopicView extends BaseView {
  topic: Topic;

  async activate(params, route) {
    this.topic = await this.courseRepo.fetchTopic(params.topicurl);
    super.init("topic", this.topic.lo);
  }
}
