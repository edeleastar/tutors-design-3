import { CourseRepo } from "../../services/course-repo";
import { Course } from "../../services/course";
import { autoinject } from "aurelia-framework";
import { AuthService } from "../../services/auth-service";
import {NavigatorProperties} from "../../resources/elements/navigators/navigator-properties";

@autoinject
export class CourseView {
  course: Course;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "1234";
  show = false;

  constructor(
    private courseRepo: CourseRepo,
    private navigatorProperties: NavigatorProperties,
    private authService: AuthService
  ) {
    this.myKeypressCallback = this.keypressInput.bind(this);
  }

  async activate(params) {
    this.course = await this.courseRepo.fetchCourse(params.courseurl);

    this.show = this.authService.checkAuth(this.course, "course");

    this.navigatorProperties.init(this.course.lo);
    window.addEventListener("keypress", this.myKeypressCallback, false);
    if (this.course.lo.properties.ignorepin) {
      this.ignorePin = "" + this.course.lo.properties.ignorepin;
    }
  }

  determineActivationStrategy() {
    return "replace";
  }

  deactivate() {
    window.removeEventListener("keypress", this.myKeypressCallback);
  }

  keypressInput(e) {
    this.pinBuffer = this.pinBuffer.concat(e.key);
    if (this.pinBuffer === this.ignorePin) {
      this.pinBuffer = "";
      this.course.showAllLos();
    }
  }
}
