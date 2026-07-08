import { io, Socket } from "socket.io-client";
import { store } from "@/redux/store";
import { wsTaskCreated, wsTaskUpdated, wsTaskDeleted } from "@/redux/slices/taskSlice";

let socket: Socket | null = null;

export const socketService = {
  connect: (userId: string, token: string) => {
    if (socket) return;

    const socketUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000";
    
    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected. Joining user room:", userId);
      socket?.emit("join", userId);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    socket.on("task:created", (task) => {
      console.log("Task created via WS:", task);
      store.dispatch(wsTaskCreated(task));
    });

    socket.on("task:updated", (task) => {
      console.log("Task updated via WS:", task);
      store.dispatch(wsTaskUpdated(task));
    });

    socket.on("task:deleted", (data) => {
      console.log("Task deleted via WS:", data);
      store.dispatch(wsTaskDeleted(data.id));
    });
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("WebSocket disconnected manually");
    }
  },

  getSocket: () => socket,
};

export default socketService;
