import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/auth-service";
import { inject } from "aurelia-framework";
import { Lo } from "../../services/lo";
import { Router } from "aurelia-router";
import { AnalyticsService } from "../../services/analytics-service";
import { Course } from "../../services/course";
import { EventAggregator } from "aurelia-event-aggregator";
import { MetricsService } from "../../services/metrics-service";
import { App } from "../../app";

let currentLo: Lo = null;
let currentRoute = "";
let currentCourse: Course = null;
let analyticsService: AnalyticsService = null;

const func = () => {
  if (analyticsService && !document.hidden) {
    analyticsService.logDuration(currentRoute, currentCourse, currentLo);
  }
};

setInterval(func, 30 * 1000);

@inject(CourseRepo, NavigatorProperties, AuthService, Router, AnalyticsService, EventAggregator, MetricsService, App)
export class BaseView {
  show = false;

  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  authService: AuthService;
  router: Router;
  anaylticsService: AnalyticsService;
  ea: EventAggregator;
  metricsService: MetricsService;
  course: Course;
  app : App;

  myKeypressCallback: any;
  pinBuffer = "";
  ignorePin = "";
  instructorMode = false;

  constructor(
    courseRepo: CourseRepo,
    navigatorProperties: NavigatorProperties,
    authService: AuthService,
    router: Router,
    analyticsService: AnalyticsService,
    ea: EventAggregator,
    metricsService: MetricsService,
    app : App
  ) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.authService = authService;
    this.router = router;
    this.anaylticsService = analyticsService;
    this.ea = ea;
    this.metricsService = metricsService;
    this.app = app;
  }

  async init(path: string = "", lo: Lo = null) {
    let type = "course";
    if (lo) {
      type = lo.type;
    }
    if (this.courseRepo.course) {
      this.course = this.courseRepo.course;
      this.show = this.authService.checkAuth(this.courseRepo.course, type);
      this.navigatorProperties.init(this.courseRepo.course);
    }
    if (lo) {
      this.anaylticsService.log(path, this.courseRepo.course, lo);
      this.router.title = lo.title;
      this.router.updateTitle();
      currentLo = lo;
      currentRoute = path;
      currentCourse = this.courseRepo.course;
      analyticsService = this.anaylticsService;
    }
    this.configMainNav(this.navigatorProperties);
    this.autoNavProperties();

    this.myKeypressCallback = this.keypressInput.bind(this);
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
      this.courseRepo.privelaged = true;
      this.instructorModeEnabled();
      this.navigatorProperties.privelagedEnabled();
      this.instructorMode = true;
    }
  }

  instructorModeEnabled() {}

  configMainNav(nav: NavigatorProperties) {
    nav.clear();
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
        title: "Tutors Tuition System",
        subtitle: "Eamonn de Leastar, WIT Computing"
      }
    );
  }
  autoNavProperties() {
    this.navigatorProperties.companions.visible =
      this.navigatorProperties.companions.visible && this.navigatorProperties.companions.nav.length > 0;
    if (this.navigatorProperties.profile.visible) {
      this.navigatorProperties.profile.visible =
        this.course.authLevel > 0 && this.course.walls.get("lab") != null && this.authService.isAuthenticated();
    }
  }
}
