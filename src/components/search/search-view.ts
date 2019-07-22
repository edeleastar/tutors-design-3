import { CourseRepo } from "../../services/course-repo";
import { NavigatorProperties } from "../../resources/elements/iconography/styles";
import { autoinject } from "aurelia-framework";
import { Course } from "../../services/course";
import environment from "../../environment";
import { flattenedLos } from "../../services/utils-search";
import { allLos } from "../../services/utils";

@autoinject
export class SearchView {
  course: Course;
  search_strings: string[] = [];
  searchTerm: string = "";

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {}

  async activate(params) {
    this.course = await this.courseRepo.fetchCourse(params.courseurl);

    this.navigatorProperties.title = this.course.lo.title;
    this.navigatorProperties.subtitle = "Search...";
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";

    this.setSearchTerm();
    this.setSearchStrings();
  }

  /**
   * The searchTerm is initially obtained from the http url query string should it exist.
   * TODO: Fix required - if the default searchTerm empty string is used a non-fatal error occurs.
   */
  setSearchTerm() {
    const href = window.location.href;
    const x = href.lastIndexOf("=");
    let value = x != -1 ? href.slice(x + 1) : "";
    this.searchTerm = value.replace(/%20/g, " ");
  }

  /**
   * Live update the http url query string
   * If the searchTerm key:value pair does not exist, create the key.
   * Then add a value or replace an existing value with that obtained from the search page dialog.
   */
  searchTermChanged() {
    let href = window.location.href;
    const x = href.lastIndexOf("=");
    if (x == -1) {
      href += "?searchTerm=''";
    }
    href = href.replace(/(searchTerm=)[^\&]+/, "$1" + this.searchTerm);
    window.location.href = href;
    window.location.reload();
  }

  /**
   * Populate an array with the search results.
   * Note: labs only searched.
   */
  setSearchStrings() {
    const labs = allLos("lab", this.course.lo.los);
    this.search_strings = flattenedLos(labs, this.searchTerm);
  }
}
