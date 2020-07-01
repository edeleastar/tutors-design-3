import { bindable } from "aurelia-framework";
import { Lo } from "../../../services/course/lo";
import { autoinject } from "aurelia-framework";
import { EventBus, KeyListener } from "../../../services/events/event-bus";

// let pdfjsLib = require("pdfjs-dist");
@autoinject
export class TalkCardPdf implements KeyListener {
  @bindable
  lo: Lo;

  //public zoompercent: string = "100%";
  //url: string = "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";
  url: string;
  //scale: number = 2.0;
  // currentPage: number = 1;
  // minPage: number = 1;
  // maxPage: number = 1;
  // doc = {};
  // canvas: HTMLCanvasElement;
  // context: CanvasRenderingContext2D;
  status = "";

  constructor(private eb: EventBus) {
    this.eb.observerKeyPress(this);
  }

  keyPress(key: string) {
    // if (key == "ArrowDown" || key == "ArrowRight") {
    //   this.nextPage();
    // } else if (key == "ArrowUp" || key == "ArrowLeft") {
    //   this.previousPage();
    // }
  }

  bind() {
    //this.status = "Loading pdf ...";
    this.url = this.lo.pdf;
    //this.initialize();
  }

  initialize = async function () {
    // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // this.doc = await pdfjsLib.getDocument(this.url).promise;
    // this.maxPage = this.doc.numPages;
    // console.log("Number pages : " + this.maxPage);
    // this.getPage(this.doc, this.currentPage);
    // this.status = "";
  };

  // nextPage = async function () {
  //   if (this.inRange(this.minPage, this.currentPage + 1, this.maxPage)) {
  //     await this.getPage(this.doc, this.currentPage + 1);
  //     this.currentPage += 1;
  //     document.getElementById("pageNumber").innerHTML = `${this.currentPage} of ${this.maxPage}`;
  //   }
  // };

  // previousPage = async function () {
  //   if (this.inRange(this.minPage, this.currentPage - 1, this.maxPage)) {
  //     await this.getPage(this.doc, this.currentPage - 1);
  //     this.currentPage -= 1;
  //     document.getElementById("pageNumber").innerHTML = `${this.currentPage} of ${this.maxPage}`;
  //   }
  // };

  // getPage = async function (doc, pageNumber) {
  //   document.getElementById("pageNumber").innerHTML = `${this.currentPage} / ${this.maxPage}`;
  //   if (this.inRange(this.minPage, this.currentPage, this.maxPage)) {
  //     const page = await doc.getPage(pageNumber);
  //     const viewport = page.getViewport({ scale: this.scale });
  //     this.canvas = document.getElementById("pdf_canvas") as HTMLCanvasElement;
  //     this.context = this.pdf_canvas.getContext("2d");
  //     this.canvas.height = viewport.height;
  //     this.canvas.width = viewport.width;
  //     return await page.render({
  //       canvasContext: this.context,
  //       viewport: viewport,
  //     }).promise;
  //   }
  // };

  // inRange(lo: number, test: number, hi: number): boolean {
  //   return test >= lo && test <= hi;
  // }

  // zoomin() {
  //   if (this.scale < 10) {
  //     //10 is an arbitrary choice.
  //     this.scale += 1;
  //     this.getPage(this.doc, this.currentPage);
  //     document.getElementById("zoompercent").innerHTML = `${this.scale * 100}%`;
  //   }
  // }

  // zoomout() {
  //   if (this.scale >= 2.0) {
  //     this.scale -= 1;
  //     this.getPage(this.doc, this.currentPage);
  //     document.getElementById("zoompercent").innerHTML = `${this.scale * 100}%`;
  //   }
  // }

}
