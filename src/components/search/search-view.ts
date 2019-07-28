import { CourseRepo } from "../../services/course-repo";
import { autoinject } from "aurelia-framework";
import { Course } from "../../services/course";
import { flattenedLos } from "../../services/utils-search";
import { allLos } from "../../services/utils";
import { NavigatorProperties } from "../../resources/elements/navigators/navigator-properties";
import environment from "../../environment";

@autoinject
export class SearchView {
  course: Course;
  search_strings: string[] = [];
  public searchTerm: string = "";

  constructor(private courseRepo: CourseRepo, private navigatorProperties: NavigatorProperties) {}

  public get searchTermInView() {
    return this.searchTerm;
  }

  public set searchTermInView(val) {
    this.searchTerm = val;
    this.searchTermInViewChanged();
  }

  public searchTermInViewChanged() {
    this.updateUrl(this.searchTerm);
  }

  async activate(params: any) {
    this.course = await this.courseRepo.fetchCourse(params.courseurl);
    // this.searchTerm = params["searchTerm"] != undefined ? params["searchTerm"] : "";
    // this.updateUrl(this.searchTerm);
    // this.setSearchStrings();

    this.navigatorProperties.title = this.course.lo.title;
    this.navigatorProperties.subtitle = "Search...";
    this.navigatorProperties.parentLink = `${environment.urlPrefix}/course/${this.courseRepo.courseUrl}`;
    this.navigatorProperties.parentIcon = "moduleHome";
    this.navigatorProperties.parentIconTip = "To module home ...";
  }

  /**
   * Live update the http url query string
   */
  updateUrl(addToQueryString: string) {
    let href = window.location.href;
    const indx = href.lastIndexOf("=");

    if (addToQueryString === "" || href[indx + 1] == "" || href[indx + 1] == undefined) {
      href = this.removeQueryString(href);
    } else if (indx == -1 && addToQueryString) {
      // No prior query string,therefore create and populate if addToQueryString valid.
      href += "?searchTerm=" + addToQueryString;
    } else if (addToQueryString) {
      // Replace completely the existing query string assuming addToQueryString valid.
      href = href.replace(/(searchTerm=)[^\&]+/, "$1" + addToQueryString);
    }

    window.location.href = href;
  }

  private removeQueryString(href: string): string {
    return href.substring(0, href.indexOf("?"));
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
