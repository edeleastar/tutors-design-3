import { CourseRepo } from "../../services/course-repo";
import { autoinject } from "aurelia-framework";
import { Course } from "../../services/course";
import { flattenedLos } from "../../services/utils-search";
import { allLos } from "../../services/utils";

@autoinject
export class SearchView {
  course: Course;
  search_strings: string[] = [];
  public searchTerm: string = "";

  constructor(private courseRepo: CourseRepo) {}

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

  async activate(params: any, ) {
    this.searchTerm = params['searchTerm'] != undefined ? params['searchTerm'] : "";
    this.updateUrl(this.searchTerm);
    this.course = await this.courseRepo.fetchCourse(params.courseurl);
    this.setSearchStrings();
  }

  /**
   * Live update the http url query string
   */
  updateUrl(queryString: string) {
    let href = window.location.href;
    const indx = href.lastIndexOf("=");

    //.com
    if(!queryString && indx == -1) {
      return;
    }

    // Valid queryString & no prior query string therefore create and populate.
    if (queryString && indx == -1) {
      href += "?searchTerm=" + queryString;
    } 

    //.com?searchTerm=
    else if(!queryString && indx != -1) {
      href = this.removeQueryString(href);
    }

    // Replace completely the existing query string assuming queryString valid.
    else if (queryString) {
      href = href.replace(/(searchTerm=)[^\&]+/, "$1" + queryString);
    }

    window.location.href = href;
  }

  private removeQueryString(href: string) : string {
    return href.substring(0, href.indexOf('?'));
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
