import { MarkdownParser } from "../../services/utils/markdown-parser";
import environment from "../../environment";
import { Lo } from "../../services/course/lo";
import { BaseView } from "../base/base-view";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { faUikit } from "@fortawesome/free-brands-svg-icons";
import { removeLeadingHashes } from "services/utils/utils";
const path = require("path");

export class LabView extends BaseView {
  lab: Lo;
  content = "";
  url = "";
  currentChapterShortTitle = "";
  currentChapterTitle = "";
  navbarHtml = "";
  markdownParser = new MarkdownParser();
  chaptersHtml = new Map<string, string>();
  chaptersTitles = new Map<string, string>();
  objectivesHtml = "";

  vertical = true;

  attached() {
    if (localStorage.labVertical) {
      if (localStorage.labVertical == "false") {
        this.vertical = false;
      } else {
        this.vertical = true;
      }
    }
    this.refreshav();
  }

  refreshav() {
    this.navbarHtml = "";
    let step = "";
    this.lab.los.forEach((chapter, i) => {
      const active = chapter.shortTitle == this.currentChapterShortTitle ? "class= uk-active" : "";
      let title = "";
      if (this.vertical) {
        title = this.chaptersTitles.get(chapter.shortTitle);
      } else {
        title = chapter.shortTitle;
      }
      if (this.vertical) {
        step = `${i}:`;
      }
      this.navbarHtml = this.navbarHtml.concat(
        `<li ${active}> <a href="${environment.urlPrefix}lab/${this.url}/${chapter.shortTitle}"> ${step} ${title} </a> </li>`
      );
    });
  }

  onClickSwitch() {
    this.vertical = !this.vertical;
    this.refreshav();
    localStorage.labVertical = this.vertical;
  }

  async fecthLab() {
    if (!this.lab) {
      this.lab = await this.courseRepo.fetchLab(this.url);
      this.objectivesHtml = this.markdownParser.parse(this.lab.los[0].contentMd, this.url);
      this.lab.los.forEach((chapter) => {
        this.chaptersHtml.set(chapter.shortTitle, this.markdownParser.parse(chapter.contentMd, this.url));
        this.chaptersTitles.set(chapter.shortTitle, removeLeadingHashes(chapter.title));
      });
    }
  }
  async activate(params) {
    const lastSegment = params.laburl.substr(params.laburl.lastIndexOf("/") + 1);
    if (lastSegment.startsWith("book")) {
      this.url = params.laburl;
      await this.fecthLab();
      this.currentChapterShortTitle = this.lab.los[0].shortTitle;
      this.currentChapterTitle = this.chaptersTitles.get(this.lab.los[0].shortTitle);
      this.content = this.objectivesHtml;
    } else {
      this.url = path.dirname(params.laburl);
      await this.fecthLab();
      this.currentChapterShortTitle = lastSegment;
      this.currentChapterTitle = this.chaptersTitles.get(lastSegment);
      this.content = this.chaptersHtml.get(lastSegment);
    }
    this.refreshav();
    super.init(`lab/${params.laburl}`, this.lab);
    this.navSubtitle(this.currentChapterTitle);
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
        toc: false,
      },
      {
        title: this.lab.title,
        subtitle: this.courseRepo.course.lo.title,
        img: this.lab.img,
        parentLink: this.lab.parent.lo.route,
        parentIcon: "topic",
        parentTip: "To parent topic ...",
      }
    );
  }
}
