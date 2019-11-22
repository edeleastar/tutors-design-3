import { autoinject } from "aurelia-framework";
import { Course } from "../../services/course";
import { flattenedLos } from "../../services/utils-search";
import { extractPath }  from "../../services/utils-search";
import { allLos } from "../../services/utils";
import environment from "../../environment";
import { BaseView } from "../base/base-view";

/**
 * Search the labs for presence of user-input search term.
 * Live output the results of the search character by character.
 * Simultaneously live update the address bar by adding the query string to base url (+ course url).
 * Use the binding property of the search term input value to facilitate live updating.
 * @see https://discourse.aurelia.io/t/detect-change-from-input/1109
 */
@autoinject
export class SearchView extends BaseView {
  course: Course;
  search_strings: string[] = [];
  params: any;
  public searchTerm: string = "";

  public get searchTermInView() {
    return this.searchTerm;
  }

  public set searchTermInView(val) {
    this.searchTerm = val;
    this.searchTermInViewChanged();
  }

  public searchTermInViewChanged() {
    this.updateUrl(this.searchTerm);
    if (this.searchTerm) {
      this.setSearchStrings();
    }
  }

  async activate(params: any) {
    this.params = params;
    this.course = await this.courseRepo.fetchCourse(params.courseurl);
    this.navigatorProperties.title = "Search...";
    this.navigatorProperties.subtitle = this.course.lo.title;
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";

    this.searchTerm = params["searchTerm"] != undefined ? params["searchTerm"] : "";
    this.updateUrl(this.searchTerm);
    super.init(`search/${params.courseurl}`);

    // This test caters for situation where a non-empty search string is copied to a browser's
    // navigation bar, this requiring immdiate action on invocation of the 
    // search module.
    if (this.searchTerm) {
      this.setSearchStrings();
    }
  }

  /**
   * Live synchronisation of address bar url query string with search term input in search dialog.
   * @see https://stackoverflow.com/questions/39244796/aurelia-router-modify-route-params-and-address-bar-from-vm-with-router
   * @param queryString The value part of the search param property {searchTerm: queryString}
   */
  updateUrl(queryString: string) {
    if (!queryString) {
      delete this.params["searchTerm"];
    } else {
      this.params.searchTerm = queryString;
    }
    this.router.navigateToRoute("search", this.params, { trigger: false, replace: true });
  }

  /**
   * Populate an array with the search results.
   * Note: labs only searched.
   */
  setSearchStrings() {
    const labs = allLos("lab", this.course.lo.los);
    this.search_strings = flattenedLos(labs, this.searchTerm);
  }

  handleClick(search_string: string) {
    console.log("searchTerm: ",this.searchTerm, "number hits ", this.search_strings.length);
    console.log("clicked on: ", search_string);

    let path = extractPath(search_string);
    console.log("path: ", path);
    
    //this.anaylticsService.logSearch()
  }
}
