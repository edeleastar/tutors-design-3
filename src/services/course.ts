import { Lo } from "./lo";;
import { HttpClient } from "aurelia-fetch-client";
import { injectCourseUrl } from "./utils";
import {Topic} from "./topic";

export class Course {
  lo: Lo;
  standardLos: Lo[];
  url: string;
  topicIndex = new Map<string,Topic>();

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
    for (let lo of this.lo.los) {
      const topic = new Topic(lo, this.url);
      this.topicIndex.set(lo.id, topic);
    }
    this.standardLos = this.lo.los;
  }

  async fetchCourse() {
    this.lo = await this.fetch(this.url);
    this.populate();
  }
}
