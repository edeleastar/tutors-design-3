import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Course } from "./course/course";
import { Lo } from "./course/lo";

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

export class OnlineStatusEvent {
  status = "online";
  constructor(status: string) {
    this.status = status;
  }
}

export class UserUpdate {
  user: UserMetric;
  constructor(user) {
    this.user = user;
  }
}

export class StatusUpdateEvent {
  status : string;
  constructor(status : string) {
    this.status = status;
  }
}

class LoginEvent {
  user: User;
  courseUrl: string;
  constructor(user, url: string) {
    this.user = user;
    this.courseUrl = url;
  }
}

class LogoutEvent {
  user: User;
  constructor(user) {
    this.user = user;
  }
}

class InteractionEvent {
  path: string;
  course: Course;
  lo: Lo;
  constructor(path: string, course: Course, lo: Lo) {
    this.path = path;
    this.course = course;
    this.lo = lo;
  }
}

export interface LoginListener {
  login(user: User, url: string);
  statusUpdate (status : string);
  logout();
}

export interface InteractionListener {
  log(path: string, course: Course, lo: Lo);
}

export interface CourseListener {
  labUpdate(user: User, labTitle: string);
  topicUpdate (user: User, topicTitle : string);
  loggedInUserUpdate(user : UserMetric);
}

@autoinject
export class EventBus {
  constructor(private ea: EventAggregator) {}

  emitLogin(user: User, url: string) {
    this.ea.publish(new LoginEvent(user, url));
  }

  emitStatusUpdate (status : string) {
    this.ea.publish(new StatusUpdateEvent(status))
  }

  emitLogout(user: User) {
    this.ea.publish(new LogoutEvent(user));
  }

  emitLog(path: string, course: Course, lo: Lo) {
    this.ea.publish(new InteractionEvent(path, course, lo));
  }

  emitLabUpdate(user: User, labTitle: string) {
    this.ea.publish(new LabUpdateEvent(user, labTitle));
  }

  emitTopicUpdate(user: User, labTitle: string) {
    this.ea.publish(new TopicUpdateEvent(user, labTitle));
  }

  emitLoggedinUserUpdate(user :UserMetric) {
    this.ea.publish(new UserUpdate(user));
  }

  observeLogin(listener: LoginListener) {
    this.ea.subscribe(LoginEvent, event => {
      listener.login(event.user, event.courseUrl);
    });
  }

  observeLogout(listener: LoginListener) {
    this.ea.subscribe(LoginEvent, event => {
      listener.logout();
    });
  }

  observeInteraction(listener: InteractionListener) {
    this.ea.subscribe(InteractionEvent, event => {
      listener.log(event.path, event.course, event.lo);
    });
  }

  observeCourse(listener: CourseListener) {
    this.ea.subscribe(LabUpdateEvent, event => {
      listener.labUpdate(event.user, event.lab);
    });
    this.ea.subscribe(TopicUpdateEvent, event => {
      listener.topicUpdate(event.user, event.topic);
    });
  }

  observeLoggedInUser (listener : CourseListener) {
    this.ea.subscribe(UserUpdate, event => {
      listener.loggedInUserUpdate(event.user);
    });
  }
}
