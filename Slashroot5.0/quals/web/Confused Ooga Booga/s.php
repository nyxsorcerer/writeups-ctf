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