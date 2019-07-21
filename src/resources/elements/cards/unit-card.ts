import { Lo } from '../../../services/lo';
import { bindable } from 'aurelia-framework';

export class UnitCard {
  @bindable
  unit: Lo;
  panelVideos: Lo[];
  standardLos: Lo[];

  attached() {
    this.panelVideos = this.unit.los.filter(lo => lo.type == 'panelvideo');
    this.standardLos = this.unit.los.filter(lo => lo.type != 'panelvideo');
  }
}
