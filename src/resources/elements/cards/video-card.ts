import { bindable } from "aurelia-framework";
import { Lo } from "../../../services/course/lo";

export class VideoCard {
  @bindable
  lo: Lo;
  @bindable
  autoplay = false;

  videoid = "";
  videolink = "";

  theoplayer = false;

  playerSource = [
    {
      type: "application/x-mpegurl",
      src: "",
    },
  ];

  bind() {
    if (this.lo.videolink) {
      this.theoplayer = true;
      this.playerSource[0].src = this.lo.videolink.replace("download", "m3u8");
    }
  }

  attached() {
    const parts = this.lo.video.split("/");
    this.videoid = parts.pop() || parts.pop();
  }
}
