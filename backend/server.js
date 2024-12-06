//Important utilites
const multer = require("multer");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
//MiddleWare
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
//RouteFiles
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
//DataBaseFile
const connectDB = require("./config/db");

dotenv.config();
connectDB();

//app Configuration
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/voice", express.static("voice"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//----------------------------------------FilesUpload------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

app.post("/api/chat/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path });
  });
});
//--------------------------------------------FilesUpload-----------------------------------------------------------------

//--------------------------------------------VoiceFileUpload-----------------------------------------------------------------
const storagevoice = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "voice/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadvoice = multer({ storage: storagevoice }).single("file");

app.post("/api/chat/uploadvoice", (req, res) => {
  uploadvoice(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path });
  });
});
//--------------------------------------------VoiceFileUpload-----------------------------------------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// -------------------------------------------SERVER------------------------------------------------------------------------
const PORT = process.env.PORT;
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
// -------------------------------------------SERVER------------------------------------------------------------------------

//--------------------------------------------SocketOperations-----------------------------------------------------------------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
//--------------------------------------------SocketOperations-----------------------------------------------------------------
