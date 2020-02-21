import { GridOptions } from "ag-grid-community";
import { BaseView } from "../base/base-view";
import { LabSheet } from "./sheets/lab-sheet";
import { LabClickSummarySheet } from "./sheets/lab-click-summary-sheet";
import environment from "../../environment";
import { LabClickSheet } from "./sheets/lab-click-sheet";
import { LabTimeSheet } from "./sheets/lab-time-sheet";
import { LabsTimeSummarySheet } from "./sheets/lab-time-summary-sheet";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { BulkUserUpdateEvent, SingleUserUpdateEvent, UserMetric } from "../../services/metrics-service";

export class TutorsTimeView extends BaseView {
  grid = null;

  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true
    },
    enableCellChangeFlash: true,
    getRowNodeId: function(data) {
      return data.github;
    }
  };
  sheets: Map<string, LabSheet> = new Map();
  sheet: LabSheet = null;

  initMap() {
    if (this.sheets.size == 0) {
      this.sheets.set("viewsummary", new LabClickSummarySheet());
      this.sheets.set("viewdetail", new LabClickSheet());
      this.sheets.set("timesummary", new LabsTimeSummarySheet());
      this.sheets.set("timedetail", new LabTimeSheet());
    }
  }

  async activate(params, subtitle: string) {
    this.initMap();
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    if (this.authService.isAuthenticated()) {
      const email = this.authService.getUserEmail();
      if (this.courseRepo.privelaged == true) {
        this.metricsService.subscribeToAllUsers(this.course);
      } else {
        this.metricsService.subscribeToUser(this.course, email);
      }
    }
    this.sheet = this.sheets.get(params.metric);
    super.init(`time/${params.courseurl}`);
    this.sheet.clear(this.grid);
    this.sheet.populateCols(this.metricsService.allLabs);
    this.bulkUserUpdate(this.metricsService.usersMap);
    this.ea.subscribe(SingleUserUpdateEvent, userEvent => {
      this.singleUserUpdate(userEvent.user);
    });
    this.ea.subscribe(BulkUserUpdateEvent, usersEvent => {
      this.bulkUserUpdate(usersEvent.users);
    });
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
    try {
      if (this.grid) {
        let rowNode = this.grid.api.getRowNode(user.nickname);
        if (rowNode) {
          this.sheet.updateRow(user, rowNode);
        } else {
          this.sheet.populateRow(user, this.metricsService.allLabs);
          this.update();
        }
      }
     } catch (er) {
      // console.log(er);
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
        parent: true,
        profile: true,
        companions: false,
        walls: false,
        tutorsTime: true
      },
      {
        title: this.sheet.title,
        subtitle: this.sheet.subtitle,
        img: this.course.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.course.url}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      }
    );
  }
}
