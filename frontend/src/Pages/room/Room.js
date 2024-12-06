import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
const Room = () => {
  const { roomId } = useParams();
  const myMeeting = async (element) => {
    const appId = 1666962790;
    const serverSecret = "e95711aa7130d45b86ff367f05a232f5";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      " "
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);

    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:3000/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "28%",
      }}
    >
      <div ref={myMeeting} />
    </div>
  );
};

export default Room;
