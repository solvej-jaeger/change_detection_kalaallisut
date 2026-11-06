<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$json = file_get_contents('php://input');
//$opts = array('http'=>array('header'=> "User-Agent:MyAgent/1.0\r\n"));
//$context = stream_context_create($opts);
//$json = file_get_contents('php://input', false, $context);
$obj = json_decode($json, true);
file_put_contents('var/www/server_data/'.basename($obj["filename"]), $obj["filedata"]);
//$outfile = fopen('/var/www/server_data/'.date("Y-m-d")."_".basename($obj["filename"), 'w');
//fwrite($outfile, $obj["filedata"]);
//fclose($outfile);
?>
