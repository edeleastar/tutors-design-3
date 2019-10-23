import { WebAuth, Auth0DecodedHash } from "auth0-js";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { EventEmitter } from "events";
import { Course } from "./course";
import environment from "../environment";
import {AnalyticsService} from "./analytics-service";

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
  private id_token: string;
  private expires_at: string;

  authNotifier = new EventEmitter();

  auth0 = new WebAuth({
    domain: environment.auth0.domain,
    clientID: environment.auth0.clientId,
    redirectUri: environment.auth0.redirectUri,
    audience: `https://${environment.auth0.domain}/userinfo`,
    responseType: "token id_token",
    scope: "openid"
  });

  constructor(private router: Router, private analyticsService: AnalyticsService) {
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
        this.login();
        localStorage.setItem("course_url", course.url);
      } else {
        const userName = localStorage.getItem("userName");
        const userEmail = localStorage.getItem("userEmail");
        this.analyticsService.login({name:userName, email:userEmail});
      }
    }
    return status;
  }

  handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        let self = this;
        this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
          if (err) {
            console.log("Error loading the Profile", err);
          }
          self.analyticsService.login(user);
          localStorage.setItem("userName", user.name)
          localStorage.setItem("userEmail", user.email)
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
    let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  logout() {
    localStorage.removeItem("course_url");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    this.router.navigate("home");
    this.authNotifier.emit("authChange", false);
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    if (expiresAt) {
      return new Date().getTime() < expiresAt;
    }
    return false;
  }
}
