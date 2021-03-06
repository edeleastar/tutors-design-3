import { Course } from "../course/course";
import * as firebase from "firebase/app";
import "firebase/database";
import { Lo, Student } from "../course/lo";
import { autoinject } from "aurelia-framework";
import { Metric, User, UserMetric } from "../events/event-definitions";
import { EventBus } from "../events/event-bus";

@autoinject
export class MetricsService {
  course: Course;
  users = new Map<string, UserMetric>();
  allLabs: Lo[] = [];
  courseBaseName = "";
  constructor(private eb: EventBus) {}

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

  populateLabUsage(user: UserMetric, allLabs: Lo[]) {
    user.labActivity = [];
    for (let lab of allLabs) {
      const labActivity = this.findInUser(lab.title, user);
      user.labActivity.push(labActivity);
    }
  }

  async fetchUser(course: Course, userEmail: string) {
    const allLabs = course.walls.get("lab");
    const courseBase = course.url.substr(0, course.url.indexOf("."));
    const userEmailSanitised = userEmail.replace(/[`#$.\[\]\/]/gi, "*");
    const snapshot = await firebase
      .database()
      .ref(`${courseBase}/users/${userEmailSanitised}`)
      .once("value");
    const user = this.expandGenericMetrics("root", snapshot.val());
    this.populateLabUsage(user, allLabs);
    return user;
  }

  async fetchAllUsers(course: Course) {
    this.allLabs = course.walls.get("lab");
    const users = new Map<string, UserMetric>();
    const that = this;
    const courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const snapshot = await firebase
      .database()
      .ref(`${courseBaseName}`)
      .once("value");
    const genericMetrics = this.expandGenericMetrics("root", snapshot.val());

    const usage = genericMetrics.metrics[0];
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
        that.populateLabUsage(user, this.allLabs);
        users.set(user.nickname, user);
      }
    }
    this.users = users;
    return users;
  }

  filterUsers(users: Map<string, UserMetric>, students: Student[]) {
    const enrolledUsersMap = new Map<string, Student>();
    students.forEach(student => {
      enrolledUsersMap.set(student.github, student);
    });
    users.forEach(user => {
      const student = enrolledUsersMap.get(user.nickname);
      if (student) {
        user.name = student.name;
      } else {
        users.delete(user.nickname);
      }
    });
    return users;
  }

  async startMetricsService(course: Course) {
    this.course = course;
    this.allLabs = this.course.walls.get("lab");
    await this.fetchAllUsers(this.course);
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    this.users.forEach(user => {
      const userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
      this.subscribeToUserStatus(user, userEmailSanitised);
      this.subscribeToUserLabs(user, userEmailSanitised);
      this.subscribeToUserTopics(user, userEmailSanitised);
    });
  }

  subscribeToUserStatus(user: User, email: string) {
    const that = this;
    firebase
      .database()
      .ref(`${this.courseBaseName}/users/${email}`)
      .on("value", function(snapshot) {
        const userUpdate = that.expandGenericMetrics("root", snapshot.val());
        const user = that.users.get(userUpdate.nickname);
        user.onlineStatus = userUpdate.onlineStatus;
      });
  }

  subscribeToUserLabs(user: User, email: string) {
    const that = this;
    this.allLabs.forEach(lab => {
      const labRoute = lab.route.split("topic");
      const route = `${this.courseBaseName}/users/${email}/topic${labRoute[1]}`;
      firebase
        .database()
        .ref(route)
        .on("value", function(snapshot) {
          that.eb.emitLabUpdate(user, lab.title);
        });
    });
  }

  subscribeToUserTopics(user, email: string) {
    const that = this;
    const topics = this.course.topics;

    topics.forEach(topic => {
      const route = `${this.courseBaseName}/users/${email}/${topic.lo.id}`;
      firebase
        .database()
        .ref(route)
        .on("value", function(snapshot) {
          const datum = snapshot.val();
          if (datum && datum.title) {
            that.eb.emitTopicUpdate(user, topic.lo.title);
          }
        });
    });
  }
}
