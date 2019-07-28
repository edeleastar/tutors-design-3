import { CourseRepo } from "../../../services/course-repo";
import { Lo } from "../../../services/lo";
import environment from "../../../environment";
import { AuthService } from "../../../services/auth-service";
import { autoinject } from "aurelia-framework";

@autoinject
export class NavigatorProperties {
  title: string;
  subtitle: string;
  img: string;
  parentLink: string;
  parentIcon: string;
  parentIconTip: string;
  showLogout = false;

  constructor(private courseRepo: CourseRepo, private authService: AuthService) {}

  init(lo: Lo) {
    this.title = lo.title;
    this.img = lo.img;
    if (lo.type == "course") {
      this.subtitle = this.courseRepo.course.lo.properties.credits;
      this.parentLink = this.courseRepo.course.lo.properties.parent;
      this.parentIcon = "programHome";
      this.parentIconTip = "To programme home...";
    } else if (lo.type == "topic") {
      this.subtitle = this.courseRepo.course.lo.title;
      this.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
      this.parentIcon = "moduleHome";
      this.parentIconTip = "To module home ...";
    } else if (lo.type == "talk" || lo.type == "video") {
      this.subtitle = lo.title;
      this.title = lo.parent.lo.title;
      this.parentLink = lo.parent.lo.route;
      this.parentIcon = "topic";
      this.parentIconTip = "To parent topic...";
    }
    this.showLogout = this.authService.isAuthenticated() || this.authService.isProtected(this.courseRepo.course, "course");
  }
}
