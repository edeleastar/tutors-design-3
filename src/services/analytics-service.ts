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
  firebaseRoot = "";

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
      this.firebaseRoot = `${this.courseBaseName}/${userFirebaseId}`;
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
      }
      let key = `${this.firebaseRoot}/${node}`;
      key = key.replace(/[`#$.\[\]]/gi, "*");
      this.incrementValue(key, lo.title);
    }
  }

  incrementValue(key: string, title: string) {
    this.updateCount(`${key}/count`);
    this.updateStr(`${key}/last`, new Date().toLocaleString());
    this.updateStr(`${key}/title`, title);
  }

  reportLogin(name: string, email: string, id: string) {
    this.updateStr(`${this.firebaseRoot}/email`, email);
    this.updateStr(`${this.firebaseRoot}/name`, name);
    this.updateStr(`${this.firebaseRoot}/id`, id);
    this.updateStr(`${this.firebaseRoot}/last`, new Date().toLocaleString());
    this.updateCount(`${this.firebaseRoot}/count`);
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
