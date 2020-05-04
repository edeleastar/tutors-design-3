import { MarkdownParser } from "../../services/utils/markdown-parser";
import environment from "../../environment";
import { Lo } from "../../services/course/lo";
import { BaseView } from "../base/base-view";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
const path = require("path");

export class LabView extends BaseView {
  lab: Lo;
  content = "";
  url = "";
  currentChapterShortTitle = "";
  navbarHtml = "";
  markdownParser = new MarkdownParser();
  chaptersHtml = new Map<string, string>();
  objectivesHtml = "";

  refreshav() {
    this.navbarHtml = "";
    this.lab.los.forEach(chapter => {
      const active = chapter.shortTitle == this.currentChapterShortTitle ? "class= uk-active" : "";
      this.navbarHtml = this.navbarHtml.concat(
        `<li ${active}> <a href="${environment.urlPrefix}lab/${this.url}/${chapter.shortTitle}"> ${chapter.shortTitle} </a> </li>`
      );
    });
  }

  async fecthLab() {
    if (!this.lab) {
      this.lab = await this.courseRepo.fetchLab(this.url);
      this.objectivesHtml = this.markdownParser.parse(this.lab.los[0].contentMd, this.url)
      this.lab.los.forEach(chapter => {
        this.chaptersHtml.set(chapter.shortTitle, this.markdownParser.parse(chapter.contentMd, this.url))
      })
    }
  }
  async activate(params) {
    const lastSegment = params.laburl.substr(params.laburl.lastIndexOf("/") + 1);
    if (lastSegment.startsWith("book")) {
      this.url = params.laburl;
      await this.fecthLab();
      this.currentChapterShortTitle = this.lab.los[0].shortTitle;
      this.content = this.objectivesHtml;
    } else {
      this.url = path.dirname(params.laburl);
      await this.fecthLab();
      this.currentChapterShortTitle = lastSegment;
      this.content = this.chaptersHtml.get(lastSegment);
    }
    this.refreshav();
    super.init(`lab/${params.laburl}`, this.lab);
  }

  configMainNav(nav: NavigatorProperties) {
    nav.config(
      {
        titleCard: true,
        parent: true,
        profile: true,
        companions: false,
        walls: true,
        tutorsTime: false,
        toc: true
      },
      {
        title: this.lab.title,
        subtitle: this.courseRepo.course.lo.title,
        img: this.lab.img,
        parentLink: this.lab.parent.lo.route,
        parentIcon: "topic",
        parentTip: "To parent topic ..."
      }
    );
  }
}

