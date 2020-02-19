import { GridOptions } from "ag-grid-community";
import { UsersUpdateEvent, UserUpdateEvent } from "../../services/metrics-service";
import { BaseView } from "../base/base-view";
import { LabSheet } from "./sheets/lab-sheet";
import { Course } from "../../services/course";
import { LabClickSummarySheet } from "./sheets/lab-click-summary-sheet";
import environment from "../../environment";
import { LabClickSheet } from "./sheets/lab-click-sheet";
import { LabTimeSheet } from "./sheets/lab-time-sheet";
import { LabsTimeSummarySheet } from "./sheets/lab-time-summary-sheet";

export class TutorsTimeView extends BaseView {
  course: Course;
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
  sheet : LabSheet = null;

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
    this.courseRepo.course.populate();
    this.course = this.courseRepo.course;
    await this.metricsService.updateMetrics(this.courseRepo.course);
    super.init(`time/${params.courseurl}`);

    this.sheet = this.sheets.get(params.metric);
    this.sheet.clear(this.grid);

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
        title: `Tutors Time for ${this.course.lo.title}`,
        subtitle: "Aggegate page views for Labs",
        img: this.course.lo.img,
        parentLink: `${environment.urlPrefix}/course/${this.course.url}`,
        parentIcon: "moduleHome",
        parentTip: "To module home ..."
      }
    );

    this.ea.subscribe(UserUpdateEvent, userEvent => {
      if (this.grid) {
        let rowNode = this.grid.api.getRowNode(userEvent.user.nickname);
        if (rowNode) {
          this.sheet.updateRow(userEvent.user, rowNode);
        }
      }
    });
    this.ea.subscribe(UsersUpdateEvent, usersMap => {
      this.populateRows();
    });

    this.sheet.populateCols(this.metricsService.allLabs);
    this.populateRows();
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

  populateRows() {
    this.metricsService.usersMap.forEach((user, id) => {
      this.sheet.populateRows(user, this.metricsService.allLabs);
    });
    this.update();
  }
}
