import { CourseRepo } from "../../services/course-repo";
import { Course } from "../../services/course";
import { NavigatorProperties } from "../../resources/elements/iconography/styles";
import { autoinject } from "aurelia-framework";

@autoinject
export class CourseView {
  course: Course;

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {}

  async activate(params) {
    this.course = await this.courseRepo.fetchCourse(params.courseurl);
  }

  determineActivationStrategy() {
    return "replace";
  }
}
