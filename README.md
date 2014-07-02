AffineCuisine
=============

Find the affinities in your kitchen

## Backend
1. ~~Fetch ingredients from [Wikibooks' Category:Ingredients](https://en.wikibooks.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Ingredients)~~
2. Build list from ingredients
3. Seed weighted adjacency matrix for ingredients list
    * getAllIngredients() = {ingredient1, ..., ingredientN};
    * getAffinity(ingredient1, ingredient2) = int;
    * getAffinities(ingredient, minAffinity) = {{ingredient1, affinity}, ..., {ingredientN, affinity} | affinity >= minAffinity};

## Frontend
1. Search all ingredients
    * getAllIngredients();
2. Build list of ingredients in kitchen
3. Display affinities (weighted adjacency matrix) as network with emphasis on community structure
