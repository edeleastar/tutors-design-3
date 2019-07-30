import { Course } from "../../services/course";
import { BaseView } from "../base/base-view";

export class CourseView extends BaseView {
  course: Course;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "1234";

  async activate(params, route) {
    this.myKeypressCallback = this.keypressInput.bind(this);
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    super.init("course", this.course.lo);

    window.addEventListener("keypress", this.myKeypressCallback, false);
    if (this.courseRepo.course.lo.properties.ignorepin) {
      this.ignorePin = "" + this.courseRepo.course.lo.properties.ignorepin;
    }
  }

  deactivate() {
    window.removeEventListener("keypress", this.myKeypressCallback);
  }

  keypressInput(e) {
    this.pinBuffer = this.pinBuffer.concat(e.key);
    if (this.pinBuffer === this.ignorePin) {
      this.pinBuffer = "";
      this.courseRepo.course.showAllLos();
    }
  }
}
