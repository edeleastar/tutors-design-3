import { faIcons } from "./styles";
import { bindable } from "aurelia-framework";

export class Icon {
  @bindable type: string;
  @bindable size: string;

  icon(type: string) {
    return faIcons[type];
  }
}
