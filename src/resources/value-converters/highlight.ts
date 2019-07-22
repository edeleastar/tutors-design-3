import { isValid } from "../../services/utils-search";

export class HighlightValueConverter {
  toView(value) {
    if (isValid(value)) {
      //&& value.indexOf("<b>") !== -1) {
      return `<span style='background-color:#e6e9f2; padding:10px'>${value}</span>`;
    }
    return value;
  }
}
