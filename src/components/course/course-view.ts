import { Course } from "../../services/course";
import { BaseView } from "../base/base-view";

export class CourseView extends BaseView {
  course: Course;

  async activate(params, route) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    super.init(`course/${params.courseurl}`, this.course.lo);
  }

  configMainNav(nav) {
    if (this.course.isPortfolio()) {
      nav.config(
        {
          titleCard: true,
          parent: false,
          profile: false,
          companions: false,
          walls: false,
          tutorsTime: false
        },
        {
          title: this.course.lo.title,
          subtitle: this.courseRepo.course.lo.properties.credits,
          img: this.course.lo.img
        }
      );
    } else {
      nav.config(
        {
          titleCard: true,
          parent: this.courseRepo.course.lo.properties.parent != null,
          profile: true,
          companions: true,
          walls: true,
          tutorsTime: false
        },
        {
          title: this.course.lo.title,
          subtitle: this.courseRepo.course.lo.properties.credits,
          img: this.course.lo.img,
          parentLink: this.courseRepo.course.lo.properties.parent,
          parentIcon: "programHome",
          parentTip: "To programme home ..."
        }
      );
    }
  }
}
