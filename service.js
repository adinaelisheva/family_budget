angular.module('budget',[]).service('httpSrvc', ['$http', function ($http) {
  
  const data = {
    categories: [],
    monthly: [],
    yearly: []
  };
  
  this.fetchAllData = async function(month, year) {
    const cats = await $http.get('/family-budget/categories.php');
    data.categories = cats.data;
    let qStr = '/family-budget/month.php?';
    if (month != undefined) {
      qStr += `month=${month}&`;
    }
    if (year) {
      qStr += `year=${year}&`;
    }
    const months = await $http.get(qStr);
    data.monthly = months.data;
    const years = await $http.get('/family-budget/year.php');
    data.yearly = years.data;
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