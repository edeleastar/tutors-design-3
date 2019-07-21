import {Lo} from "./lo";

export function injectCourseUrl(lo: Lo, url) {
  if (lo.route) lo.route = lo.route.replace("{{COURSEURL}}", url);
  if (lo.img) lo.img = lo.img.replace("{{COURSEURL}}", url);
  if (lo.video) lo.video = lo.video.replace("{{COURSEURL}}", url);
  if (lo.pdf) lo.pdf = lo.pdf.replace("{{COURSEURL}}", url);
  if (lo.los) {
    lo.los.forEach(lo => {
      injectCourseUrl(lo, url);
    });
  }
}
