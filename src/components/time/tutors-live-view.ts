import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../base/base-view";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { LabLiveSheet } from "./sheets/lab-live-sheet";
import { CourseListener } from "../../services/events/event-bus";
import { Lo } from "../../services/course/lo";
import { User, UserMetric } from "../../services/events/event-definitions";

let liveView: TutorsLiveView = null;

const func = () => {
  if (liveView) {
    liveView.live = true;
  }
};

setTimeout(func, 30 * 1000);

export class TutorsLiveView extends BaseView implements CourseListener {
  grid = null;
  live = false;

  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true
    },
    enableRangeSelection: true,
    enableCellChangeFlash: true,
    getRowNodeId: function(data) {
      return data.github;
    }
  };

  usersLabCount = new Map<string, number>();
  usersTopicCount = new Map<string, number>();
  sheet: LabLiveSheet = new LabLiveSheet();
  allLabs: Lo[] = [];

  async activate(params, subtitle: string) {
    liveView = this;
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.authService.checkAuth(this.courseRepo.course, "talk");
    super.init(`time/${params.courseurl}`);
    this.allLabs = this.course.walls.get("lab");
    this.app.live = true;
    this.sheet.clear(this.grid);
    this.sheet.populateCols(this.course.walls.get("lab"));
    await this.metricsService.startMetricsService(this.course);
    this.eb.observeCourse(this);
  }

  canUpdate(user: User): boolean {
    let update = false;
    if (this.live && this.grid) {
      if (!user.onlineStatus || user.onlineStatus === "online") {
        update = true;
      } else if (this.instructorMode) {
        update = true;
      }
    }
    return update;
  }

  topicUpdate(user: User, topicTitle: string) {
    if (this.canUpdate(user)) {
      let rowNode = this.grid.api.getRowNode(user.nickname);
      if (rowNode) {
        this.sheet.updateTopic(topicTitle, rowNode);
      } else {
        this.sheet.populateTopic(user, topicTitle);
        this.update();
      }
    }
  }

  labUpdate(user: User, lab: string) {
    if (this.canUpdate(user)) {
      let rowNode = this.grid.api.getRowNode(user.nickname);
      if (rowNode) {
        this.sheet.updateLab(lab, rowNode);
      } else {
        this.sheet.populateLab(user, lab);
        this.update();
      }
    }
  }

  loggedInUserUpdate(user: UserMetric) {}

  update() {
    this.sheet.render(this.grid);
  }

  private onReady(grid) {
    this.grid = grid;
    this.update();
  }

  resize(detail) {
    if (this.grid) this.grid.api.sizeColumnsToFit();
  }

  configMainNav(nav: NavigatorProperties) {
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: true,
        profile: true,
        companions: false,
        walls: false,
        toc: true
      },
      {
        title: `${this.courseRepo.course.lo.title} Live`,
        subtitle: "Students on line now",
        img: this.course.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.course.url}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      }
    );
  }
}
