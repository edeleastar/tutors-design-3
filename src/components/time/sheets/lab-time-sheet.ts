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

  populateRow(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
    this.zeroEntriesComplete(los, row);

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
            row[`${labMetric.title + stepMetric.title}`] = stepMetric.duration / 2;
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        });
        row[`${labMetric.title}`] = labSummaryCount;
      }
      summaryCount = summaryCount + labSummaryCount;
    });
    row.summary = summaryCount / 2;
    this.rowData.push(row);
  }

  updateRow(user: UserMetric, rowNode) {
    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
            rowNode.setDataValue(`${labMetric.title + stepMetric.title}`, stepMetric.duration / 2);
            labSummaryCount = labSummaryCount + stepMetric.duration / 2;
          }
        });
        rowNode.setDataValue(`${labMetric.title}`, labSummaryCount);
      }
      summaryCount = summaryCount + labSummaryCount;
    });
    rowNode.setDataValue("summary", summaryCount / 2);
  }
}
