//CHAKRA-UI Component
import { useToast } from "@chakra-ui/react";
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";

//REACT Component
import ScrollableFeed from "react-scrollable-feed";

//USER-CREATED Components
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const toast = useToast();
  const handleDownload = () => {
    toast({
      title: "File Downloading",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span
              style={{
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                color: m.sender._id === user._id ? "white" : "black",
                backgroundColor:
                  m.sender._id === user._id ? "#EF233C" : "#B9F5D0",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                background: m.sender._id === user._id ? "#EF233C" : "#FFFFFF",
                borderRadius:
                  m.sender._id === user._id
                    ? "20px 20px 0px 20px"
                    : "20px 20px 20px 0px",
                padding: "5px 15px",
                maxWidth: "75%",
                display: "inline-block",
                marginBottom: "5px",
              }}
            >
              {m.content.substring(m.content.length - 3, m.content.length) ===
              "ebm" ? (
                <audio
                  style={{ minHeight: "39px", minWidth: "339px" }}
                  src={`http://localhost:5000/${m.content}`}
                  controls
                />
              ) : m.content.substring(0, 7) === "uploads" ? (
                m.content.substring(m.content.length - 3, m.content.length) ===
                "mp4" ? (
                  <video
                    width="304px"
                    height="500"
                    style={{
                      borderRadius: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                    controls
                  >
                    <source
                      src={`http://localhost:5000/${m.content}`}
                      type="video/mp4"
                    />
                  </video>
                ) : m.content.substring(
                    m.content.length - 3,
                    m.content.length
                  ) === "png" ||
                  m.content.substring(
                    m.content.length - 3,
                    m.content.length
                  ) === "jpg" ||
                  m.content.substring(
                    m.content.length - 3,
                    m.content.length
                  ) === "peg" ? (
                  <div
                    style={{
                      paddingBottom: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        style={{
                          width: "300px",
                          height: "200px",
                          borderRadius: "10px",
                          marginTop: "5px",
                          marginBottom: "5px",
                        }}
                        src={`http://localhost:5000/${m.content}`}
                        alt="Image"
                      />
                      <a
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                          width: "25px",
                          height: "25px",
                          background: "white",
                          borderRadius: "50%",
                          color: "green",
                          padding: "5px",
                          marginLeft: "90%",
                          marginTop: "-11%",
                          position: "absolute",
                        }}
                        href={`http://localhost:5000/${m.content}`}
                        download
                      >
                        <ViewIcon />
                      </a>
                    </div>
                    <p style={{ marginBottom: "5px" }}>
                      You can only Preview the Image
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "5px",
                      paddingBottom: "10px",
                      width: "260px",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>
                      <b>FIleName:</b>
                      <br />
                      {m.content.split("_").pop()}
                    </p>
                    <a
                      style={{
                        color: "green",
                        padding: "5px",
                        marginRight: "10px",
                        float: "right",
                        width: "10px",
                        borderRadius: "8px",
                      }}
                      href={`http://localhost:5000/${m.content}`}
                      download
                    >
                      <DownloadIcon onClick={handleDownload} />
                    </a>
                  </div>
                )
              ) : (
                m.content
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
