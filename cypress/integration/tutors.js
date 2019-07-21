let course = null;

describe("User page", () => {
  before(function() {
    cy.fixture("tutors-starter.json").then(c => {
      course = c;
    });
  });

  beforeEach(function() {
    cy.visit("http://localhost:8080/#course/tutors-starter.netlify.com");
    //cy.visit("https://tutors-design-dev.netlify.com/#course/tutors-starter.netlify.com");
    //cy.visit("https://tutors-design-prod.netlify.com/course/tutors-starter.netlify.com");
  });

  it("HomePage", function() {
    for (let [i, topic] of course.los.entries()) {
      cy.lo(i, "card-deck card", topic);
    }
  });

  it("Topics", function() {
    for (let topic of course.los) {
      cy.contains(topic.title).click({ force: true });
      cy.wait(100);
      cy.carddeck(topic.los, "card-deck card");
      cy.home();
    }
  });
});
