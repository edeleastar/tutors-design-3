import { CourseRepo } from "../../../services/course-repo";
import { autoinject } from "aurelia-framework";
import { Course } from "../../../services/course";
import { Lo } from "../../../services/lo";

@autoinject
export class LabNavigator {
  course: Course;
  los: Lo[];

  constructor(private courseRepo: CourseRepo) {}

  attached() {
    if (this.courseRepo.course) {
      this.course = this.courseRepo.course;
      this.los = this.course.walls.get("lab");
    }
  }
}
