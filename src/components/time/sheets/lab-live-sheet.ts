import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { LabSheet } from "./lab-sheet";
import { deepScheme, liveScheme, shallowScheme } from "./heat-map-colours";

export class LabLiveSheet extends LabSheet {
  title = "Whos is Here?";
  subtitle = "Students doing labs right now";

  columnDefs: any = [
    { headerName: "Github Profile Name", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" },
  ];

  populateCols(los: Lo[]) {
    los.forEach(lab => {
      this.columnDefs.push({
        headerName: lab.title,
        width: 70,
        field: lab.title,
        suppressSizeToFit: true,
        cellClassRules: liveScheme
      });
    });
  }

  populateRow(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
    //this.zeroEntries(los, row);

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        });
        if (labSummaryCount === 0) {
          row[`${labMetric.title}`] = "-";
        } else {
          row[`${labMetric.title}`] = labSummaryCount;
        }
      }
      summaryCount = summaryCount + labSummaryCount;
    });
    row.summary = summaryCount;
    this.rowData.push(row);
  }

  updateRow(user: UserMetric, rowNode) {
    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        });
        if (labSummaryCount > 0) {
          rowNode.setDataValue(`${labMetric.title}`, labSummaryCount);
        } else {
          rowNode.setDataValue(`${labMetric.title}`, "-");
        }
      }
      summaryCount = summaryCount + labSummaryCount;
    });
    rowNode.setDataValue("summary", summaryCount);
  }
}
