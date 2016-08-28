<?php
/* Usage: GET year.php?year=2016
  (note: year is optional, defaults to this year)
*/
  include("common.php"); 

  $year = $_GET["year"];
  $year = mysqli_real_escape_string($db, $year ? $year : date("Y"));

  $category = mysqli_real_escape_string($db, $category);

  $json = [];

  $sql = "SELECT transactions.id,transactions.name,date,categories.name AS category,value,visible from transactions 
          LEFT OUTER JOIN categories ON transactions.category = categories.id
          WHERE categories.yearly = 1 AND YEAR(date) = $year 
          ORDER BY date DESC"; 
  
  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry;
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));

?> 
