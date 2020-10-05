const Mysqli = require('mysqli');

let conn = new Mysqli({              //database connection
    host: 'localhost', // IP/domain name
    post: 3306, // port, default 3306
    user: 'root', // username
    passwd: 'iamheadrush', // password
    db: 'mega_shop'
});

let db = conn.emit( false, '');   //default database value

module.exports = {
    database:db,
    /* hasAuthFields: undefined,
    isPasswordAndUserMatch: undefined,

    secret() {

    }*/
};