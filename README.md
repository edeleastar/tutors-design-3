tutors-design
=====

A reader for the tutors-ts static site generator. Discussed in detail here:

- <https://aurelia.io/blog/2019/09/03/case-study-tutors>

Part of a group of this small group of projects:

- <https://github.com/edeleastar/tutors-ts>
- <https://github.com/edeleastar/tutors-js>

The reader is an [Aurelia](https://aurelia.io/) application, which consumes JSON output from [tutors-ts](https://github.com/edeleastar/tutors-ts), rendering a
 more a interactive version of the site. 
 
The reader is intended for educational content, some representative examples:
 
 - <https://tutors-design.netlify.com/course/wit-hdip-comp-sci-2018-ent-web.netlify.com>
 - <https://tutors-design.netlify.com/course/wit-comp-sci-2019-web-dev.netlify.com>
 - <https://tutors-design.netlify.com/course/wit-hdip-comp-sci-2019-programming.netlify.com>
 - <https://tutors-design.netlify.com/course/tutors-starter.netlify.com>
 - <https://tutors-design.netlify.com/course/wit-hdip-comp-sci-2019-ict-skills-1.netlify.com/>
 - <https://tutors-design.netlify.com/course/wit-hdip-comp-sci-2019.netlify.com>
 
 The application identifies the published course from the url, recovers the json version 
 of the static site and then renders using Aurelia.
 
 This is still experimental - with onoing work on both the JSON format, the rendering architecture and 
 e2e testing approaches.
 
 Eamonn de leastar (edeleastar@wit.ie)

## License

[MIT](https://github.com/atom/atom/blob/master/LICENSE.md)
