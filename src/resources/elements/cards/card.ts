import { Lo } from "../../../services/course/lo";
import { bindable } from "aurelia-framework";

export class Card {
  @bindable
  lo: Lo;
  target = "_self";

  attached() {
    if (this.lo.type == "web" && !this.lo.route.startsWith("course")) {
      this.target = "_blank";
    }
    if (this.lo.route.endsWith("error: missing talk")) {
      this.lo.properties = { disable: "true" };
    }
  }
}
