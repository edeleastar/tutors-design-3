import { autoinject } from "aurelia-framework";
import { NavigatorProperties } from "./navigator-properties";
import { AnalyticsService } from "../../../services/analytics/analytics-service";
import { EventAggregator } from "aurelia-event-aggregator";
import { EventBus, LoginListener } from "../../../services/events/event-bus";
import { User } from "../../../services/events/event-definitions";

@autoinject
export class LiveNavigator implements LoginListener {
  onlineStatus = true;

  constructor(private navigatorProperties: NavigatorProperties, private analyticsService : AnalyticsService, private eb: EventBus) {
  }

  attached() {
    this.eb.observeLogin(this);
    this.onlineStatus = this.analyticsService.getOnlineStatus();
  }

  statusChange() {
    this.onlineStatus = !this.onlineStatus;
    this.analyticsService.setOnlineStatus(this.onlineStatus);
  }

  login(user: User, url: string) {
  }

  statusUpdate(status: string) {
    this.onlineStatus = status == "online";
  }

  logout() {}
}
