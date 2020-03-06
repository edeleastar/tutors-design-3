import { autoinject } from "aurelia-framework";
import { BaseView } from "../base/base-view";
import environment from "../../environment";

@autoinject
export class MainView extends BaseView {
  async activate(params, route) {
    super.init();
  }
}
