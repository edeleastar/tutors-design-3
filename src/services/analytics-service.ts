import * as firebase from "firebase/app";
import "firebase/database";
import { CourseRepo } from "./course-repo";
var slugify = require("slugify");
import { Lo } from "./lo";
import environment from "../environment";
import { Course } from "./course";
import { analyicsPage, analyicsPageTitle, fireBasePageTitle } from "./utils";

const CryptoJS = require("crypto-js");

const initGa = require("./utils-ga.js").initGa;
const track = require("./utils-ga.js").track;
const initGTag = require("./utils-ga.js").initGTag;
const trackEvent = require("./utils-ga.js").trackEvent;
const trackTag = require("./utils-ga.js").trackTag;

export class AnalyticsService {
  courseBaseName = "";
  user = "";
  userEncrypted = "";

  constructor() {
    firebase.initializeApp(environment.firebase);
    //initGa(environment.ga);
    initGTag (environment.ga);
  }

  login(user) {
    this.user = user.email;
    this.userEncrypted = CryptoJS.AES.encrypt(user.email, "Cggtp2sZDRVRqFRV3JZj60jvf9m2dDq9").toString();

    //const test = CryptoJS.AES.decrypt(this.userEncrypted, "Cggtp2sZDRVRqFRV3JZj60jvf9m2dDq9");
    //const original = test.toString(CryptoJS.enc.Utf8)

    // this.userName = slugify(user.name);
    // this.incrementValue(`users/${this.userName}/login`);
    // this.incrementValue(`usage/login/${this.userName}`);
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    this.courseBaseName = slugify(this.courseBaseName);
    const title = analyicsPageTitle(course, lo);
    //track(path, title);
    trackTag(environment.ga, path, title);
    trackEvent(environment.ga, this.courseBaseName, path, lo)
    this.incrementValue(fireBasePageTitle(course, lo));
  }

  incrementValue(key: string) {
    var ref = firebase.database().ref(`${key}/count`);
    ref.transaction(function(value) {
      return (value || 0) + 1;
    });
    var ref = firebase.database().ref(`${key}/last`);
    ref.transaction(function(value) {
      return new Date().toString();
    });
  }
}
