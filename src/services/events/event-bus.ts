import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Course } from "../course/course";
import { Lo } from "../course/lo";
import {
  LabUpdateEvent,
  StatusUpdateEvent,
  TopicUpdateEvent,
  User,
  UserMetric,
  UserUpdate,
  LoginEvent,
  LogoutEvent,
  InteractionEvent,
  KeyEvent,
  InstructorMode,
} from "./event-definitions";
import { emitKeypressEvents } from "readline";

export interface KeyListener {
  keyPress(key: string);
}

export interface LoginListener {
  login(user: User, url: string): void;
  statusUpdate(status: string): void;
  logout(): void;
}

export interface InteractionListener {
  log(path: string, course: Course, lo: Lo): void;
}

export interface CourseListener {
  labUpdate(user: User, labTitle: string): void;
  topicUpdate(user: User, topicTitle: string): void;
  loggedInUserUpdate(user: UserMetric): void;
}

export interface InstructorModeListener {
  instructorModeUpdate(mode: boolean, los: Lo[]): void;
}
@autoinject
export class EventBus {
  constructor(private ea: EventAggregator) {}

  emitKey(key: string) {
    this.ea.publish(new KeyEvent(key));
  }

  emitLogin(user: User, url: string) {
    this.ea.publish(new LoginEvent(user, url));
  }

  emitStatusUpdate(status: string) {
    this.ea.publish(new StatusUpdateEvent(status));
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

  emitLoggedinUserUpdate(user: UserMetric) {
    this.ea.publish(new UserUpdate(user));
  }

  emitInstructorModeUpdate(mode: boolean, los: Lo[]) {
    this.ea.publish(new InstructorMode(mode, los));
  }

  observeLogin(listener: LoginListener) {
    this.ea.subscribe(LoginEvent, (event) => {
      listener.login(event.user, event.courseUrl);
    });
  }

  observeLogout(listener: LoginListener) {
    this.ea.subscribe(LoginEvent, (event) => {
      listener.logout();
    });
  }

  observeInteraction(listener: InteractionListener) {
    this.ea.subscribe(InteractionEvent, (event) => {
      listener.log(event.path, event.course, event.lo);
    });
  }

  observeCourse(listener: CourseListener) {
    this.ea.subscribe(LabUpdateEvent, (event) => {
      listener.labUpdate(event.user, event.lab);
    });
    this.ea.subscribe(TopicUpdateEvent, (event) => {
      listener.topicUpdate(event.user, event.topic);
    });
  }

  observeLoggedInUser(listener: CourseListener) {
    this.ea.subscribe(UserUpdate, (event) => {
      listener.loggedInUserUpdate(event.user);
    });
  }

  observerKeyPress(listener: KeyListener) {
    this.ea.subscribe(KeyEvent, (event) => {
      listener.keyPress(event.key);
    });
  }

  observeInstructorMode(listener: InstructorModeListener) {
    this.ea.subscribe(InstructorMode, (event) => {
      listener.instructorModeUpdate(event.mode, event.los);
    });
  }
}
