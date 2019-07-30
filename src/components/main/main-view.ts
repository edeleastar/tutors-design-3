import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { autoinject } from "aurelia-framework";
import {BaseView} from "../base/base-view";

@autoinject
export class MainView extends BaseView {

  async activate(params, route) {
    this.navigatorProperties.title = "Tutors Tuition System";
    this.navigatorProperties.subtitle = "Eamonn de Leastar, WIT Computing";
  }
}
