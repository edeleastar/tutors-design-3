import { Lo } from "../course/lo";
import environment from "../../environment";
import { Course } from "../course/course";
import { analyicsPageTitle } from "../utils/utils";
import { EventBus, InteractionListener, LoginListener } from "../events/event-bus";
import { autoinject } from "aurelia-framework";
import { User } from "../events/event-definitions";

const initGTag = require("./utils-ga.js").initGTag;
const trackEvent = require("./utils-ga.js").trackEvent;
const trackTag = require("./utils-ga.js").trackTag;

@autoinject
export class GoogleAnalytics implements LoginListener, InteractionListener {
  courseBaseName = "";
  userEmail = "";
  userId = "";
  url = "";

  constructor(private eb: EventBus) {
    initGTag(environment.ga);
    this.eb.observeLogin(this);
    this.eb.observeInteraction(this);
  }

  login(user: User, url: string) {
    if (this.userEmail !== user.email || this.url !== url) {
      this.url = url;
      this.courseBaseName = url.substr(0, url.indexOf("."));
      this.userEmail = user.email;
      this.userId = user.userId;
    }
  }

  logout() {
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);
  }

  statusUpdate(status: string) {
  }
}
