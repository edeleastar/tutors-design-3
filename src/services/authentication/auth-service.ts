import { WebAuth, Auth0DecodedHash } from "auth0-js";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { EventEmitter } from "events";
import { Course } from "../course/course";
import environment from "../../environment";
import { decrypt, encrypt } from "../utils/utils";
import { EventBus } from "../events/event-bus";
import { User } from "../events/event-definitions";

const authLevels = {
  course: 4,
  topic: 3,
  talk: 2,
  wall: 2,
  lab: 1
};

@autoinject
export class AuthService {
  private accessToken: string;
  authNotifier = new EventEmitter();

  auth0 = new WebAuth({
    domain: environment.auth0.domain,
    clientID: environment.auth0.clientId,
    redirectUri: environment.auth0.redirectUri,
    audience: `https://${environment.auth0.domain}/userinfo`,
    responseType: "token id_token",
    scope: "openid"
  });

  constructor(private router: Router, private eb: EventBus) {
    this.authNotifier.setMaxListeners(21);
  }

  isProtected(course: Course, loType: string) {
    return course.authLevel >= authLevels[loType];
  }

  checkAuth(course: Course, loType: string) {
    let status = true;
    if (this.isProtected(course, loType)) {
      if (!this.isAuthenticated()) {
        status = false;
        localStorage.setItem("course_url", course.url);
        this.login();
      } else {
        const user = this.fromLocalStorage();
        this.eb.emitLogin(user, course.url);
      }
    }
    return status;
  }

  handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        let that = this;
        this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
          if (err) {
            console.log("Error loading the Profile", err);
          }
          that.toLocalStorage(user);
          const url = localStorage.getItem("course_url");
          user.userId = encrypt(user.email);
          that.eb.emitLogin(user, url);
        });

        this.setSession(authResult);

        const url = localStorage.getItem("course_url");
        this.router.navigate(`/course/${url}`);

        this.authNotifier.emit("authChange", { authenticated: true });
      } else if (err) {
        console.log(err);
      }
    });
  }

  login() {
    this.auth0.authorize({ prompt: "login", scope: "openid profile email" });
  }

  setSession(authResult) {
    // 6 hour token
    let expiresAt = JSON.stringify(authResult.expiresIn * 3000 + new Date().getTime());
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  logout() {
    this.clearLocalStorage();
    this.authNotifier.emit("authChange", false);
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    if (expiresAt) {
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

  getUserEmail() {
    const user = this.fromLocalStorage();
    return user.email;
  }

  toLocalStorage(user: User) {
    const id = encrypt(user.email);
    const info = encrypt(user.name);
    const picture = encrypt(user.picture);
    const nickname = encrypt(user.nickname);
    localStorage.setItem("id", id);
    localStorage.setItem("info", info);
    localStorage.setItem("infoextra", picture);
    localStorage.setItem("infoextraplus", nickname);
  }

  fromLocalStorage() {
    const id = localStorage.getItem("id");
    const user = {
      userId: localStorage.getItem("id"),
      email: decrypt(id),
      picture: decrypt(localStorage.getItem("infoextra")),
      name: decrypt(localStorage.getItem("info")),
      nickname: decrypt(localStorage.getItem("infoextraplus")),
      onlineStatus : ""
    };
    return user;
  }

  clearLocalStorage() {
    localStorage.removeItem("id");
    localStorage.removeItem("info");
    localStorage.removeItem("infoextra");
    localStorage.removeItem("infoextraplus");
    localStorage.removeItem("course_url");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }
}
