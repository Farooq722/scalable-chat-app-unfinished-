import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    sockets: WebSocket[];
}

const rooms: Record<string, Room> = {
    // room1: {
    //     sockets: [s1, s2, s3...WebSocket.]
    // }
};

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {

    // console.log("data is :", data);
    const parsedData = JSON.parse(data);
    if(parsedData.type == "join-room") {
        const room = parsedData.room;
        if(!rooms[room]) {
            rooms[room] = {
                sockets: []
            }
        }
        rooms[room].sockets.push(ws);
    }

    if(parsedData.type == "chat") {
        const room = parsedData.room;
        rooms[room].sockets.map(socket => socket.send(data));
    }
});

ws.close();
//   ws.send('something');
}); 