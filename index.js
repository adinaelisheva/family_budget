angular.module('budget', []).controller('budgetCtrl', ['$scope', '$http', function($scope, $http) {
  
  //AJAX methods
  $http.get("/family-budget/categories.php").success(function(json){
    $scope.categories = json;
    tryCalculateRemaining();
  });

  $http.get("/family-budget/month.php").success(function(json){
    $scope.monthlyData = json;
    tryCalculateRemaining();
  });
  
  //function to interpolate colors and return an RGB style string
  var getPctStyle = function(pct) {
    var color = [0,0,0];
    
    //colors and percentages for interpolation
    redPct = 0;
    yellowPct = 0.25;
    greenPct = 1;
    red = [220,10,10];
    yellow = [250,235,5];
    green = [20,200,20];
    
    var d = new Date();
    var curDays = d.getDate();

    var datePct = (30-curDays)/30;
    var lowPct = Math.max(-0.1,datePct-0.1);
    var highPct = Math.min(1,datePct+0.1);
    
    var color;

    if (pct >= highPct) {
      color = green;
    }
    else if (pct <= lowPct) {
      color = red;
    }
    else if(pct < datePct) {
      //interpolate between red and yellow
      var curPct = (pct - lowPct)/(datePct - lowPct);
      color[0] = Math.round( red[0] + curPct * (yellow[0] - red[0]));
      color[1] = Math.round( red[1] + curPct * (yellow[1] - red[1]));
      color[2] = Math.round( red[2] + curPct * (yellow[2] - red[2]));
    }  
    else {
      //interpolate between yellow and green
      var curPct = (pct - datePct)/(highPct - datePct);
      color[0] = Math.round( yellow[0] + curPct * (green[0] - yellow[0]));
      color[1] = Math.round( yellow[1] + curPct * (green[1] - yellow[1]));
      color[2] = Math.round( yellow[2] + curPct * (green[2] - yellow[2]));
    }

    pct = Math.max(0,Math.min(100,pct * 100));

    return "rgb("+color[0]+","+color[1]+","+color[2]+")";

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
      cat.color = getPctStyle(cat.pctRemaining);
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
