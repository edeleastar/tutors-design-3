import { autoinject } from "aurelia-framework";
import { BaseView } from "../base/base-view";
import environment from "../../environment";

@autoinject
export class MainView extends BaseView {
  async activate(params, route) {
    this.navigatorProperties.clear();
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: false,
        profile: false,
        companions: false,
        walls: true,
        tutorsTime: false
      },
      {
        title: "Tutors Tuition System",
        subtitle: "Eamonn de Leastar, WIT Computing"
        //img: this.courseRepo.course.lo.img,
      }
    );
  }
}
