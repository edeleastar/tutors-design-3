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
    //firebase.database().goOffline();
  }

  login(name: string, email: string, id: string) {
    this.userName = name;
    this.userEmail = email;
    this.userId = id;
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);

    if (this.userEmail) {
      let name = `${this.userName} (${this.userEmail})`
      const key = firebaseKey(this.courseBaseName, course.url, path, name, lo);
      this.incrementValue(key, lo.title);
    }
  }

  incrementValue(key: string, title: string) {
    //firebase.database().goOnline();
    let ref = firebase.database().ref(`${key}/count`);
    ref.transaction(function(value) {
      return (value || 0) + 1;
    });
    ref = firebase.database().ref(`${key}/last`);
    ref.transaction(function(value) {
      return new Date().toString();
    });
    ref = firebase.database().ref(`${key}/title`);
    ref.transaction(function(value) {
      return title;
    });
    const db = firebase.database().ref();
    //firebase.database().goOnline();
  }
}
