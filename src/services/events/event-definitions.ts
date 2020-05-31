import { Course } from "../course/course";
import { Lo } from "../course/lo";

export interface Metric {
  id: string;
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
}

export interface User {
  userId: string;
  email: string;
  picture: string;
  name: string;
  nickname: string;
  onlineStatus: string;
}

export interface UserMetric extends User {
  title: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
  labActivity: Metric[];
}

export class LabUpdateEvent {
  user: User;
  lab: string;
  constructor(user: User, lab: string) {
    this.user = user;
    this.lab = lab;
  }
}

export class TopicUpdateEvent {
  user: User;
  topic: string;
  constructor(user: User, topic: string) {
    this.user = user;
    this.topic = topic;
  }
}

export class UserUpdate {
  user: UserMetric;
  constructor(user) {
    this.user = user;
  }
}

export class StatusUpdateEvent {
  status: string;
  constructor(status: string) {
    this.status = status;
  }
}

export class LoginEvent {
  user: User;
  courseUrl: string;
  constructor(user, url: string) {
    this.user = user;
    this.courseUrl = url;
  }
}

export class LogoutEvent {
  user: User;
  constructor(user) {
    this.user = user;
  }
}

export class InteractionEvent {
  path: string;
  course: Course;
  lo: Lo;
  constructor(path: string, course: Course, lo: Lo) {
    this.path = path;
    this.course = course;
    this.lo = lo;
  }
}

export class KeyEvent {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
}
