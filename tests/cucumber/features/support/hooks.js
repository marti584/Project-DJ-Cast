(function () {

    'use strict';

    module.exports = function () {
        this.Before(function () {
          server.call('/fixtures/reset');
          server.call('/fixtures/addUser', {
            username: 'Phony'
          });
        });
    };

})();
