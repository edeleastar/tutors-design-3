import { PLATFORM } from 'aurelia-pal';
import { Router, RouterConfiguration } from 'aurelia-router';
import environment from './environment';

export class App {
  title = 'Tutors';

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Tutors';
    config.options.pushState = environment.pushState;
    config.options.root = '/';
    config.map ([
      { route: 'course/*courseurl', moduleId: PLATFORM.moduleName('./components/course/course-view'), name: 'course',  title: 'Module' },
    ]);
  }
}
