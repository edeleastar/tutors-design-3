import { GridOptions } from "ag-grid-community";
import { UsersUpdateEvent, UserUpdateEvent } from "../../services/metrics-service";
import { BaseView } from "../base/base-view";
import { LabSheet } from "./sheets/lab-sheet";
import { Course } from "../../services/course";
import { LabClickSummarySheet } from "./sheets/lab-click-summary-sheet";
import environment from "../../environment";

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
  sheet: LabSheet = null;

  async activate(params, subtitle: string) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.courseRepo.course.populate();
    this.course = this.courseRepo.course;




    await this.metricsService.updateMetrics(this.courseRepo.course);

    if (params.metric === "viewsummary") {
      this.sheet = new LabClickSummarySheet();
    }

    super.init(`time/${params.courseurl}`);

    this.navigatorProperties.title = `Tutors Time for ${this.course.lo.title}`;
    this.navigatorProperties.subtitle = "Aggegate page views for Labs";
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";
    this.navigatorProperties.companions = [];
    this.navigatorProperties.walls = [];
    this.navigatorProperties.tutorstime = true;

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
    this.populateRows()
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
