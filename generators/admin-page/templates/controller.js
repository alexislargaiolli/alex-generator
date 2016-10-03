'use strict';

angular.module('<%= app_name %>')
    .controller('<%= Model %>Ctrl', function($scope, $mdDialog, $state, <%= serviceName %>) {
        $scope.<%= list %> = [];
        $scope.<%= selectedName %>;

        activate();

        function activate() {
            <%= serviceName %>.query(function(data) {
                $scope.<%= list %> = data;
            });
        }

        $scope.select = function(<%= model %>) {
            $scope.<%= selectedName %> = <%= model %>;
        }

		$scope.saveSelected = function() {
            $scope.<%= selectedName %>.$save(function(){
            	$scope.<%= selectedName %> = null;
            });
        }        

        $scope.showAddForm = function(ev) {
            $mdDialog.show({
                    controller: <%= controllerName %>,
                    templateUrl: "<%= folder.replace('client/', '') %>/<%= model %>.create.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(<%= model %>) {
                    <%= model %>.$save(function(elt){
                    	$scope.<%= list %>.push(elt);
                    });
                }, function() {});
        };

        $scope.<%= deleteMethod %> = function(ev, <%= model %>ToDelete) {
            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr ?')
                .targetEvent(ev)
                .ok('Oui, supprimer')
                .cancel('Non, annuler');

            $mdDialog.show(confirm).then(function() {
               <%= model %>ToDelete.$delete(function(){
               		var index = $scope.<%= list %>.indexOf(<%= model %>ToDelete);
               		if(index != -1){
               			$scope.<%= list %>.splice(index, 1);
               		}
               });
            }, function() {

            });
        }

        function <%= controllerName %>($scope, $mdDialog, <%= serviceName %>) {
           	$scope.<%= model %> = new <%= serviceName %>();

            activate();

            function activate() {

            }

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.<%= addMethod %> = function() {
                if ($scope.createForm.$valid) {
                    $mdDialog.hide($scope.<%= model %>);
                }
            };
        }

    });
