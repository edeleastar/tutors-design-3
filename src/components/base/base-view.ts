import { CourseRepo } from "../../services/course/course-repo";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { AuthService } from "../../services/authentication/auth-service";
import { inject } from "aurelia-framework";
import { Lo } from "../../services/course/lo";
import { Router } from "aurelia-router";
import { Course } from "../../services/course/course";
import { MetricsService } from "../../services/analytics/metrics-service";
import { App } from "../../app";
import { EventBus } from "../../services/events/event-bus";
import { AnalyticsService } from "../../services/analytics/analytics-service";

let currentLo: Lo = null;
let currentRoute = "";
let currentCourse: Course = null;
let eb: EventBus = null;

const func = () => {
  if (eb && !document.hidden) {
    eb.emitLog(currentRoute, currentCourse, currentLo);
  }
};

setInterval(func, 30 * 1000);

@inject(CourseRepo, NavigatorProperties, AuthService, Router, EventBus, MetricsService, AnalyticsService, App)
export class BaseView {
  show = false;

  courseRepo: CourseRepo;
  navigatorProperties: NavigatorProperties;
  authService: AuthService;
  router: Router;
  eb: EventBus;
  metricsService: MetricsService;
  anaylticsService : AnalyticsService;
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
    eb: EventBus,
    metricsService: MetricsService,
    analyticsService : AnalyticsService,
    app: App
  ) {
    this.courseRepo = courseRepo;
    this.navigatorProperties = navigatorProperties;
    this.authService = authService;
    this.router = router;
    this.eb = eb;
    this.metricsService = metricsService;
    this.anaylticsService = analyticsService;
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
      currentLo = lo;
      currentRoute = path;
      currentCourse = this.courseRepo.course;
      eb = this.eb;
      this.eb.emitLog(path, this.courseRepo.course, lo);
      this.router.title = lo.title;
      this.router.updateTitle();
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
