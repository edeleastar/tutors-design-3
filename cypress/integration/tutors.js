let course = null;

describe("User page", () => {
  before(function() {
    cy.fixture("tutors-starter.json").then(c => {
      course = c;
    });
  });

  beforeEach(function() {
    cy.visit("http://localhost:8080/#course/tutors-starter.netlify.com");
  });

  it("HomePage", function() {
    for (let [i, topic] of course.los.entries()) {
      cy.lo(i, "card-deck card", topic);
    }
  });
});
