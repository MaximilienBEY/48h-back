import { Server } from "socket.io";
import * as http from "http"
import * as express from "express"

interface ServerToClientEvents {
    groupChange: (id: number) => void;
    groupDelete: (id: number) => void;
}

interface ClientToServerEvents {
}

const getSocket = (server: http.Server) => {
    let io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

    return io
}

export default getSocket