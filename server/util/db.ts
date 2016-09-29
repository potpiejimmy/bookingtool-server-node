var wrapper = require('node-mysql-wrapper'); 

export function getConnection() {
    return wrapper.wrap("mysql://bookingtool:bookingtool@localhost/bookingtool?debug=false&charset=utf8");
}

export function perform(action) {
    var connection = getConnection();
    connection.ready(function() {
        action(connection);
        connection.end(function(err) {});
    });
}
