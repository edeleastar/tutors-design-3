import { Lo } from "./lo";
import environment from "environment";

const extraChars: number = +`${environment.search}`;
const removeMd = require("remove-markdown");
/**
 * Searches an array of nested Lo arrays for presence of searchTerm.
 * When a string containing the searchTerm is found it is converted to text.
 * It is augmented to a length obtained by adding extraChars number characters,
 * which is an environment variable, to the length of the searchTerm.
 * On 31.10.19 resolved the issue whereby only first instance of a searchTerm on any
 * web page returned. Now all instances of the search term identified.
 * @param los The nested arrays of Lo objects.
 * @param searchTerm The term whose presence is searched for.
 */
export function flattenedLos(los: Lo[], searchTerm: string): string[] {
  let flatLos = flattenNestedLosArrays(los);
  let result: string[] = [];
  flatLos.forEach(obj => {
    let text = removeMd(obj.lab.contentMd);
    let contents = augmentedSubstrings(text, searchTerm, extraChars);
    for (let content of contents) {
      result.push(`<a href="${obj.lab.route}">${obj.topicTitle}${obj.lab.title} ${obj.lab.shortTitle}</a>  ${content}`);
    }
  });
  return result;
}

function flattenNestedLosArrays(los: Lo[]) {
  return flatten(los, "");
}

function flatten(arr: Lo[], topicTitle: string, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value.los)) {
      flatten(value.los, arr[i].parent.lo.title, result);
    } else {
      result.push({ lab: value, topicTitle: topicTitle });
    }
  }
  return result;
}

/**
 * Validate a string: is valid if it is not undefined and
 * does not comprise only whitespace else it is invalid.
 * @param str A string being validated.
 * @returns true if valid else false.
 */
export function isValid(str: string) {
  return str != undefined && /\S/.test(str) == true;
}

/**
 * Returns an array of substrings of targetString comprising searchTerm and
 * extraChars number characters on either side of searchTerm.
 * That is, the total length of each substring is the sum of the 
 * lengths of the search term + twice extra chars. However in the edge conditions
 * namely at the beginning and end of the target string, any necessary adjustment is 
 * made to substrings that might be present here or near here.
 *
 * Example: 	targetString  = 'syeasy and hard synchronized syncsy';
 * searchTerm = 'sy';
 * extraChars = 4;
 * arStrings: ["syeasy", "syeasy and", "ard synchr", "zed syncsy", "syncsy"]
 * 
 * @param targetString The string within which one or more searchTerm substrings exist.
 * @param searchTerm The substring, at lease one instance of which exists.
 * @param extraChars The number of additional characters to be added each end of searchTerm, edge conditions allowing.
 * @return arStrings An array of augmented substrings.
 */
function augmentedSubstrings(targetString: string, searchTerm: string, extraChars: number) {
  let arIndx = []; // The targetString indices of the first character of each occurrence of the substring.
  let arStrings = []; // The output: the set of discovered and augmented substrigs.
  arSubstringIndices(targetString, searchTerm, arIndx); // populate arIndx
  for (let i = 0; i < arIndx.length; i += 1) {
    let index = arIndx[i];
    let startIndex = index - extraChars > 0 ? index - extraChars : 0;
    let endIndex =
      index + searchTerm.length + extraChars <= targetString.length
        ? index + searchTerm.length + extraChars : targetString.length;
    let str = targetString.slice(startIndex, endIndex);
    arStrings.push(str);
  }
  return arStrings;
}

/**
 *  Recursively locate the start indices of a recurring substring within a string.
 *  Example: str = syeasy and hard synchronized syncsy'
 *  Substring: 'sy'
 *  Output: [0, 4, 16, 29, 33]
 *  
 *  @return arIndx An array of the indices of positions of first character of substring.
 */

function arSubstringIndices(str: string, substr: string, arIndx: number[]) {

  let n = str.indexOf(substr);
  if (n != -1) {
    let prev_n = n;
    if (arIndx.length) {
      n += arIndx[arIndx.length - 1] + substr.length;
    }
    arIndx.push(n);
    arSubstringIndices(str.slice(prev_n + substr.length), substr, arIndx);
  }
  else {
    return arIndx;
  }
}

