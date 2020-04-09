import * as firebase from "firebase/app";
import "firebase/database";
import { Lo } from "../course/lo";
import environment from "../../environment";
import { Course } from "../course/course";
import { analyicsPageTitle } from "../utils/utils";
import { EventAggregator } from "aurelia-event-aggregator";
import { EventBus, InteractionListener, LoginListener, User } from "../event-bus";
import { autoinject } from "aurelia-framework";


@autoinject
export class AnalyticsService implements LoginListener, InteractionListener {
  courseBaseName = "";
  userEmail = "";
  userEmailSanitised = "";
  userId = "";
  firebaseIdRoot = "";
  firebaseEmailRoot = "";
  url = "";
  onlineStatus = false;

  constructor(private ea: EventAggregator, private eb: EventBus) {
    firebase.initializeApp(environment.firebase);
    this.eb.observeLogin(this);
    this.eb.observeInteraction(this);
  }

  getOnlineStatus(): boolean {
    return this.onlineStatus;
  }

  setOnlineStatus(status: boolean) {
    this.onlineStatus = status;
    if (status) {
      this.updateStr(`${this.firebaseEmailRoot}/onlineStatus`, "online");
    } else {
      this.updateStr(`${this.firebaseEmailRoot}/onlineStatus`, "offline");
    }
  }

  login(user: User, url: string) {
    if (this.userEmail !== user.email || this.url !== url) {
      this.url = url;
      this.courseBaseName = url.substr(0, url.indexOf("."));
      this.userEmail = user.email;
      this.userId = user.userId;
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      this.reportLogin(user);

      const that = this;
      firebase
        .database()
        .ref(`${this.courseBaseName}/users/${this.userEmailSanitised}/onlineStatus`)
        .on("value", function(snapshot) {
          let status = snapshot.val();
          if (!status) {
            status = "online";
          }
          that.onlineStatus = status == "online";
          that.eb.emitStatusUpdate(status);
        });
    }
  }

  statusUpdate (status : string) {}

  logout() {
    console.log("logout");
  }

  log(path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));

    if (this.userEmail) {
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementValue(node, lo.title);
    }
  }

  logDuration(path: string, course: Course, lo: Lo) {
    if (this.userEmail) {
      this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
      this.firebaseIdRoot = `${this.courseBaseName}/usage`;
      this.firebaseEmailRoot = `${this.courseBaseName}/users/${this.userEmailSanitised}`;
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.incrementDuration(node, lo.title);
    }
  }

  logSearch(term: string, path: string, course: Course, lo: Lo) {
    this.courseBaseName = course.url.substr(0, course.url.indexOf("."));
    const title = analyicsPageTitle(this.courseBaseName, course, lo);

    if (this.userEmail) {
      let node = "";
      if (lo.type !== "course") {
        node = path.replace(course.url, "");
        node = node.substr(node.indexOf("//") + 2, node.length);
        node = node.replace(/[`#$.\[\]]/gi, "*");
      }
      this.logSearchValue(term, path);
    }
  }

  logSearchValue(term: string, path: string) {
    let searchkey = new Date().toLocaleString();
    searchkey = searchkey.replace(/[\/]/g, "-");
    let key = `${this.firebaseEmailRoot}/search/${searchkey}/term`;
    this.updateStr(key, term);
    key = `${this.firebaseEmailRoot}/search/${searchkey}/path`;
    this.updateStr(key, path);
    key = `${this.firebaseIdRoot}/search/${searchkey}/path`;
    this.updateStr(key, path);
  }

  incrementValue(key: string, title: string) {
    this.updateCount(`${this.firebaseIdRoot}/${key}/count`);
    this.updateStr(`${this.firebaseIdRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseIdRoot}/${key}/title`, title);

    this.updateCount(`${this.firebaseEmailRoot}/${key}/count`);
    this.updateStr(`${this.firebaseEmailRoot}/${key}/last`, new Date().toLocaleString());
    this.updateStr(`${this.firebaseEmailRoot}/${key}/title`, title);
  }

  incrementDuration(key: string, title: string) {
    this.updateCount(`${this.firebaseEmailRoot}/${key}/duration`);
  }

  reportLogin(user: User) {
    this.updateStr(`${this.firebaseEmailRoot}/email`, user.email);
    this.updateStr(`${this.firebaseEmailRoot}/name`, user.name);
    this.updateStr(`${this.firebaseEmailRoot}/id`, user.userId);
    this.updateStr(`${this.firebaseEmailRoot}/nickname`, user.nickname);
    this.updateStr(`${this.firebaseEmailRoot}/picture`, user.picture);
    this.updateStr(`${this.firebaseEmailRoot}/last`, new Date().toString());
    this.updateCount(`${this.firebaseEmailRoot}/count`);
  }

  updateCount(key: string) {
    let ref = firebase.database().ref(key);
    ref.transaction(function(count) {
      return (count || 0) + 1;
    });
  }

  updateStr(key: string, str: string) {
    let ref = firebase.database().ref(key);
    ref.transaction(function(value) {
      return str;
    });
  }
}
