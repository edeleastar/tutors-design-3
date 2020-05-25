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
    if (this.lo.videoids) {
      if (this.lo.videoids.videoIds.length > 0) {
        if (this.lo.videoids.videoIds[this.lo.videoids.videoIds.length - 1].service === "heanet") {
          this.theoplayer = true;
          let id = this.lo.videoids.videoIds[this.lo.videoids.videoIds.length - 1].id;
          this.playerSource[0].src = `https://media.heanet.ie/m3u8/${id}`;
        }
      }
    }
  }

  attached() {
    const parts = this.lo.video.split("/");
    this.videoid = parts.pop() || parts.pop();
  }
}
