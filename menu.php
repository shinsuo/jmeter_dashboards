<?php
$dir    = '.';
$files1 = scandir($dir);
$files2 = scandir($dir, 1);

foreach ($files1 as $key => $value) {
    if($value == "index.php" || $value == "README.TXT" ||$value == "." ||$value == "sbadmin2-1.0.7"||$value == ".."||$value == ".DS_Store"||$value == "menu.php"||$value == "content.php"){
        continue;
    }
?>
    <a href="<?php echo $value?>" target="content"><?php echo $value?></a><br>
<?php
}
?>