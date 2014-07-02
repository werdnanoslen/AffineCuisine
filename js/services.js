angular.module('AffineCuisine.services', [])

.factory('IngredientService', function($http) {
    var apiUrl = 'https://en.wikibooks.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Ingredients&cmlimit=max&callback=JSON_CALLBACK';

    var functions = {
        // fetch all ingredients
        all: function(previous0, cmcontinue0) {
            var previous = (typeof(previous0) === "undefined") ? [] : previous0;
            var cmcontinue = (typeof(cmcontinue0) === "undefined") ? '' : cmcontinue0;

            $http.jsonp(apiUrl + "&continue=" + cmcontinue)
                .success(function(data, status) {
                    var categorymembers = previous.concat(data.query.categorymembers);
                    if (data['query-continue']) {
                        var cmcontinue = data['query-continue']['categorymembers']['cmcontinue'];
                        functions.all(categorymembers, cmcontinue);
                    }
                    else {
                        var ingredients = {'_length': 0};
                        categorymembers.forEach(function(ingredient) {
                            ingredient.title = ingredient.title.replace('Cookbook:', '');
                            ingredients[ingredient.title] = ingredient;
                            ++ingredients._length;
                        });
                        console.log(status + ' on IngredientService.all(): ', ingredients);
                        return ingredients;
                    }
                })
                .error(function(data, status) {
                    console.log(status + ' on IngredientService.all()');
                });
        }
    };
    return functions;
});
