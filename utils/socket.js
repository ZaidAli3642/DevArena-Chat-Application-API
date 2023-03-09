const { Server } = require("socket.io");

const socketService = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
    },
  });

  let users = [];

  const addUsers = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });

    console.log("usersssss : ", users);
  };

  const removeUsers = (sockerId) => {
    users = users.filter((user) => user.socketId !== sockerId);
    console.log("usersssss removed : ", users);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log("a user connected : " + socket.id);

    socket.on("add_user", ({ userId }) => {
      console.log("a user added : " + userId);
      console.log("a user added socket :  " + socket.id);
      addUsers(userId, socket.id);
    });

    socket.on("send_message", (data) => {
      console.log("Sent message : ", data);
      const receiver = getUser(data.receiverId);
      console.log("Receiver : ", receiver);
      socket
        .to(receiver.socketId)
        .emit("receive_message", JSON.stringify(data));
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUsers(socket.id);
    });
  });
};

module.exports = socketService;
