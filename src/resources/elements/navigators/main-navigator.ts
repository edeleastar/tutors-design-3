import { autoinject } from "aurelia-framework";
import { NavigatorProperties } from "./navigator-properties";

@autoinject
export class MainNavigator {
  constructor(private navigatorProperties: NavigatorProperties) {}
}
