import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { LabSheet } from "./lab-sheet";

export class LabsTimeSummarySheet extends LabSheet {
  totalStepsPerLab = [];

  populateRows(user: UserMetric, los: Lo[]) {
    let row = this.creatRow(user);
    this.zeroEntries(los, row);

    los.forEach(lab => {
      this.totalStepsPerLab[`${lab.title}`] = lab.los.length - 1;
    });

    let summaryCount = 0;
    user.labActivity.forEach(labMetric => {
      let labSummaryCount = 0;
      if (labMetric) {
        labMetric.metrics.forEach(stepMetric => {
          if (stepMetric.duration) {
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
