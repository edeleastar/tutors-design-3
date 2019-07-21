import { CourseRepo } from "../../services/course-repo";
import { Topic } from "../../services/topic";
import {  NavigatorProperties } from "../../resources/elements/iconography/styles";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";

@autoinject
export class TopicView {
  topic: Topic;

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {}

  async activate(params) {
    this.topic = await this.courseRepo.fetchTopic(params.topicurl);
    const course = this.courseRepo.course;
    const lo = this.topic.lo;

    this.navigatorProperties.title = this.topic.lo.title;
    this.navigatorProperties.subtitle = course.lo.title;
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";
  }

  determineActivationStrategy() {
    return "replace";
  }
}
