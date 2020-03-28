import { autoinject } from "aurelia-framework";
import { NavigatorProperties } from "./navigator-properties";
import { AnalyticsService, OnlineStatusEvent } from "../../../services/analytics-service";
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject
export class LiveNavigator {
  onlineStatus = true;

  constructor(private navigatorProperties: NavigatorProperties, private analyticsService: AnalyticsService, private ea: EventAggregator) {
    this.onlineStatus = this.analyticsService.getOnlineStatus();

    this.ea.subscribe(OnlineStatusEvent, statusEvent => {
      this.onlineStatus = statusEvent.status == "online";
    });
  }

  statusChange() {
    this.onlineStatus = !this.onlineStatus;
    this.analyticsService.setOnlineStatus(this.onlineStatus);
  }
}
