angular.module('AffineCuisine.services', [])

.factory('IngredientService', function($http, $q) {
    var apiUrl = 'https://en.wikibooks.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Ingredients&cmlimit=max&callback=JSON_CALLBACK';

    var functions = {
        // fetch all ingredients
        all: function() {
            return recall();
            function recall(previous, cmcontinue, deferred) {
                if (typeof(deferred) === "undefined") {
                    deferred = $q.defer();
                }
                if (typeof(previous) === "undefined") {
                    previous = [];
                }
                if (typeof(cmcontinue) === "undefined") {
                    cmcontinue = '';
                }
                $http.jsonp(apiUrl + "&cmcontinue=" + cmcontinue)
                .success(function(data, status) {
                    deferred.notify("Fetching ingredients");
                    var categorymembers = previous.concat(data.query.categorymembers);
                    var queryContinue = data['query-continue'];
                    if (queryContinue) {
                        cmcontinue = queryContinue['categorymembers']['cmcontinue'];
                        recall(categorymembers, cmcontinue, deferred);
                    }
                    else {
                        deferred.resolve({
                            'categorymembers': categorymembers,
                            'status': status
                        });
                    }
                })
                .error(function(data, status) {
                    deferred.reject(status + ' on IngredientService.all()');
                });
                return deferred.promise;
            }
        }
    };
    return functions;
});
