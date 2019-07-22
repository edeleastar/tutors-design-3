import { CourseRepo } from "../../services/course-repo";
import { Course } from "../../services/course";
import { NavigatorProperties } from "../../resources/elements/iconography/styles";
import { autoinject } from "aurelia-framework";

@autoinject
export class CourseView {
  course: Course;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "1234";

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {
    this.myKeypressCallback = this.keypressInput.bind(this);
  }

  async activate(params) {
    this.course = await this.courseRepo.fetchCourse(params.courseurl);
    this.navigatorProperties.init(this.course);
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
