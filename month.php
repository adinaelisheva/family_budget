<?php
/* Usage: GET month.php
*/
  include("common.php"); 

  $month = $_GET["month"];
  $month = mysqli_real_escape_string($db, $month ? $month : date("m"));
  $year = $_GET["year"];
  $year = mysqli_real_escape_string($db, $year ? $year : date("Y"));

  $json = [];

  $sql = "SELECT transactions.id,transactions.name,date,categories.name AS category,value,visible from transactions 
          LEFT OUTER JOIN categories ON transactions.category = categories.id
          WHERE MONTH(date) = $month AND categories.yearly = 0 AND YEAR(date) = $year 
          ORDER BY date DESC"; 
  
  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry;
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));

?> 
