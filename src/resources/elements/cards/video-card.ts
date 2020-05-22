import { bindable } from "aurelia-framework";
import { Lo } from "../../../services/course/lo";

export class VideoCard {
  @bindable
  lo: Lo;
  @bindable
  autoplay = false;

  videoid = "";
  videolink = "";
  native = false;

  attached() {
    if (this.lo.videolink) {
      this.native = true;
      this.videolink = this.lo.videolink;
    } else {
      const parts = this.lo.video.split("/");
      this.videoid = parts.pop() || parts.pop();
    }
  }
}
