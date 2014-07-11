angular.module('AffineCuisine.controllers', [])

.controller('HomeCtrl', function ($scope, $ionicLoading, IngredientService) {
    //Build list of all ingredients
    $ionicLoading.show({
        content: 'Fetching ingredients',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    IngredientService.all().then(
        function(api) {
            var ingredients = {};
            for(var index in api.categorymembers) {
                var ingredient = api.categorymembers[index];
                if (ingredient.hasOwnProperty('title')) {
                    ingredient.title = ingredient.title.replace('Cookbook:', '');
                    ingredients[ingredient.title] = ingredient;
                }
            }
            console.log(api.status + ' on IngredientService.all(): ', ingredients);
            $ionicLoading.hide();
            $scope.ingredients = ingredients;
        },
        function(reason) {
            console.log(reason);
            $ionicLoading.hide();
            $scope.ingredients = undefined;
        }
    );

    IngredientService.ingredient('Cookbook:Hamburger').then(
        function(info) {
            console.log(info.status + ' on IngredientService.ingredient(): ', info.info);
            $ionicLoading.hide();
            $scope.info = info;
        },
        function(reason) {
            console.log(reason);
            $ionicLoading.hide();
            $scope.info = undefined;
        }
    );
})
