angular.module('budget',[]).service('httpSrvc', ['$http', function ($http) {
  
  const data = {
    categories: [],
    monthly: [],
    yearly: []
  };
  
  this.fetchAllData = function(month, year) {
    return $http.get('/family-budget/categories.php').then(function(cats) {
      data.categories = cats.data;
    }).then(function() {
      let qStr = '/family-budget/month.php?';
      if (month != undefined) {
        qStr += `month=${month}&`;
      }
      if (year) {
        qStr += `year=${year}&`;
      }
      return $http.get(qStr);
    }).then(function(months) {
      data.monthly = months.data;
    }).then(function() {
      return $http.get('/family-budget/year.php');
    }).then(function(years) {
      data.yearly = years.data;
    });
  };
  
  this.submit = function(date, name, category, value) {
    if(!date || !name || !category || !value) { return; }
    
    return $http.post('/family-budget/add.php', {
      'cat': category,
      'name': name,
      'value': value,
      'date': date
    });
  }
  
  this.transfer = function(transferFrom, transferTo, amt) {
    if(!transferFrom || !transferTo || !amt) { return; }
    return $http.post('/family-budget/transfer.php', {
      'catin': transferTo,
      'catout': transferFrom,
      'value': amt
    })
  }
  
  this.data = data;
    

}]);