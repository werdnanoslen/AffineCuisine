angular.module('AffineCuisine.controllers', [])

.controller('HomeCtrl', function ($scope, IngredientService) {
    $scope.ingredients = IngredientService.all();
})
