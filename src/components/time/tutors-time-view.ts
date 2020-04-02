import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../base/base-view";
import { LabSheet } from "./sheets/lab-sheet";
import { LabClickSummarySheet } from "./sheets/lab-click-summary-sheet";
import environment from "../../environment";
import { LabClickSheet } from "./sheets/lab-click-sheet";
import { LabTimeSheet } from "./sheets/lab-time-sheet";
import { LabsTimeSummarySheet } from "./sheets/lab-time-summary-sheet";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";

export class TutorsTimeView extends BaseView {
  grid = null;
  sheets: Map<string, LabSheet> = new Map();
  sheet: LabSheet = null;

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

    if (params.metric === "export") {
      this.grid.api.exportDataAsExcel();
    } else {
      this.sheet = this.sheets.get(params.metric);
    }
    super.init(`time/${params.courseurl}`);
    this.sheet.clear(this.grid);
    this.sheet.populateCols(this.course.walls.get("lab"));
    await this.populateSheet();
  }

  instructorModeEnabled() {
    this.populateSheet();
  }

  async populateSheet() {
    if (this.authService.isAuthenticated()) {
      const email = this.authService.getUserEmail();
      if (this.courseRepo.privelaged == true) {
        await this.metricsService.retrieveAllUsers(this.course);
        if (this.course.hasEnrollment()) {
          this.metricsService.filterUsers(this.course.getStudents());
        }
      } else {
        await this.metricsService.retrieveUser(this.course, email);
      }
      this.metricsService.usersMap.forEach((user, id) => {
        this.sheet.populateRow(user, this.metricsService.allLabs);
      });
      this.update();
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
