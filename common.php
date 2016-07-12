<?php
$host = 'localhost';
$username = 'root';
$password = 'TkSm8Aj3eiQ';
  date_default_timezone_set ( 'America/New_York' );
  $db = mysqli_connect($host, $username, $password,"family_budget") or die(mysqli_error($db));
?>
