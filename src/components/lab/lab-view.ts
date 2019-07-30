import { MarkdownParser } from "../../services/markdown-parser";
import environment from "../../environment";
import { Lo } from "../../services/lo";
import { BaseView } from "../base/base-view";
const path = require("path");

export class LabView extends BaseView {
  lab: Lo;
  content = "";
  url = "";
  currentChapter: Lo;
  navbarHtml = "";
  markdownParser = new MarkdownParser();

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

  async activate(params, route) {
    const lastSegment = params.laburl.substr(params.laburl.lastIndexOf("/") + 1);
    let chapter: Lo = null;
    if (lastSegment.startsWith("book")) {
      this.url = params.laburl;
      this.lab = await this.courseRepo.fetchLab(this.url);
      this.currentChapter = this.lab.los[0];
    } else {
      this.url = path.dirname(params.laburl);
      this.lab = await this.courseRepo.fetchLab(this.url);
      this.currentChapter = this.lab.los.find(ch => ch.shortTitle == lastSegment);
    }

    this.refreshav();
    this.content = this.markdownParser.parse(this.currentChapter.contentMd, this.url);
    super.init("lab", this.lab);
  }
}
