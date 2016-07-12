angular.module('budget', []).controller('budgetCtrl', ['$scope', function($scope) {
  $scope.categories = ["cat", "food", "shopping", "etc"];

  $scope.monthlyData = [
    {item: "Snickers", date: "07/01/16", category: "cat", amount: 100},
    {item: "books", date: "07/04/16", category: "etc", amount: 24},
    {item: "groceries", date: "07/10/16", category: "food", amount: 100}
  ];
  
  $scope.submitbutt = function(){
    alert($scope.newDate+", "+$scope.newItem+", "+$scope.newCategory+", "+$scope.newAmount); 
  }
  $scope.transferbutt = function(){
    alert($scope.transferFrom+", "+$scope.transferTo+", "+$scope.transferAmount); 
  }
  
}]);