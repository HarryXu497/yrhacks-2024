const express = require('express');
const app = express();
const { ExpressPeerServer } = require('peer');
const cors = require("cors");

app.use(cors());

const server = app.listen(5174, () => {
	console.log("Listening on port 5174")
});

const peerServer = ExpressPeerServer(server, {
	debug: true,
	key: "peerjs",
	allow_discovery: true,
	alive_timeout: 10000,
	corsOptions: {
		origin: "http://localhost:5173"
	},
});

peerServer.on("connection", conn => {
	console.log(conn.getId())
})

app.use("/rtc", peerServer);