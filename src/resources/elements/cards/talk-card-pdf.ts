import { pdfjsWorker } from "pdfjs-dist/build/pdf.worker.entry";
import { bindable } from "aurelia-framework";
import { Lo } from "../../../services/course/lo";

let pdfjsLib = require("pdfjs-dist");

export class TalkCardPdf {
  @bindable
  lo: Lo;

  public zoompercent: string = "100%";
  url: string = "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf";

  scale: number = 2.0;
  currentPage: number = 1;
  minPage: number = 1;
  maxPage: number = 1;
  doc = {};
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor() {}

  bind() {
    this.url = this.lo.pdf;
    this.initialize();
  }

  initialize = async function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    this.doc = await pdfjsLib.getDocument(this.url).promise;
    this.maxPage = this.doc.numPages;
    console.log("Number pages : " + this.maxPage);
    this.getPage(this.doc, this.currentPage);
  };

  nextPage = async function () {
    if (this.inRange(this.minPage, this.currentPage + 1, this.maxPage)) {
      await this.getPage(this.doc, this.currentPage + 1);
      this.currentPage += 1;
      document.getElementById("pageNumber").innerHTML = `${this.currentPage} of ${this.maxPage}`;
    }
  };

  previousPage = async function () {
    if (this.inRange(this.minPage, this.currentPage - 1, this.maxPage)) {
      await this.getPage(this.doc, this.currentPage - 1);
      this.currentPage -= 1;
      document.getElementById("pageNumber").innerHTML = `${this.currentPage} of ${this.maxPage}`;
    }
  };

  getPage = async function (doc, pageNumber) {
    document.getElementById("pageNumber").innerHTML = `${this.currentPage} / ${this.maxPage}`;
    if (this.inRange(this.minPage, this.currentPage, this.maxPage)) {
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: this.scale });
      this.canvas = document.getElementById("pdf_canvas") as HTMLCanvasElement;
      this.context = this.pdf_canvas.getContext("2d");
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;
      return await page.render({
        canvasContext: this.context,
        viewport: viewport,
      }).promise;
    }
  };

  inRange(lo: number, test: number, hi: number): boolean {
    return test >= lo && test <= hi;
  }

  zoomin() {
    if (this.scale < 10) {
      //10 is an arbitrary choice.
      this.scale += 1;
      this.getPage(this.doc, this.currentPage);
      document.getElementById("zoompercent").innerHTML = `${this.scale * 100}%`;
    }
  }

  zoomout() {
    if (this.scale >= 2.0) {
      this.scale -= 1;
      this.getPage(this.doc, this.currentPage);
      document.getElementById("zoompercent").innerHTML = `${this.scale * 100}%`;
    }
  }

  //========================================================
  // Code not executed. Retained for potential mining.
  //========================================================
  fileTextContent = async function (url) {
    try {
      let doc = await pdfjsLib.getDocument(this.url).promise;
      let pages = await this.pagesGet(doc);
      let contents = await this.contentsGet(pages);
      let results = await this.result(contents);
      console.log("results ", results);
      return results;
    } catch (err) {
      console.log("pdf2text failed", err);
    }
  };

  pagesGet(doc) {
    console.log("Number pages : " + doc.numPages);
    console.log("url : ", doc._transport._params.url);
    let pages = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      pages.push(doc.getPage(pageNumber));
    }
    return Promise.all(pages);
  }
  result(contents) {
    let texts = [];
    contents.forEach((content, pageNumber) => {
      let text = content.items
        .map((item) => {
          return item.str;
        })
        .join("");
      texts.push(text);
      console.log("Page", pageNumber + ": " + text);
    });
    return texts;
  }
  contentsGet(pages) {
    let textContents = [];
    pages.forEach((page) => {
      console.log(page._transport.loadingTask._transport._params.url);
      textContents.push(page.getTextContent());
    });
    return Promise.all(textContents);
  }
}
