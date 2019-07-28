import { CourseRepo } from "../../services/course-repo";
import { Topic } from "../../services/topic";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { AuthService } from "../../services/auth-service";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

@autoinject
export class TopicView {
  topic: Topic;
  show = false;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private authService: AuthService
  ) {}

  async activate(params) {
    this.topic = await this.courseRepo.fetchTopic(params.topicurl);
    const course = this.courseRepo.course;
    const lo = this.topic.lo;
    this.show = this.authService.checkAuth(this.courseRepo.course, "topic");
    this.navigatorProperties.init(this.topic.lo);
  }

  determineActivationStrategy() {
    return "replace";
  }
}
