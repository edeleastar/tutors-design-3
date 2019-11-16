import * as firebase from "firebase/app";
import "firebase/database";
import { Lo } from "./lo";
import environment from "../environment";
import { Course } from "./course";
import { analyicsPageTitle, firebaseKey } from "./utils";

const initGTag = require("./utils-ga.js").initGTag;
const trackEvent = require("./utils-ga.js").trackEvent;
const trackTag = require("./utils-ga.js").trackTag;

export class AnalyticsService {
  courseBaseName = "";
  userName = "";
  userEmail = "";
  userId = "";

  constructor() {
    initGTag(environment.ga);
    firebase.initializeApp(environment.firebase);
  }

  login(name: string, email: string, id: string) {
    if (this.userEmail !== email) {
      this.userName = name;
      this.userEmail = email;
      this.userId = id;
      this.incrementValue(`${this.courseBaseName}/${this.userId}`, email);
      this.updateStr(`${this.courseBaseName}/${this.userId}/name`, name);
    }
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);

    if (this.userEmail) {
      let name = `${this.userName} (${this.userEmail})`;
      const key = firebaseKey(this.courseBaseName, course.url, path, this.userId, lo);
      this.incrementValue(key, lo.title);
    }
  }

  incrementValue(key: string, title: string) {
    this.updateCount(`${key}/count`);
    this.updateStr (`${key}/last`, new Date().toString())
    this.updateStr (`${key}/title`, title);
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
