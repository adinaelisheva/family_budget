<?php
/* Usage: GET categories.php

  returns all categories and their details
*/
  include("common.php"); 

  $json = [];

  $sql = "SELECT * FROM categories";
   
  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry;
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));

?> 
