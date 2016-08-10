<?php

/*
  Usage: POST add.php
    cat: "Food" // name of the category to insert into
    name: "Apples" // Name of the transaction
    value: 1.50 // Value of the transaction in dollars
    date: "2016-07-12" // Date of the transaction, optional (if unspecified, assume 'now')

  Returns: JSON representation of new transaction, or object with "Error" key if failure
*/

  include("common.php"); 

  // Get the category

  $params = json_decode(file_get_contents('php://input'));


  $cat = mysqli_real_escape_string($db, $params->cat);
  if (empty($cat)) die('{"Error":"cat cannot be empty"}');
  $name = mysqli_real_escape_string($db, $params->name);
  if (empty($name)) die('{"Error":"Name cannot be empty"}');
  $value = mysqli_real_escape_string($db, $params->value);
  if (empty($value) || $value == 0) die('{"Error":"Value cannot be empty"}');
  $date = mysqli_real_escape_string($db, $params->time);
  if (empty($date)) { 
    $date = time();
  } else {
    $date = strtotime($date);
  }

  $datestr = date ("Y-m-d", $date);
 
  $sql = "INSERT INTO transactions (name, category, value, date) SELECT '$name', id, $value, '$datestr' FROM categories WHERE name = '$cat' ";
 
 echo("\n\nSQL: $sql\n");
  
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');

  echo("Executed\n");
  
  $result = mysqli_query($db, "SELECT * FROM transactions WHERE id = {$db->insert_id} LIMIT 1") or die('{"Error":"'+mysqli_error($db)+'"}');
  $entry = mysqli_fetch_assoc($result);

  echo(json_encode($entry, JSON_NUMERIC_CHECK));
?>
