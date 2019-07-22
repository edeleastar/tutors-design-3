import { Lo } from "./lo";
import environment from 'environment';

const extraChars: number = +`${environment.search}`;
const removeMd = require('remove-markdown');
/**
 * Searches an array of nested Lo arrays for presence of searchTerm.
 * When a string containing the searchTerm is found it is converted to text.
 * It is clipped to a length obtained by adding extraChars number characters,
 * which is an environment variable, to the length of the searchTerm.
 * @param los The nested arrays of Lo objects.
 * @param searchTerm The term whose presence is searched for.
 */
export function flattenedLos(los: Lo[], searchTerm: string) : string[] {
  let flatLos = flattenNestedLosArrays(los);
  let result: string[] = [];
  flatLos.forEach(lo => {
    let text = removeMd(lo.contentMd);
    let content = clippedContent(text, searchTerm, extraChars);
    result.push(`<a href="${lo.route}"> ${lo.shortTitle}</a>  ${content}`); 
  });
  return result;
}

function flattenNestedLosArrays(los: Lo[]) {
  return flatten(los);
}

function flatten(arr: Lo[], result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value.los)) {
      flatten(value.los, result);
    } else {
      result.push(value);
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
 * Constructs a substring of targetString comprising searchTerm and 
 * extraChars on either side of searchTerm.
 * A precondition is that searchTerm is a substring of targetString.
 * @param targetString 
 * @param searchTerm 
 * @param extraChars 
 */
function clippedContent(targetString: string, searchTerm: string, extraChars: number) {
	let index = targetString.indexOf(searchTerm);
	let startIndex = index - extraChars > 0 ? index - extraChars : 0;
	let endIndex = index + searchTerm.length + extraChars <= targetString.length ? index + searchTerm.length + extraChars : targetString.length;
	return targetString.slice(startIndex, endIndex);
}
