import { iconColours, faIcons } from "./styles";
import { bindable } from "aurelia-framework";

export class Icon {
  @bindable type: string;
  @bindable size: string;
  colour: string;

  icon(type: string) {
    return faIcons[type];
  }

  attached() {
    this.colour = iconColours[this.type];
  }
}
