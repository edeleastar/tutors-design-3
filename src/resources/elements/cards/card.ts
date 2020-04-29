import { Lo } from '../../../services/course/lo';
import { bindable } from 'aurelia-framework';

export class Card {
  @bindable
  lo: Lo;

  attached() {
    if (this.lo.route.endsWith("error: missing talk")) {
      this.lo.properties = {disable:"true"}
    }
  }
}
