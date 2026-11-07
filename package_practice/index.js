import createUser from "user-package";
// const createUser = require('user-package');

const user = createUser({
 name: 'иван иванов',
 dateBirth: '10.11.1987',
 purpose: 'карьерный рост',
});

const userEmpty = createUser();

const userError = createUser({
 name: 'иван иванов',
 purpose: 'карьерный рост',
});



console.log(user)