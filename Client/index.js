const Net = require('net');
const chalk = require("chalk");
const blessed = require('blessed');
let screen = blessed.screen();
let body = blessed.box({
    top: 0,
    left: 0,
    height: '100%-1',
    width: '100%',
    keys: true,
    mouse: true,
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
        ch: ' ',
        bg: 'red'
    }
});
let inputBar = blessed.textbox({
    bottom: 0,
    left: 0,
    height: 1,
    width: '100%',
    keys: true,
    mouse: true,
    inputOnFocus: true,
    style: {
        fg: 'black',
        bg: 'blue'  // Blue background so you see this is different from body
    }
});




let name = process.argv[4] || "";
console.log(name)

screen.append(body);
screen.append(inputBar);
screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));

inputBar.on('submit', (text) => {
    log(chalk.red("You: ")+chalk.white(text));
    client.write(text);
    inputBar.clearValue();
    inputBar.focus();
});
function log(text) {
    body.pushLine(text);
    screen.render();
}
screen.key('enter', (ch, key) => {
    inputBar.focus();
});


// The port number and hostname of the server.
const port = process.argv[3];
const host = process.argv[2];
const timeout = 10;

// Create a new TCP client.
const client = new Net.Socket();

// Wait for 2 seconds before attempting to connect to the server.
setTimeout(function() {
    // Send a connection request to the server.
    client.connect({ port: port, host: host }, function() {
        // If there is no error, the server has accepted the request and created a new
        // socket dedicated to us.
        log('TCP connection established with the server.\n\n');
        if (name != ""){
            client.write(`/name ${name}`);
        }


        // The client can now send data to the server by writing to its socket.
        // client.write('Hello, server.');
    });
}, timeout);

// The client can also receive data from the server by reading from its socket.
client.on('data', function(chunk) {



    log(chunk.toString());

    // Request an end to the connection after the data has been received.
    // client.end();
});

client.on('end', function() {
    log('Requested an end to the TCP connection');
    process.exit();
});

