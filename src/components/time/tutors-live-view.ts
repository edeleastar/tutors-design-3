import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";
import { BaseView } from "../base/base-view";
import environment from "../../environment";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { LabLiveSheet } from "./sheets/lab-live-sheet";
import { LabUpdateEvent, StatusUpdateEvent, User } from "../../services/event-bus";
import { Lo } from "../../services/lo";

export class TutorsLiveView extends BaseView {
  grid = null;

  gridOptions: GridOptions = {
    animateRows: true,
    headerHeight: 180,
    defaultColDef: {
      sortable: true,
      resizable: true,
    },
    enableRangeSelection: true,
    enableCellChangeFlash: true,
    getRowNodeId: function(data) {
      return data.github;
    }
  };

  usersMap = new Map<string, number>();
  sheet: LabLiveSheet = new LabLiveSheet();
  allLabs: Lo[] = [];

  async activate(params, subtitle: string) {
    await this.courseRepo.fetchCourse(params.courseurl);
    this.course = this.courseRepo.course;
    this.authService.checkAuth(this.courseRepo.course, "talk");
    super.init(`time/${params.courseurl}`);
    this.allLabs = this.course.walls.get("lab");
    this.app.live = true;
    this.sheet.clear(this.grid);
    this.sheet.populateCols(this.course.walls.get("lab"));
    this.populateTime();
  }

  async populateTime() {
    const that = this;
    await this.metricsService.retrieveAllUsers(this.course);
    this.metricsService.subscribeToUserStatus(this.course);
    this.metricsService.subscribeToLabs(this.course);
    this.ea.subscribe(LabUpdateEvent, event => {
      if (!event.user.onlineStatus || event.user.onlineStatus === "online") {
        that.processLabUpdate(event.user, event.lab);
      }
    });
    // this.ea.subscribe(StatusUpdateEvent, event => {
    //   if (event.user.onlineStatus && event.user.onlineStatus === "offline") {
    //     console.log(`${event.user.email}: going offline `);
    //     let rowNode = that.grid.api.getRowNode(event.user.nickname);
    //     if (rowNode) {
    //       that.grid.api.updateRowNode({remove:[event.user.nickname]})
    //     }
    //   } else {
    //     console.log(`${event.user.email}: going online `);
    //   }
    // });
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
        tutorsTime: true,
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

  processLabUpdate(user: User, lab: string) {
    let labCount = this.usersMap.get(user.nickname);
    if (!labCount) {
      this.usersMap.set(user.nickname, 1);
    } else {
      labCount++;
      this.usersMap.set(user.nickname, labCount);
      if (labCount == this.allLabs.length + 1) {
        this.sheet.populateLab(user, lab);
        this.update();
      } else {
        let rowNode = this.grid.api.getRowNode(user.nickname);
        if (rowNode) {
          this.sheet.updateLab(lab, rowNode);
        }
      }
    }
  }
}
