import * as firebase from "firebase/app";
import "firebase/database";
import { Lo } from "./lo";
import environment from "../environment";
import { Course } from "./course";
import { analyicsPageTitle } from "./utils";

const initGTag = require("./utils-ga.js").initGTag;
const trackEvent = require("./utils-ga.js").trackEvent;
const trackTag = require("./utils-ga.js").trackTag;

export class AnalyticsService {
  courseBaseName = "";
  userEmail = "";
  userId = "";
  firebaseIdRoot = "";
  firebaseEmailRoot = "";

  constructor() {
    initGTag(environment.ga);
    firebase.initializeApp(environment.firebase);
  }

  login(name: string, email: string, id: string, url: string) {
    if (this.userEmail !== email) {
      this.courseBaseName = url.substr(0, url.indexOf("."));
      this.userEmail = email;
      this.userId = id;
      const userFirebaseId = id.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseIdRoot = `${this.courseBaseName}/usersId/${userFirebaseId}`;
      const userEmailSanitised = email.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${userEmailSanitised}`;
      this.reportLogin(name, email, id);
    }
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);

    if (this.userEmail) {
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementValue(node, lo.title);
    }
  }

  logSearch(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);

    if (this.userEmail) {
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementValue(node, lo.title);
    }
  }

  incrementValue(key: string, title: string) {
    this.updateCount(`${this.firebaseIdRoot}/${key}/count`);
    this.updateStr(`${this.firebaseIdRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseIdRoot}/${key}/title`, title);

    this.updateCount(`${this.firebaseEmailRoot}/${key}/count`);
    this.updateStr(`${this.firebaseEmailRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseEmailRoot}/${key}/title`, title);

  }

  reportLogin(name: string, email: string, id: string) {
    this.updateStr(`${this.firebaseIdRoot}/email`, email);
    this.updateStr(`${this.firebaseIdRoot}/name`, name);
    this.updateStr(`${this.firebaseIdRoot}/id`, id);
    this.updateStr(`${this.firebaseIdRoot}/last`, new Date().toLocaleString());
    this.updateCount(`${this.firebaseIdRoot}/count`);

    this.updateStr(`${this.firebaseEmailRoot}/email`, email);
    this.updateStr(`${this.firebaseEmailRoot}/name`, name);
    this.updateStr(`${this.firebaseEmailRoot}/id`, id);
    this.updateStr(`${this.firebaseEmailRoot}/last`, new Date().toLocaleString());
    this.updateCount(`${this.firebaseEmailRoot}/count`);

    this.updateStr(`${this.firebaseEmailRoot}/search`, email);

  }

  updateCount(key: string) {
    let ref = firebase.database().ref(key);
    ref.transaction(function(count) {
      return (count || 0) + 1;
    });
  }

  updateStr(key: string, str: string) {
    let ref = firebase.database().ref(key);
    ref.transaction(function(value) {
      return str;
    });
  }
}
