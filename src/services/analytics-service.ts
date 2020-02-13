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
  userEmailSanitised = "";
  userId = "";
  firebaseIdRoot = "";
  firebaseEmailRoot = "";
  url = "";

  constructor() {
    initGTag(environment.ga);
    firebase.initializeApp(environment.firebase);
  }

  login(name: string, email: string, id: string, picture : string, url: string, nickname : string) {
    if (this.userEmail !== email || this.url !== url) {
      this.url = url;
      this.courseBaseName = url.substr(0, url.indexOf("."));
      this.userEmail = email;
      this.userId = id;
      const userFirebaseId = id.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.userEmailSanitised = email.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      this.reportLogin(name, email, id, picture, nickname);
    }
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    trackTag(environment.ga, path, title, this.userId);
    trackEvent(environment.ga, this.courseBaseName, path, lo, this.userId);

    if (this.userEmail) {
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementValue(node, lo.title);
    }
  }

  logDuration(path: string, course: Course, lo: Lo) {
    if (this.userEmail) {
      this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementDuration(node, lo.title);
    }
  }

  logSearch(term: string, path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    if (this.userEmail) {
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.logSearchValue(term, path);
    }
  }

  logSearchValue (term : string, path:string) {
    let searchkey = new Date().toLocaleString();
    searchkey = searchkey.replace(/[\/]/g, "-");
    let key = `${this.firebaseEmailRoot}/search/${searchkey}/term`;
    this.updateStr(key, term);
    key = `${this.firebaseEmailRoot}/search/${searchkey}/path`;
    this.updateStr(key, path);
    key = `${this.firebaseIdRoot}/search/${searchkey}/path`;
    this.updateStr(key, path);
  }

  incrementValue(key: string, title: string) {
    this.updateCount(`${this.firebaseIdRoot}/${key}/count`);
    this.updateStr(`${this.firebaseIdRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseIdRoot}/${key}/title`, title);

    this.updateCount(`${this.firebaseEmailRoot}/${key}/count`);
    this.updateStr(`${this.firebaseEmailRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseEmailRoot}/${key}/title`, title);
  }

  incrementDuration(key: string, title: string) {
    this.updateCount(`${this.firebaseEmailRoot}/${key}/duration`);
  }

  reportLogin(name: string, email: string, id: string, picture : string, nickname : string) {
    this.updateStr(`${this.firebaseEmailRoot}/email`, email);
    this.updateStr(`${this.firebaseEmailRoot}/name`, name);
    this.updateStr(`${this.firebaseEmailRoot}/id`, id);
    this.updateStr(`${this.firebaseEmailRoot}/nickname`, nickname);
    this.updateStr(`${this.firebaseEmailRoot}/picture`, picture);
    this.updateStr(`${this.firebaseEmailRoot}/last`, new Date().toString());
    this.updateCount(`${this.firebaseEmailRoot}/count`);
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
