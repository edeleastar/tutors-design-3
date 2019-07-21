import { bindable } from "aurelia-framework";
import { Lo } from "../../../services/lo";

export class VideoCard {
  @bindable
  lo: Lo;
  @bindable
  autoplay = false;

  videoid = "";

  attached() {
    const parts = this.lo.video.split("/");
    this.videoid = parts.pop() || parts.pop();
  }
}
