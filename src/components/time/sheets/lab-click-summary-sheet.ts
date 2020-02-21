import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { LabSheet } from "./lab-sheet";
import {deepScheme, shallowScheme} from "./heat-map-colours";

export class LabClickSummarySheet extends LabSheet {

  title = "Lab Page Views - Totals";
  subtitle = "Total page views for each step in a lab";

  totalStepsPerLab = [];

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

  populateRow(user: UserMetric, los: Lo[]) {
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
          labSummaryCount = labSummaryCount + stepMetric.count;
        });
        row[`${labMetric.title}`] = labSummaryCount;
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
          labSummaryCount = labSummaryCount + stepMetric.count;
        });
        rowNode.setDataValue(`${labMetric.title}`, labSummaryCount);
      }
      summaryCount = summaryCount + labSummaryCount;
    });

    rowNode.setDataValue("summary", summaryCount);
  }
}
