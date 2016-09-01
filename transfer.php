<?php

/*
  Usage: POST transfer.php
    catin:  // name of the category to transfer into
    catout:  // name of the category to transfer out of
    value: 1.50 // Value of the transaction in dollars
    date: "2016-07-12" // Date of the transaction, optional (if unspecified, assume 'now')

  Returns: nothing
*/

  include("common.php"); 

  $params = json_decode(file_get_contents('php://input'));


  // Get the category
  $catin = $params->catin or die('{"Error":"Category empty"}');
  $catout = $params->catout or die('{"Error":"Category empty"}');

  $value = mysqli_real_escape_string($db, $params->value);
  if (empty($value) || $value == 0) die('{"Error":"Value cannot be empty"}');
  $date = mysqli_real_escape_string($db, $params->date);
  if (empty($date)) { 
    $date = time();
  } else {
    $date = strtotime($date);
  }

  $datestr = date ("Y-m-d", $date);
 
 $sql = "INSERT INTO transactions (name, category, value, date, visible) 
         SELECT 'TRANSFER-IN', id, $value, '$datestr',0 FROM categories WHERE name = '$catin'";
  echo("SQL: $sql\n\n");
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');
  $id1 = $db->insert_id;

  $sql = "INSERT INTO transactions (name, category, value, date, visible) 
          SELECT 'TRANSFER-OUT', id, -$value, '$datestr',0 FROM categories WHERE name = '$catout'";
  echo("SQL: $sql\n\n");
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');
  $id2 = $db->insert_id;

  $result = mysqli_query($db, "SELECT * FROM transactions WHERE id = $id1 OR id = $id2") or die('{"Error":"'+mysqli_error($db)+'"}');
  
  $json = [];
  $json[] = mysqli_fetch_assoc($result);
  $json[] = mysqli_fetch_assoc($result);

  echo(json_encode($entry, JSON_NUMERIC_CHECK));
?>
