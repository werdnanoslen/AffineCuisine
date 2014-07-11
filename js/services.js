angular.module('AffineCuisine.services', [])

.factory('IngredientService', function($http, $q) {
    var apiUrl = 'https://en.wikibooks.org/w/api.php?format=json&action=query&callback=JSON_CALLBACK';

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
                $http.jsonp(apiUrl + "&list=categorymembers&cmtitle=Category:Ingredients&cmlimit=max&cmcontinue=" + cmcontinue)
                .success(function(data, status) {
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
        },

        //get single ingredient
        ingredient: function(title) {
            var deferred = $q.defer();
            $http.jsonp(apiUrl + "&prop=revisions&rvprop=content&rvsection=0&titles=" + title)
            .success(function(data, status) {
                //Get the string version of the first section of the current page
                for (page in data.query.pages) break;
                var rawSection = data.query.pages[page].revisions[0]['*'].replace(/\n/g, '');

                //Get all the templates in this section
                var templateIndecesStart = [];
                var i = -1;
                while((i=rawSection.indexOf("{{", ++i)) >= 0) {
                    templateIndecesStart.push(i + 2);
                }
                var templateIndecesEnd = [];
                var i = -1;
                while((i=rawSection.indexOf("}}", ++i)) >= 0) {
                    templateIndecesEnd.push(i);
                }

                //For each template
                var templates = {};
                for (var i=0; i < templateIndecesStart.length; ++i) {
                    //Get its raw innards
                    var start = templateIndecesStart[i];
                    var end = templateIndecesEnd[i];
                    var rawTemplate = rawSection.substring(start, end);

                    //Find the title
                    var titleStop = rawTemplate.search(/\W|_/);
                    var title = rawTemplate.substr(0, (titleStop != -1) ? titleStop : end);

                    //Find the parameters
                    var parameters = [];
                    var j = rawTemplate.indexOf("|");
                    if (j !== -1) {
                        var param = "";
                        for (j += 1; j < (rawTemplate.length); ++j) {
                            var thisChar = rawTemplate[j];
                            if (thisChar === "|") {
                                if (param.length > 0) {
                                    parameters.push(param);
                                }
                                param = "";
                            } else {
                                param += thisChar;

                                //Parse "|" inside "[[]]" literally
                                if (thisChar === "[" && rawTemplate[j+1] === "[") {
                                    while (rawTemplate.length > j++) {
                                        param += rawTemplate[j];
                                        if (rawTemplate[j] === "]" & rawTemplate[j+1] === "]") {
                                            param += rawTemplate[++j];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (param.length > 0) {
                            parameters.push(param);
                        }
                    }

                    //Add parameter key/value pair to this template
                    templates[title] = {};
                    for (line in parameters) {
                        var linePair = parameters[line].split('=');
                        var key = linePair[0];
                        var value = linePair[1];
                        templates[title][key] = value;
                    }
                }

                deferred.resolve({
                    'info': templates,
                    'status': status
                });
            })
            .error(function(data, status) {
                deferred.reject(status + ' on IngredientService.all()');
            });
            return deferred.promise;
        }
    };
    return functions;
});
