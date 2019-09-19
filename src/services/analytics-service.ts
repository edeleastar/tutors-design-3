import * as firebase from "firebase/app";
import "firebase/database";
import { CourseRepo } from "./course-repo";
var slugify = require("slugify");
import { Lo } from "./lo";
import environment from "../environment";
import { Course } from "./course";
import {analyicsPage, analyicsPageTitle} from "./utils";

const init = require("./google").init;
const track = require("./google.js").track;

export class AnalyticsService {
  courseBaseName = "";

  constructor() {
    firebase.initializeApp(environment.firebase);
    init("UA-147419187-2");
  }

  login(user) {
    // this.userName = slugify(user.name);
    // this.incrementValue(`users/${this.userName}/login`);
    // this.incrementValue(`usage/login/${this.userName}`);
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    this.courseBaseName = slugify(this.courseBaseName);
   // const segments = lo.route.split('/')
   // segments.shift();
    //const path = segments.join('/');
    //track(path, lo.title)
    const actualPath = `https://${course.url}/${path}`;

    track (actualPath, analyicsPageTitle(course, lo));
    //this.incrementValue(`usage/${path}`);
    // if (this.userName) {
    //   this.incrementValue(`users/${this.userName}/${lo.type}/${slugify(lo.title)}`);
    // }
  }

  incrementValue(key: string) {
    var ref = firebase.database().ref(`${this.courseBaseName}/${key}/count`);
    ref.transaction(function(value) {
      return (value || 0) + 1;
    });
    var ref = firebase.database().ref(`${this.courseBaseName}/${key}/last`);
    ref.transaction(function(value) {
      return new Date().toString();
    });
  }
}
