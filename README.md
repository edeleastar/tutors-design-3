# tutors-design

A reader for the [tutors-json](https://github.com/tutors-sdk/tutors-json) static site generator. Discussed in detail here:

- <https://aurelia.io/blog/2019/09/03/case-study-tutors>

Part of this group of projects:

- <https://github.com/tutors-sdk>

The reader is an [Aurelia](https://aurelia.io/) application, which consumes JSON output from [tutors-json](https://github.com/tutors-sdk/tutors-json), rendering an interactive experience.

The reader is intended for educational content, some representative examples:

- <https://wit-hdip-comp-sci-2018-ent-web.netlify.app>
- <https://oth-mobile-app-dev-2019.netlify.app>
- <https://wit-comp-sci-2019-web-dev.netlify.app>
- <https://wit-hdip-comp-sci-2019-programming.netlify.app>
- <https://wit-hdip-comp-sci-2019.netlify.app>

The application identifies the published course from the url, recovers the json version of the static site and then renders using Aurelia. A short course on using the system here:

- <https://tutors-course.netlify.app>

This is what the 'source' for a course looks like:

- <https://github.com/tutors-sdk/tutors-starter>

This is a deployed version of that course:

- <https://tutors-starter.netlify.app>

This is still experimental - with ongoing work on both the JSON format, the rendering architecture and e2e testing approaches.

Eamonn de leastar (edeleastar@wit.ie)

## License

[MIT](https://github.com/atom/atom/blob/master/LICENSE.md)
