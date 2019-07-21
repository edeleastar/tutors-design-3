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
      { route: 'topic/*topicurl', moduleId: PLATFORM.moduleName('./components/topic/topic-view'),   name: 'topic',   title: 'Topic' },
      { route: 'video/*courseUrl/:videoid', moduleId: PLATFORM.moduleName('./components/video/video-view'),   name: 'video',   title: 'Video' },
      { route: 'talk/*courseUrl/:talkid',  moduleId: PLATFORM.moduleName('./components/talk/talk-view'),     name: 'talk',    title: 'Talk' },
    ]);
  }
}
