import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import { autoinject } from "aurelia-framework";

@autoinject
export class MainView {

  constructor(private navigatorProperties:NavigatorProperties) {
    this.navigatorProperties.title = "Tutors Tuition System";
    this.navigatorProperties.subtitle = "Eamonn de Leastar, WIT Computing";
  }
}
