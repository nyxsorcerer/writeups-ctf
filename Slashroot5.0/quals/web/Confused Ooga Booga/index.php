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