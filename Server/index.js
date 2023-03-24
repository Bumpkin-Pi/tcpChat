const port = process.argv[2];
// const address = process.argv[2];
const connectedSockets = new Set();

const net = require("net");
const chalk = require("chalk");
const fs = require('fs');
let history = fs.readFileSync('history.txt').toString().split("\n");


connectedSockets.broadcast = function(data, except) {
    for (let sock of this) {
        if (sock !== except) {
            sock.write(data);
        }
    }
}

const server = net.createServer().listen(port);
server.on('connection', function(sock){
    sock.id = `${sock.remoteAddress}:${sock.remotePort}`;
    connectedSockets.add(sock);
    console.log(`Client ${sock.id} connected`);
    for (let message in history){
        sock.write(history[message]+"\n");
    }


    connectedSockets.broadcast(`New client ${sock.id} connected.\n`, sock);





    sock.on('data', function(data) {
        if (data.toString()[0] === "/"){
            if (data.toString().split(" ")[0] === "/name"){
                name = (data.toString().replace("/name ", "").replaceAll(" ", "_"))
                // history.push(chalk.yellow(`User "${sock.id}" changed name to "${name}"`))
                // console.log(chalk.yellow(`User "${sock.id}" changed name to "${name}"`));
                // fs.appendFileSync("history.txt", (`User "${sock.id}" changed name to "${name}"`));
                // connectedSockets.broadcast(chalk.yellow(`User "${sock.id}" changed name to "${name}"`))

                sock.id = name;
            }
        }else{
            // console.log(`Received from ${sock.id}: ${data.toString()}`);
            history.push(`${chalk.green(sock.id)}: ${(data.toString())}`)
            console.log(`${chalk.green(sock.id)}: ${(data.toString())}`);
            fs.appendFileSync("history.txt", `${(sock.id)}: ${(data.toString())}\n`);
            connectedSockets.broadcast(`${chalk.green(sock.id)}: ${(data.toString())}`, sock);
        }
    });

    sock.on('end', function() {
        console.log(`Client ${sock.id} disconnected`);
        connectedSockets.delete(sock);
        connectedSockets.broadcast(chalk.yellow(`User ${chalk.green(sock.id)} disconnected`), sock);
    });
});

console.log(`Server listening on ${port}`);