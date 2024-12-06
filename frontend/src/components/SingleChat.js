//CSS File
import "./styles.css";

//React Componenets
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

//Other Compnents
import io from "socket.io-client";
import Lottie from "react-lottie";
import Dropzone from "react-dropzone";
import Picker from "emoji-picker-react";
import axios from "axios";
import { ReactMic } from "react-mic";

//Imported Icons
import { IoIosVideocam } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { MdChangeCircle } from "react-icons/md";
import { IoDocumentAttach } from "react-icons/io5";
import { AiOutlineAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { BiSend } from "react-icons/bi";

//Chakara-UI Components
import { AddIcon, ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { FormControl } from "@chakra-ui/form-control";
import { MdMic } from "react-icons/md";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  useToast,
} from "@chakra-ui/react";

//User Created Components
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

// Socket endpoint
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // State for managing socket connection and typing status
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra-UI modal control
  const toast = useToast(); // Chakra-UI toast notifications

  //Emoji Picker
  const [showPicker, setShowPicker] = useState(false);
  const onEmojiClick = (event) => {
    setNewMessage((prevInput) => prevInput + event.emoji);
    setShowPicker(false);
  };

  //Typing Animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // Chat and User Context
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  // States for message loading and input
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages for the selected chat
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const [messages, setMessages] = useState([]);
  // Send message when user presses Enter
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Handle sending messages when the user clicks the send button
  const handleSend = async (event) => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Set up socket connection and listeners
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  // Fetch messages when selected chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Handle incoming messages
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  // Handle typing events
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //Files upload
  const onDrop = (files) => {
    console.log(files);

    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios
      .post("/api/chat/uploadfiles", formData, config)
      .then(async (response) => {
        if (response.data.success) {
          console.log(response.data.url);
          const fileName = response.data.url;
          console.log(fileName);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post(
              "/api/message",
              {
                content: fileName,
                chatId: selectedChat,
              },
              config
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
      });
  };

  const history = useHistory();

  // Handle video chat room creation
  const handlevideo = async (event) => {
    const VMessage = "You can join the room chat using this roomId";
    const userName = selectedChat.users[1].name;
    const message = `${VMessage}: ${userName}`;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: message,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    history.push(`/room/${userName}`);
  };

  //BackGround Change Function
  const [bg, setbg] = useState("");
  const bgchange = (files) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setbg(reader.result); // Update the background image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  //Audio file sending funtion
  const [menuOpen, setMenuOpen] = useState(false);
  const [voice, setVoice] = useState(false);
  const [audioLink, setAudioLink] = useState("");
  const [audioLinksArray, setAudioLinksArray] = useState([]);

  //Sends the audio file in the voice folder
  const onStop = async (blob) => {
    console.log(blob);
    console.log(blob.blobURL);

    const formData = new FormData();
    formData.append("file", blob.blob, "audio.webm"); // 'blob.blob' is the raw Blob data

    try {
      // Replace '/api/upload' with your actual endpoint for uploading files
      const uploadResponse = await axios.post(
        "/api/chat/uploadvoice",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`, // Add your authorization token if required
          },
        }
      );

      if (uploadResponse.data.success) {
        const fileUrl = uploadResponse.data.url; // URL of the uploaded audio file
        setAudioLink(fileUrl);
        setAudioLinksArray((prevArray) => [fileUrl, ...prevArray]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Error Occurred!",
        description: "Failed to upload the audio.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const startHandle = () => {
    setVoice(true);
  };
  const stopHandle = () => {
    setVoice(false);
  };

  // send the audio file in the chat
  const sendVoice = async () => {
    console.log("this is an voice array", audioLinksArray);
    if (!audioLink) {
      toast({
        title: "No audio recorded!",
        description: "Please record an audio before sending.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/message",
        {
          content: audioLinksArray[0], // Use audioLink here
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setAudioLink(""); // Clear the audio link after sending
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send the message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>

          <Box
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "100%",
            }}
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  audioLinksArray={audioLinksArray}
                />
              </div>
            )}

            <FormControl
              width="100%"
              height="50px"
              style={{ backgroundColor: "#EFF2F4", borderRadius: "10px" }}
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Menu>
                <MenuButton
                  _hover={{ backgroundColor: "#EFF2F4" }}
                  bg="#EFF2F4"
                  onClick={() => setMenuOpen(!menuOpen)}
                  as={Button}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  setMenuOpen="true"
                >
                  {menuOpen ? (
                    <AddIcon style={{ color: "#555555" }} />
                  ) : (
                    <AddIcon style={{ color: "#555555" }} />
                  )}
                </MenuButton>

                <MenuList>
                  <MenuItem onClick={handlevideo}>
                    <IoIosVideocam
                      style={{ marginRight: "5px", fontSize: "24px" }}
                    />
                    VideoRoom
                  </MenuItem>

                  <MenuDivider />

                  <Dropzone onDrop={onDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <MenuItem>
                            <IoDocumentAttach
                              style={{ marginRight: "5px", fontSize: "24px" }}
                            />
                            UploadFiles
                          </MenuItem>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  <MenuDivider />
                  <Dropzone onDrop={bgchange}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <MenuItem>
                            <MdChangeCircle
                              style={{ marginRight: "5px", fontSize: "24px" }}
                            />
                            Background
                          </MenuItem>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  <MenuDivider />

                  <MenuItem onClick={onOpen}>
                    <div>
                      <div style={{ display: "flex" }}>
                        <MdMic
                          style={{ marginRight: "5px", fontSize: "24px" }}
                        />
                        Voice Record
                      </div>
                      <Modal
                        size="2xl"
                        onClose={onClose}
                        isOpen={isOpen}
                        isCentered
                      >
                        <ModalOverlay />
                        <ModalContent h="280px">
                          <ModalHeader
                            fontSize="40px"
                            fontFamily="Work sans"
                            d="flex"
                            justifyContent="flex-start"
                          >
                            Voice Recorder
                          </ModalHeader>
                          <ModalCloseButton />
                          <ModalBody
                            display="flex"
                            flexDir="column"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <ReactMic
                              className="Mic"
                              record={voice}
                              onStop={onStop}
                            />
                          </ModalBody>
                          <ModalFooter>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <IconButton
                                bg="white"
                                icon={<AiOutlineAudio size="xs" />}
                                onClick={startHandle}
                                disabled={voice} // Disable when already recording
                                style={{ padding: "8px", margin: "5px" }}
                                _hover={{
                                  bg: "green.400",
                                }}
                              />
                              <IconButton
                                icon={<AiOutlineAudioMuted size="xs" />}
                                onClick={stopHandle}
                                disabled={!voice} // Disable when not recording
                                style={{ padding: "8px", margin: "5px" }}
                                _hover={{
                                  bg: "red.400",
                                }}
                              />
                              <IconButton
                                icon={<BiSend size="xs" />}
                                onClick={sendVoice}
                                disabled={!audioLink} // Disable when no audio to send
                                style={{ padding: "8px", margin: "5px" }}
                                _hover={{
                                  bg: "green.400",
                                }}
                              />
                            </div>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>

              <IconButton
                bg="#EFF2F4"
                _hover={{ backgroundColor: "#EFF2F4" }}
                icon={<MdEmojiEmotions />}
                style={{
                  marginRight: "5px",
                  marginLeft: "5px",
                  color: "#555555",
                }}
                fontSize="2xl"
                onClick={() => setShowPicker((val) => !val)}
              />
              {showPicker && (
                <div className="Picker-container">
                  <Picker
                    pickerStyle={{
                      position: "relative",
                      bottom: "8px",
                      left: "1px",
                      width: "100%",
                    }}
                    onEmojiClick={onEmojiClick}
                  />
                </div>
              )}

              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                _hover={{ backgroundColor: "#EFF2F4" }}
                style={{
                  color: "black",
                  fontSize: "18px",
                }}
                variant="filled"
                bg="#EFF2F4"
                value={newMessage}
                onChange={typingHandler}
                placeholder="Type message here..."
              />
              <div className="Icon">
                <IconButton
                  _hover={{ backgroundColor: "#EFF2F4" }}
                  bg="#EFF2F4 "
                  icon={<IoIosSend style={{ color: "#555555" }} />}
                  style={{ marginRight: "5px", marginLeft: "5px" }}
                  onClick={handleSend}
                  fontSize="3xl"
                />
                {/* <IconButton onClick={handleBlock} /> */}
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
