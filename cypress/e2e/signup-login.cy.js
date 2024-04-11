/// <reference types='cypress'/>

describe('Signup & Login',()=>{
    let randomString = Math.random().toString(36).substring(2);
    let userName = 'auto'+randomString;
    let email = randomString+'@gmail.com';
    let pw = 'password1';
    
    it('Test valid Signup',()=>{
        cy.intercept('POST','**/*.realworld.io/api/users',).as('newUser');

        cy.visit('http://localhost:4200/');
        cy.get('.nav').contains(' Sign up ').click();
        cy.get('[placeholder="Username"]').type('auto'+randomString);
        cy.get('[placeholder="Email"]').type(randomString +'@gmail.com');
        cy.get('[placeholder="Password"]').type('password1');
        cy.get('button').contains('Sign up').click();

        cy.wait('@newUser').then(({request,response})=>{
            cy.log('Request is: '+JSON.stringify(request));
            cy.log('Response is: '+JSON.stringify(response));

            expect(response.statusCode).to.eq(201);
            expect(response.body.user.username).to.equal(userName);
            expect(response.body.user.email).to.equal(email);
        });
    });

    it('Test valid login',()=>{
        cy.intercept('GET','**/tags',{fixture:'popularTags.json'});

        cy.visit('http://localhost:4200/');
        cy.get('.nav').contains('Sign in').click();
        cy.get('[placeholder="Email"]').type(email);
        cy.get('[placeholder="Password"]').type(pw);
        cy.get('button').contains('Sign in').click();
        cy.get(':nth-child(4) > .nav-link').contains(userName);

        cy.get('.tag-list').should('contain','Javascript').and('contain','cypress');
    });
})