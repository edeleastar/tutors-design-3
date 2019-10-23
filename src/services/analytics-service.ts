import * as firebase from "firebase/app";
import "firebase/database";
import { Lo } from "./lo";
import environment from "../environment";
import { Course } from "./course";
import { analyicsPageTitle, firebaseKey } from "./utils";

const CryptoJS = require("crypto-js");

const initGTag = require("./utils-ga.js").initGTag;
const trackEvent = require("./utils-ga.js").trackEvent;
const trackTag = require("./utils-ga.js").trackTag;

export class AnalyticsService {
  courseBaseName = "";
  userName = "";
  userEmail = "";
  userEncrypted = "";
  db = null;

  constructor() {
    initGTag(environment.ga);
    firebase.initializeApp(environment.firebase);
    firebase.database().goOffline();
  }

  login(user) {
    this.userEmail = user.email;
    this.userName = user.name;
    //this.userEncrypted = CryptoJS.AES.encrypt(user.email, "Cggtp2sZDRVRqFRV3JZj60jvf9m2dDq9").toString();
    //const test = CryptoJS.AES.decrypt(this.userEncrypted, "Cggtp2sZDRVRqFRV3JZj60jvf9m2dDq9");
    //const original = test.toString(CryptoJS.enc.Utf8)
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);
    trackTag(environment.ga, path, title);
    trackEvent(environment.ga, this.courseBaseName, path, lo);
    if (this.userEmail) {
      const key = firebaseKey(this.courseBaseName, course.url, path, this.userName, lo);
      this.incrementValue(key, lo.title);
    }
  }

  incrementValue(key: string, title: string) {
    firebase.database().goOnline()
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
    firebase.database().goOnline()
  }
}
