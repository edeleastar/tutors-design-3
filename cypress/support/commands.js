const icons = {
  topic: "fa-sitemap",
  talk: "fa-object-group",
  lab: "fa-flask",
  video: "fa-youtube",
  panelvideo: "fa-youtube",
  archive: "fa-file-archive",
  github: "fa-github",
  web: "fa-bookmark"
};

const delay = 500;

Cypress.Commands.add('lo', (index, selector, lo, icon, options = {}) => {
  cy.get(selector).eq(index).should('contain', lo.title);
  cy.get(selector).eq(index).should('contain', lo.summary);
  if (lo.type == "panelvideo") {
    let parts = lo.video.split('/');;
    const lastSegment = parts.pop() || parts.pop();
    const url = "https://www.youtube.com/embed/" + lastSegment;
    cy.get(selector).eq(index).find("iframe").should('have.attr', 'src', url);
  }
  else {
    cy.get(selector).eq(index).find("img").should('have.attr', 'src', lo.img);
  }
  cy.get(selector).eq(index).find("svg").should('have.class', icons[lo.type]);
});

