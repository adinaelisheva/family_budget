angular.module('budget').controller('budgetCtrl', ['$scope', 'httpSrvc', function($scope, httpSrvc) {
  
  var today = new Date();
  
  var resetInputs = function() {
    $scope.newCategory = $scope.categories[0].name;
    $scope.transferFrom = $scope.categories[0].name;
    var secondInd = $scope.categories.length > 1 ? 1 : 0;
    $scope.transferTo = $scope.categories[secondInd].name;
    $scope.newName = "";
    $scope.newValue = "";
    $scope.newDate = today;
    $scope.transferAmount = "";
  }
  
  var updatePage = function(notifyStr) {
    httpSrvc.fetchAllData().then(function() {
      $scope.categories = httpSrvc.data.categories;
      $scope.monthlyData = httpSrvc.data.monthly;
      $scope.yearlyData = httpSrvc.data.yearly;
      
      calculateRemaining();
    
      //set up some initial stuff
      if($scope.categories.length === 0) { return; }
      resetInputs();
      
      if (notifyStr) {
        $.notify(notifyStr,"success");
      };
    
    });
    
  }
  
  //function to interpolate colors and return an RGB style string
  var getPctStyle = function(pct, yearly) {
    var color = [0,0,0];
    
    //colors and percentages for interpolation
    redPct = 0;
    yellowPct = 0.25;
    greenPct = 1;
    red = [220,10,10];
    yellow = [210,215,5];
    green = [20,200,20];
    
    var curDays = today.getDate();
    if(yearly) {
      curDays += 30 * (today.getMonth() - 1); //approximate day of year
    }
    var totalDays = yearly ? 361 : 30;

    var datePct = (totalDays-curDays)/totalDays;
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

    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';

  }

  var calculateRemaining = function() {
    var data = $scope.monthlyData.concat($scope.yearlyData);
    
    //set up the remaining data and colors
    var remaining = {};
    //start every category with its total budget remaining
    for(var i = 0; i < $scope.categories.length; i++) {
      var cat = $scope.categories[i];
      remaining[cat.name] = cat.budget;
    }
    //subtract every item from its category's total
    for(var i = 0; i < data.length; i++) {
      var item = data[i];
      remaining[item.category] -= item.value;
    }

    //save each remaining amount to its category
    for(var i = 0; i < $scope.categories.length; i++) {
      var cat = $scope.categories[i];
      cat.amtRemaining = remaining[cat.name];
      cat.pctRemaining = cat.amtRemaining / cat.budget;
      cat.color = getPctStyle(cat.pctRemaining, cat.yearly);
    }
  }
  
  $scope.submitbutt = function(){
    httpSrvc.submit($scope.newDate, $scope.newName, $scope.newCategory, 
      $scope.newValue).then(function() { 
        updatePage($scope.newName+" successfully added."); 
      });
  }
  
  $scope.transferbutt = function(){
    httpSrvc.transfer($scope.transferFrom, $scope.transferTo, 
      $scope.transferAmount).then(function() { updatePage("Transfer successful."); });
  }
  
  $scope.submitKey = function(event) {
    if (event.which === 13) { $scope.submitbutt(); }
  }
  
  $scope.transferKey = function(event) {
    if (event.which === 13) { $scope.transferbutt(); }
  }
  
  updatePage();
  
}]);
