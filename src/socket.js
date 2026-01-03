import { io } from "socket.io-client";
const serverIP = sessionStorage.getItem("serverIP");
export const socket = io(serverIP);