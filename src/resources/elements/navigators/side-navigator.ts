import { CourseRepo } from "../../../services/course-repo";
import { autoinject } from "aurelia-framework";
import { Course } from "../../../services/course";

@autoinject
export class SideNavigator {
  course: Course;

  constructor(private courseRepo: CourseRepo) {}

  attached() {
    if (this.courseRepo.course) {
      this.course = this.courseRepo.course;
    }
  }
}
