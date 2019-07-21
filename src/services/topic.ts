import { Lo } from "./lo";
import { fixRoutes } from "./utils";

export class Topic {
  lo: Lo;
  standardLos: Lo[];

  constructor(lo: Lo, courseUrl: string) {
    this.lo = lo;
    fixRoutes(lo);
    this.standardLos = this.lo.los;
  }
}
