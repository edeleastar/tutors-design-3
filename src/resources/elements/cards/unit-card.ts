import { Lo } from "../../../services/course/lo";
import { bindable } from "aurelia-framework";
import { Row, generateRows } from "services/utils/card-utils";

export class UnitCard {
  @bindable
  unit: Lo;
  panelVideos: Lo[];
  standardLos: Lo[];
  loRows: Row[] = [];

  attached() {
    this.panelVideos = this.unit.los.filter((lo) => lo.type == "panelvideo");
    this.standardLos = this.unit.los.filter((lo) => lo.type != "panelvideo");
    this.loRows = generateRows(this.standardLos);
  }
}
