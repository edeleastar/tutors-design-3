import { CourseRepo } from "../../services/course-repo";
import { MarkdownParser } from "../../services/markdown-parser";
import environment from "../../environment";
import { autoinject } from "aurelia-framework";
import { Lo } from "../../services/lo";
const path = require("path");

@autoinject
export class LabView {
  lab: Lo;
  content = "";
  url = "";
  currentChapter: Lo;
  navbarHtml = "";

  constructor(private courseRepo: CourseRepo, private markdownParser: MarkdownParser) {}

  refreshav() {
    this.navbarHtml = "";
    this.lab.los.forEach(chapter => {
      const active = chapter == this.currentChapter ? "class= uk-active" : "";
      this.navbarHtml = this.navbarHtml.concat(
        `<li ${active}> <a href="${environment.urlPrefix}lab/${this.url}/${chapter.shortTitle}"> ${
          chapter.shortTitle
        } </a> </li>`
      );
    });
  }

  async activate(params) {
    const lastSegment = params.laburl.substr(params.laburl.lastIndexOf("/") + 1);
    let chapter: Lo = null;
    if (lastSegment.startsWith("book")) {
      this.url = params.laburl;
      this.lab = await this.courseRepo.fetchLab(this.url);
      console.log("lab retrieved");
      this.currentChapter = this.lab.los[0];
    } else {
      this.url = path.dirname(params.laburl);
      this.lab = await this.courseRepo.fetchLab(this.url);
      this.currentChapter = this.lab.los.find(ch => ch.shortTitle == lastSegment);
    }

    this.refreshav();
    this.content = this.markdownParser.parse(this.currentChapter.contentMd, this.url);
  }
}
