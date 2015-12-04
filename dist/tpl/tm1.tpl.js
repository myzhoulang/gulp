(function(module) {
try {
  module = angular.module('tpl');
} catch (e) {
  module = angular.module('tpl', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('tm1.tpl.html',
    '<div class="tm1">\n' +
    '    <h2>{{ name }}</h2>\n' +
    '</div>');
}]);
})();
