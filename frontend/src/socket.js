import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  query: {
    userId: localStorage.getItem("id"),
  },
});
