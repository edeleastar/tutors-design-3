import { Course } from "./course";
import * as firebase from "firebase/app";
import "firebase/database";
import { Lo, Student } from "./lo";
import { inject } from "aurelia-dependency-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import { LabUpdateEvent, Metric, SingleUserUpdateEvent, UserMetric } from "./event-bus";

@inject(EventAggregator)
export class MetricsService {
  usage: Metric;
  usersMap = new Map<string, UserMetric>();
  enrolledUsersMap = new Map<string, Student>();
  course: Course;
  allLabs: Lo[] = [];

  constructor(private ea: EventAggregator) {}

  expandGenericMetrics(id: string, fbData): any {
    let metric = {
      id: "",
      metrics: []
    };
    metric.id = id;
    Object.entries(fbData).forEach(([key, value]) => {
      if (typeof value === "object") {
        metric.metrics.push(this.expandGenericMetrics(key, value));
      } else {
        metric[key] = value;
      }
    });
    return metric;
  }

  findInMetric(title: string, metric: Metric) {
    if (title === metric.title) {
      return metric;
    } else if (metric.metrics.length > 0) {
      return this.findInMetrics(title, metric.metrics);
    } else {
      return null;
    }
  }

  findInMetrics(title: string, metrics: Metric[]) {
    for (let metric of metrics) {
      const result = this.findInMetric(title, metric);
      if (result != null) {
        return result;
      }
    }
    return null;
  }

  findInUser(title: string, metric: UserMetric) {
    return this.findInMetrics(title, metric.metrics);
  }

  populateLabUsage(user: UserMetric) {
    user.labActivity = [];
    for (let lab of this.allLabs) {
      const labActivity = this.findInUser(lab.title, user);
      user.labActivity.push(labActivity);
    }
  }

  async retrieveAllUsers(course: Course) {
    this.allLabs = course.walls.get("lab");
    const that = this;
    if (!this.course || this.course != course) {
      this.course = course;
      const courseBaseName = course.url.substr(0, course.url.indexOf("."));
      const snapshot = await firebase
        .database()
        .ref(`${courseBaseName}`)
        .once("value");
      const genericMetrics = this.expandGenericMetrics("root", snapshot.val());

      that.usage = genericMetrics.metrics[0];
      for (let userMetric of genericMetrics.metrics[1].metrics) {
        if (userMetric.nickname) {
          const user = {
            userId: userMetric.id,
            email: userMetric.email,
            name: userMetric.name,
            picture: userMetric.picture,
            nickname: userMetric.nickname,
            onlineStatus: userMetric.onlineStatus,
            id: "home",
            title: userMetric.title,
            count: userMetric.count,
            last: userMetric.last,
            duration: userMetric.duration,
            metrics: userMetric.metrics,
            labActivity: []
          };
          that.populateLabUsage(user);
          that.usersMap.set(user.nickname, user);
        }
      }
    }
  }

  filterUsers(students: Student[]) {
    students.forEach(student => {
      this.enrolledUsersMap.set(student.github, student);
    });
    this.usersMap.forEach(user => {
      const student = this.enrolledUsersMap.get(user.nickname);
      if (student) {
        user.name = student.name;
      } else {
        this.usersMap.delete(user.nickname);
      }
    });
  }

  async retrieveUser(course: Course, userEmail: string) {
    this.allLabs = course.walls.get("lab");
    const courseBase = course.url.substr(0, course.url.indexOf("."));
    const userEmailSanitised = userEmail.replace(/[`#$.\[\]\/]/gi, "*");
    const snapshot = await firebase
      .database()
      .ref(`${courseBase}/users/${userEmailSanitised}`)
      .once("value");
    const user = this.expandGenericMetrics("root", snapshot.val());
    this.populateLabUsage(user);
    this.usersMap.set(user.nickname, user);
  }

  subscribeToAll(course: Course) {
    this.usersMap.forEach(value => {
      this.subscribeToUser(course, value.email);
    });
  }

  subscribeToLabs(course: Course) {
    const that = this;
    const labs = course.walls.get("lab");
    const courseBase = course.url.substr(0, course.url.indexOf("."));

    this.usersMap.forEach(user => {
      const userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
      labs.forEach(lab => {
        const labRoute = lab.route.split('topic')
        const route = `${courseBase}/users/${userEmailSanitised}/topic${labRoute[1]}`;
        firebase
          .database()
          .ref(route)
          .on("value", function(snapshot) {
            //console.log(route);
            that.ea.publish(new LabUpdateEvent(user, lab.title));
          });
      });
    });
  }

  subscribeToUser(course: Course, userEmail: string) {
    this.allLabs = course.walls.get("lab");
    const courseBaseName = course.url.substr(0, course.url.indexOf("."));
    this.subscribe(course, courseBaseName, userEmail);
  }

  subscribe(course: Course, courseBase: string, email: string) {
    const that = this;
    const userEmailSanitised = email.replace(/[`#$.\[\]\/]/gi, "*");
    firebase
      .database()
      .ref(`${courseBase}/users/${userEmailSanitised}`)
      .on("value", function(snapshot) {
        const user = that.expandGenericMetrics("root", snapshot.val());
        that.populateLabUsage(user);
        that.usersMap.set(user.nickname, user);
        that.ea.publish(new SingleUserUpdateEvent(user));
        //console.log(user.name);
      });
  }
}
