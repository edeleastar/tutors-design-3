import { Course } from "../../services/course";
import { BaseView } from "../base/base-view";
import environment from "../../environment";

export class CourseView extends BaseView {
  course: Course;
  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "1234";

  async activate(params, route) {
    this.myKeypressCallback = this.keypressInput.bind(this);
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    super.init(`course/${params.courseurl}`, this.course.lo);

    this.initCourseNav();


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

  initCourseNav() {
    let isPortfolio = false;
    if (this.course.lo.properties.portfolio !== undefined) {
      const portfolio: any = this.course.lo.properties.portfolio
      isPortfolio = portfolio == true;
    }

    if (isPortfolio) {
      this.navigatorProperties.config(
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
    }
    else {
      this.navigatorProperties.config(
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
