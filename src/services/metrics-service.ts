import { Course } from "./course";
import * as firebase from "firebase/app";
import "firebase/database";
import environment from "../environment";
import { Lo } from "./lo";
import { inject } from "aurelia-dependency-injection";
import { EventAggregator } from "aurelia-event-aggregator";
import DataSnapshot = firebase.database.DataSnapshot;

export class UserUpdateEvent {
  user: UserMetric;
  constructor(user) {
    this.user = user;
  }
}

export class UsersUpdateEvent {
  usersMap = new Map<string, UserMetric>();
  constructor(usersMap) {
    this.usersMap = usersMap;
  }
}

export interface Metric {
  id: string;
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
}

export interface UserMetric {
  userId: string;
  email: string;
  picture: string;
  name: string;
  nickname: string;
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
  labActivity: Metric[];
}

@inject(EventAggregator)
export class MetricsService {
  usage: Metric;
  usersMap = new Map<string, UserMetric>();
  course: Course;
  allLabs: Lo[] = [];

  constructor(private ea: EventAggregator) {
    //firebase.initializeApp(environment.firebase);
  }

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

  async retrieveMetrics(course: Course) {
    const that = this;
    if (!this.course || this.course != course) {
      this.course = course;
      const courseBaseName = course.url.substr(0, course.url.indexOf("."));
      firebase
        .database()
        .ref(`${courseBaseName}`)
        .once("value", function(snapshot: DataSnapshot) {
          const genericMetrics = that.expandGenericMetrics("root", snapshot.val());
          that.usage = genericMetrics.metrics[0];
          for (let userMetric of genericMetrics.metrics[1].metrics) {
            if (userMetric.nickname) {
              const user = {
                userId: userMetric.id,
                email: userMetric.email,
                name: userMetric.name,
                picture: userMetric.picture,
                nickname: userMetric.nickname,
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
              that.subscribe(course, courseBaseName, user.email);
            }
          }
          that.ea.publish(new UsersUpdateEvent(that.usersMap));
        });
    }
  }

  async updateMetrics(course: Course) {
    this.allLabs = course.walls.get("lab");
    this.retrieveMetrics(course);
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
        that.ea.publish(new UserUpdateEvent(user));
      });
  }
}
