import { ICellRendererParams } from "ag-grid-community";
import { Lo } from "../../../services/lo";
import { UserMetric } from "../../../services/metrics-service";
import { deepScheme, shallowScheme } from "./heat-map-colours";

export class LabSheet {
  title = "";
  subtitle = "";

  columnDefs: any = [
    { headerName: "Rank", field: "index", pinned: "left", width: 40, suppressSizeToFit: true },
    { headerName: "User", field: "user", width: 180, suppressSizeToFit: true, pinned: "left" },
    { headerName: "Github", field: "github", width: 80, suppressSizeToFit: true, cellRenderer: this.renderGithub },
    { headerName: "Total", field: "summary", width: 60, suppressSizeToFit: true },
    { headerName: "Date Last Accessed", field: "date", width: 90, suppressSizeToFit: true }
  ];
  sortModel = [{ colId: "summary", sort: "dsc" }];
  rowData = [];

  renderGithub(params: ICellRendererParams) {
    if (params.value) {
      var nameElement = document.createElement("span");
      var a = document.createElement("a");
      var linkText = document.createTextNode(params.value);
      a.appendChild(linkText);
      a.title = params.value;
      a.href = "http://github.com/" + a.title;
      a.setAttribute("target", "_blank");
      nameElement.appendChild(a);
      return nameElement;
    }
  }

  formatName(userName: string, email: string) {
    let name = userName;
    const fullName = name;
    if (name === email) {
      name = "~~ " + email;
    } else {
      var firstName = fullName
        .split(" ")
        .slice(0, -1)
        .join(" ");
      var lastName = fullName
        .split(" ")
        .slice(-1)
        .join(" ");
      name = lastName + ", " + firstName;
    }
    return name;
  }

  creatRow(user: UserMetric) {
    let row = {
      user: this.formatName(user.name, user.email),
      summary: 0,
      date: user.last,
      github: user.nickname
    };
    return row;
  }

  render(grid) {
    if (grid) {
      grid.api.setColumnDefs(this.columnDefs);
      grid.api.setRowData(this.rowData);
      grid.api.setSortModel(this.sortModel);
    }
  }

  clear (grid) {
    if (grid) {
      grid.api.setRowData([]);
      this.rowData = [];
      this.columnDefs.length = 5;
    }
  }

  zeroEntries(los: Lo[], row) {
    los.forEach(lab => {
      row[`${lab.title}`] = 0;
    });
  }

  zeroEntriesComplete(los: Lo[], row) {
    los.forEach(lab => {
      lab.los.forEach(step => {
        row[`${lab.title + step.shortTitle}`] = 0;
      });
    });
  }

  populateCols(los: Lo[]) {}
  populateRow(user: UserMetric, los: Lo[]) {}
  updateRow(user: UserMetric, rowNode) {}
}
