import { Lo } from "../../../services/lo";
import { LabSheet } from "./lab-sheet";
import { deepScheme, liveScheme } from "./heat-map-colours";
import { User } from "../../../services/event-bus";

export class LabLiveSheet extends LabSheet {
  title = "Whos is Here?";
  subtitle = "Students doing labs right now";
  rowData = [];

  columnDefs: any = [
    { headerName: "Github Profile Name", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" }
  ];

  populateCols(los: Lo[]) {
    los.forEach(lab => {
      this.columnDefs.push({
        headerName: lab.title,
        width: 70,
        field: lab.title,
        suppressSizeToFit: true,
        cellClassRules: deepScheme
      });
    });
  }

  populateLab(user: User, lab: string) {
    let row = {
      user: user.name,
      github: user.nickname
    };
    row[`${lab}`] = 1;
    this.rowData.push(row);
  }

  updateLab(lab: string, rowNode) {
    let val = rowNode.data[lab];
    if (val) {
      val++;
    } else {
      val = 1;
    }
    rowNode.setDataValue(lab, val);
  }
}
