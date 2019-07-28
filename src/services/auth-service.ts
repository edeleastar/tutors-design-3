import { WebAuth, Auth0DecodedHash } from "auth0-js";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { EventEmitter } from "events";
import { Course } from "./course";
import environment from "../environment";

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
    redirectUri: "http://localhost:8080/authorize",
    //redirectUri: "https://tutors-design-dev.netlify.com/callback",
    audience: `https://${environment.auth0.domain}/userinfo`,
    responseType: "token id_token",
    scope: "openid"
  });

  constructor(private router: Router) {
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
      }
    }
    return status;
  }

  handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
          if (err) {
            console.log("Error loading the Profile", err);
          }
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
    this.auth0.authorize({ prompt: "login", scope: "openid profile" });
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
