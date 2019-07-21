import { Lo } from "./lo";;
import { HttpClient } from "aurelia-fetch-client";
import { injectCourseUrl } from "./utils";

export class Course {
  lo: Lo;
  standardLos: Lo[];
  url: string;

  constructor(private http: HttpClient, url:string) {
    this.url = url;
  }

  async fetch(url: string, complete = false) {
    const response = await this.http.fetch("https://" + url + "/tutors.json");
    const lo = await response.json();
    injectCourseUrl(lo, url);
    return lo;
  }

  populate() {
    this.standardLos = this.lo.los;
  }

  async fetchCourse() {
    this.lo = await this.fetch(this.url);
    this.populate();
  }
}
