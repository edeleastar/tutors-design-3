import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../base/base-view";
import { LabSheet } from "./sheets/lab-sheet";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { SingleUserUpdateEvent, UserMetric } from "../../services/metrics-service";
import { LabLiveSheet } from "./sheets/lab-live-sheet";

export class TutorsLiveView extends BaseView {
  grid = null;
  subscribed = false;

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
  sheets: Map<string, LabSheet> = new Map();
  usersMap = new Map<string, number>();
  usersMetricMap = new Map<string, UserMetric>();
  sheet: LabSheet = new LabLiveSheet();

  async activate(params, subtitle: string) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.authService.checkAuth(this.courseRepo.course, "talk");
    this.course = this.courseRepo.course;
    super.init(`time/${params.courseurl}`);
    this.app.live = true;
    this.sheet.clear(this.grid);
    this.sheet.populateCols(this.course.walls.get("lab"));
    this.populateTime();
  }

  async populateTime() {
    await this.metricsService.retrieveAllUsers(this.course);
    if (!this.subscribed) {
      this.subscribed = true;
      this.metricsService.subscribeToAll(this.course);
      this.ea.subscribe(SingleUserUpdateEvent, userEvent => {
        this.singleUserUpdate(userEvent.user);
      });
    }
  }

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

  singleUserUpdate(user: UserMetric) {
    if (!user.onlineStatus || user.onlineStatus == "online") {
      this.processLiveUpdate(user);
    }
  }

  bulkUserUpdate(users: Map<string, UserMetric>) {
    this.metricsService.usersMap.forEach((user, id) => {
      this.sheet.populateRow(user, this.metricsService.allLabs);
    });
    this.update();
  }

  configMainNav(nav: NavigatorProperties) {
    this.navigatorProperties.config(
      {
        titleCard: true,
        parent: false,
        profile: false,
        companions: false,
        walls: false,
        tutorsTime: false,
        toc: false
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

  processLiveUpdate(user: UserMetric) {
    const userRef = this.usersMap.get(user.nickname);
    if (userRef) {
      const baseLineMetric = this.usersMetricMap.get(user.nickname);

      let summaryCount = 0;
      user.labActivity.forEach((labMetric, i) => {
        let labSummaryCount = 0;
        if (labMetric) {
          labMetric.metrics.forEach((stepMetric, j) => {
            if (stepMetric.duration) {
              if (baseLineMetric.labActivity[i] && baseLineMetric.labActivity[i].metrics[j]) {
                stepMetric.duration = stepMetric.duration - baseLineMetric.labActivity[i].metrics[j].duration;
              }
            }
          });
        }
      });

      if (userRef == 1) {
        this.sheet.populateRow(user, this.metricsService.allLabs);
        this.update();
        this.usersMap.set(user.nickname, 2);
      } else {
        let rowNode = this.grid.api.getRowNode(user.nickname);
        if (rowNode) {
          this.sheet.updateRow(user, rowNode);
        }
      }
    } else {
      this.usersMap.set(user.nickname, 1);
      this.usersMetricMap.set(user.nickname, user);
    }
  }
}
