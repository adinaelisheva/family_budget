angular.module('budget', []).controller('budgetCtrl', ['$scope', function($scope) {
  $scope.categories = [
    {name:"cat", budget: 50},
    {name: "food", budget: 300},
    {name: "shopping", budget: 50},
    {name: "etc", budget: 30}
  ];

  $scope.monthlyData = [
    {name: "Snickers", date: "07/01/16", category: "cat", value: 100},
    {name: "books", date: "07/04/16", category: "etc", value: 24},
    {name: "groceries", date: "07/10/16", category: "food", value: 100}
  ];
  
  $scope.submitbutt = function(){
    alert($scope.newDate+", "+$scope.newName+", "+$scope.newCategory+", "+$scope.newValue); 
  }
  $scope.transferbutt = function(){
    alert($scope.transferFrom+", "+$scope.transferTo+", "+$scope.transferAmount); 
  }
  
  $scope.getRemaining = function(category) {
    var remaining = 0;
    for(var i = 0; i < $scope.categories.length; i++) {
      if ($scope.categories[i].name === category) {
        remaining = $scope.categories[i].budget;
        break;
      }
    }
    
    for(var i = 0; i < $scope.monthlyData.length; i++) {
      if($scope.monthlyData[i].name === category) {
        remaining -= $scope.monthlyData[i].amount;
      }
    }
    
    return remaining;
  
  };
  
  $scope.getRemainingStyle = function() {
    return "{color: red}"
  }
  
  
}]);