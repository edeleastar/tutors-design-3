import { inject, inlineView, bindable } from "aurelia-framework";

declare global {
  const THEOplayer: any;
}

@inlineView(
  '<template><div ref=playerEl class="theoplayer-container video-js theoplayer-skin vjs-16-9 THEOplayer">'
)
@inject(Element)
export class TheoPlayer {
  @bindable
  source;

  player: any;
  playerEl: any;

  constructor(el) {}

  init() {
    this.player = new THEOplayer.Player(this.playerEl, {
      fluid: true,
      libraryLocation:
        "//cdn.myth.theoplayer.com/24abfd34-e8c7-48cf-9043-f1b3916b241d",
    });
  }

  bind() {
    this.init();
    this.player.source = {
      sources: this.source,
    };
  }
}
