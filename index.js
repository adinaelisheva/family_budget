angular.module('budget', []).controller('budgetCtrl', ['$scope', '$http', function($scope, $http) {
  
  //AJAX methods
  var fetchCategories = function(){
      $http.get("/family-budget/categories.php").success(function(json){
        $scope.categories = json;
        tryCalculateRemaining();
      });
  }

  var fetchData = function(){
      $http.get("/family-budget/month.php").success(function(json){
        $scope.monthlyData = json;
        tryCalculateRemaining();
      });
  }

  var tryCalculateRemaining = function() {
    if (!$scope.monthlyData || !$scope.categories) { return; } 
    
    //set up the remaining data and colors
    var remaining = {};
    //start every category with its total budget remaining
    for(var i = 0; i < $scope.categories.length; i++) {
      var cat = $scope.categories[i];
      remaining[cat.name] = cat.budget;
    }
    //subtract every item from its category's total
    for(var i = 0; i < $scope.monthlyData.length; i++) {
      var item = $scope.monthlyData[i];
      remaining[item.category] -= item.value;
    }
    //save each remaining amount to its category
    for(var i = 0; i < $scope.categories.length; i++) {
      var cat = $scope.categories[i];
      cat.amtRemaining = remaining[cat.name];
      //TODO - calculate this better
      cat.pctRemaining = cat.amtRemaining / cat.budget;
      cat.color = "green";
    }
  }
  
  $scope.submitbutt = function(){
    alert($scope.newDate+", "+$scope.newName+", "+$scope.newCategory+", "+$scope.newValue); 
  }
  $scope.transferbutt = function(){
    alert($scope.transferFrom+", "+$scope.transferTo+", "+$scope.transferAmount); 
  }
  
  $scope.getRemainingStyle = function() {
    return "";
  }
  
  
}]);
