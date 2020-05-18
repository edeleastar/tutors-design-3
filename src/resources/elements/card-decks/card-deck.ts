import { Row, generateRows } from "./../../../services/utils/card-utils";
import { Lo } from "../../../services/course/lo";
import { bindable } from "aurelia-framework";

export class CardDeck {
  @bindable
  los: Lo[];
  loRows: Row[] = [];

  attached() {
    this.loRows = generateRows(this.los);
  }
}
