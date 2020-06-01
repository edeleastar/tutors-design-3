import { EventBus, InstructorModeListener } from "./../../../services/events/event-bus";
import { Row, generateRows } from "./../../../services/utils/card-utils";
import { Lo } from "../../../services/course/lo";
import { bindable } from "aurelia-framework";
import { autoinject } from "aurelia-framework";

@autoinject
export class CardDeck implements InstructorModeListener {
  @bindable
  los: Lo[];
  loRows: Row[] = [];

  constructor(private eb: EventBus) {
    eb.observeInstructorMode(this);
  }

  instructorModeUpdate(mode: boolean, los: Lo[]): void {
    this.loRows = generateRows(los);
  }

  attached() {
    this.loRows = generateRows(this.los);
  }
}
