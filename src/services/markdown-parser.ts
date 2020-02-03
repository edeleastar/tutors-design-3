const showdown = require("showdown");

const showdownHighlight = require("showdown-highlight");

let converter = new showdown.Converter({ tables:true,
  extensions: [showdownHighlight]
});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

export class MarkdownParser {
  parse(md: string, url): string {
    let filtered = replaceAll(md, "./img\\/", `img/`);
    filtered = replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = replaceAll(filtered, "./archives\\/", `archives/`);
    filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
    filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    return converter.makeHtml(filtered);
  }
}
