(function(module) {
try {
  module = angular.module('tpl');
} catch (e) {
  module = angular.module('tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tmp2.tpl.html',
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title></title>\n' +
    '</head>\n' +
    '<body>\n' +
    '\n' +
    '</body>\n' +
    '</html>');
}]);
})();
