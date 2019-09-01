angular.module('budget').controller('budgetCtrl', ['$scope', '$interval', 'httpSrvc', function($scope, $interval, httpSrvc) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = [31,28,31,30,31,30,31,31,30,31,30,31];

  // Returns a Date for either the last day of the month indicated
  // in the URL, or today.
  function getValidDate() {
    const today = new Date();
    const usp = new URLSearchParams(window.location.search);
    let queryMonth = usp.get('m');
    let queryYear = usp.get('y');
    if (!queryMonth || !queryYear) {
      return today;
    }
    queryMonth = Number(queryMonth);
    queryYear = Number(queryYear);
    if (isNaN(queryMonth) || isNaN(queryYear)) {
      return today;
    }
    queryMonth -= 1;
    if (queryMonth < 0 || queryMonth > 11 || queryYear < 2012 || queryYear > today.getFullYear()) {
      return today;
    }
    const queryDay = days[queryMonth];
    return new Date(`${months[queryMonth]} ${queryDay} ${queryYear}`);
  }

  const today = getValidDate();
  
  function resetInputs() {
    $scope.newCategory = $scope.categories[0].name;
    $scope.transferFrom = $scope.categories[0].name;
    const secondInd = $scope.categories.length > 1 ? 1 : 0;
    $scope.transferTo = $scope.categories[secondInd].name;
    $scope.newName = "";
    $scope.newValue = "";
    $scope.newDate = today;
    $scope.transferAmount = "";
  }
  
  function updatePage(notifyStr) {
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
  function getPctStyle(pct, yearly) {
    let color = [0,0,0];
    
    //colors for interpolation
    let red = [220,10,10];
    let yellow = [210,215,5];
    let green = [20,200,20];
    
    let curDays = today.getDate();
    if(yearly) {
      curDays += 30 * (today.getMonth() - 1); //approximate day of year
    }
    const totalDays = yearly ? 361 : 30;

    const datePct = (totalDays-curDays)/totalDays;
    const lowPct = Math.max(-0.1,datePct-0.1);
    const highPct = Math.min(1,datePct+0.1);
    
    if (pct >= highPct) {
      color = green;
    }
    else if (pct <= lowPct) {
      color = red;
    }
    else if(pct < datePct) {
      //interpolate between red and yellow
      const curPct = (pct - lowPct)/(datePct - lowPct);
      color[0] = Math.round(red[0] + curPct * (yellow[0] - red[0]));
      color[1] = Math.round(red[1] + curPct * (yellow[1] - red[1]));
      color[2] = Math.round(red[2] + curPct * (yellow[2] - red[2]));
    }  
    else {
      //interpolate between yellow and green
      const curPct = (pct - datePct)/(highPct - datePct);
      color[0] = Math.round(yellow[0] + curPct * (green[0] - yellow[0]));
      color[1] = Math.round(yellow[1] + curPct * (green[1] - yellow[1]));
      color[2] = Math.round(yellow[2] + curPct * (green[2] - yellow[2]));
    }

    pct = Math.max(0,Math.min(100,pct * 100));

    return 'rgb('+color[0]+','+color[1]+','+color[2]+')';

  }

  function calculateRemaining() {
    const data = $scope.monthlyData.concat($scope.yearlyData);
    
    //set up the remaining data and colors
    const remaining = {};
    //start every category with its total budget remaining
    for(let i = 0; i < $scope.categories.length; i++) {
      const cat = $scope.categories[i];
      remaining[cat.name] = cat.budget;
    }
    //subtract every item from its category's total
    for(let i = 0; i < data.length; i++) {
      const item = data[i];
      remaining[item.category] -= item.value;
    }

    //save each remaining amount to its category
    for(let i = 0; i < $scope.categories.length; i++) {
      const cat = $scope.categories[i];
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

  $scope.submitToCat = function(cat){
    console.log("submitToCat: " + $scope.newDate + ", " + $scope.newName + ", " + cat + ", " + $scope.newValue)
    httpSrvc.submit($scope.newDate, $scope.newName, cat, 
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

  $scope.monthLabel = months[today.getMonth()];
  
  updatePage();

  const delay = 1000*60*5; //five minutes
  const refreshPageInterval = $interval(updatePage, delay);
  
}]);
