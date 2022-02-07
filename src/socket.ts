import { Server } from "socket.io";
import * as http from "http"
import * as express from "express"

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

export default (app: express.Application) => {
    let server = http.createServer(app)
    let io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

    return io
}