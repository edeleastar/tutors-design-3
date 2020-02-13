import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";
import { inject } from "aurelia-framework";
import { Lo } from "../../services/lo";
import { Router } from "aurelia-router";
import { AnalyticsService } from "../../services/analytics-service";
import { Course } from "../../services/course";

let currentLo: Lo = null;
let currentRoute = "";
let currentCourse: Course = null;
let analyticsService: AnalyticsService = null;

const func = () => {
  if (analyticsService) {
    analyticsService.logDuration(currentRoute, currentCourse, currentLo);
  }
};
setInterval(func, 30 * 1000);

@inject(CourseRepo, NavigatorProperties, AuthService, Router, AnalyticsService)
export class BaseView {
  show = false;

  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  authService: AuthService;
  router: Router;
  anaylticsService: AnalyticsService;

  constructor(
    courseRepo: CourseRepo,
    navigatorProperties: NavigatorProperties,
    authService: AuthService,
    router: Router,
    analyticsService: AnalyticsService
  ) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.authService = authService;
    this.router = router;
    this.anaylticsService = analyticsService;
  }

  async init(path: string, lo: Lo = null) {
    let type = "course";
    if (lo) {
      type = lo.type;
    }
    this.show = this.authService.checkAuth(this.courseRepo.course, type);
    if (lo) {
      this.navigatorProperties.init(lo);
      this.anaylticsService.log(path, this.courseRepo.course, lo);
      this.router.title = lo.title;
      this.router.updateTitle();
      currentLo = lo;
      currentRoute = path;
      currentCourse = this.courseRepo.course;
      analyticsService = this.anaylticsService;
    }
  }

  async clearNavigator() {
    this.navigatorProperties.clear();
  }
}
