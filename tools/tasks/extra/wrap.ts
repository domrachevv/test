const notifier = require('node-notifier');

module.exports = function wrap(name: any, exec: any) {
    return function (done: any) {
        function reportError(error: any) {
            notifier.notify({
                title: 'Gulp: ' + name,
                message: error.message
            });
             done(error);
        }

        return exec(reportError);
    }
}