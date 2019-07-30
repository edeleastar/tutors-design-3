import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";
import { inject } from "aurelia-framework";
import { Lo } from "../../services/lo";
import { Router } from "aurelia-router";

@inject(CourseRepo, NavigatorProperties, AuthService, Router)
export class BaseView {
  show = false;

  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  authService: AuthService;
  router: Router;

  constructor(courseRepo: CourseRepo, navigatorProperties: NavigatorProperties, authService: AuthService, router: Router) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.authService = authService;
    this.router = router;
  }

  async init(type:string, lo : Lo = null) {
    this.show = this.authService.checkAuth(this.courseRepo.course, type);
    if (lo) this.navigatorProperties.init(lo);
  }

  async clearNavigator() {
    this.navigatorProperties.clear();
  }

  determineActivationStrategy() {
    return "replace";
  }
}
