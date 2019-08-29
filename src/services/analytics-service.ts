import * as firebase from "firebase/app";
import "firebase/database";
import { CourseRepo } from "./course-repo";
var slugify = require("slugify");
import { Lo } from "./lo";
import environment from "../environment";

export class AnalyticsService {
  courseBaseName = "";
  userName = "";

  init(courseRepo: CourseRepo) {
    try {
      firebase.initializeApp(environment.firebase);
      this.courseBaseName = courseRepo.course.url.substr(0, courseRepo.course.url.indexOf("."));
      this.courseBaseName = slugify(this.courseBaseName);
    } catch (e) {
      console.log(e);
    }
  }

  login(user) {
    this.userName = slugify(user.name);
    this.incrementValue(`users/${this.userName}/login`);
    this.incrementValue(`usage/login/${this.userName}`);
  }

  log(lo: Lo) {
    this.incrementValue(`usage/${lo.type}/${slugify(lo.title)}`);
    if (this.userName) {
      this.incrementValue(`users/${this.userName}/${lo.type}/${slugify(lo.title)}`);
    }
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
