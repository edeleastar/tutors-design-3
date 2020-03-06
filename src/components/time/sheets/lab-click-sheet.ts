import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { LabSheet } from "./lab-sheet";
import { shallowScheme } from "./heat-map-colours";

export class LabClickSheet extends LabSheet {
  title = "Lab Page Views - Detailed";
  subtitle = "Total page view for all steps in each lab";

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
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.count) {
            row[`${labMetric.title + stepMetric.title}`] = stepMetric.count;
            summaryCount = summaryCount + stepMetric.count;
          }
        });
      }
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
          if (stepMetric.count) {
            rowNode.setDataValue(`${labMetric.title + stepMetric.title}`, stepMetric.count);
            labSummaryCount = labSummaryCount + stepMetric.count;
          }
        });
      }
      summaryCount = summaryCount + labSummaryCount;
    });
    rowNode.setDataValue("summary", summaryCount);
  }
}
