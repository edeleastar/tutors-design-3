import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { LabSheet } from "./lab-sheet";
import { shallowScheme } from "./heat-map-colours";

export class LabTimeSheet extends LabSheet {
  title = "Lab Time in Minutes - Detailed";
  subtitle = "Total number of minutes for step of each lab";

  populateCols(los: Lo[]) {
    los.forEach(lab => {
      lab.los.forEach(step => {
        this.columnDefs.push({
          headerName: step.shortTitle,
          width: 55,
          field: lab.title + step.shortTitle,
          suppressSizeToFit: true,
          cellClassRules: shallowScheme
        });
      });
    });
  }

  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
    this.zeroEntriesComplete(los, row);

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
            row[`${labMetric.title + stepMetric.title}`] = stepMetric.duration / 2;
            summaryCount = summaryCount + stepMetric.duration;
          }
        });
      }
    });
    row.summary = summaryCount / 2;
    this.rowData.push(row);
  }

  updateRow(user: UserMetric, rowNode) {
    let summaryCount = 0;
    for (let labMetric of user.labActivity) {
      if (labMetric) {
        for (let stepMetric of labMetric.metrics) {
          if (stepMetric.duration) {
            rowNode.setDataValue(`${labMetric.title + stepMetric.title}`, stepMetric.duration / 2);
          }
        }
      }
    }
  }
}
