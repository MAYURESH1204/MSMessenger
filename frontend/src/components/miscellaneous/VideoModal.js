//React Components
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
//Chakra-UI components
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { BiSolidVideoPlus } from "react-icons/bi";

const VideoModal = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState();
  const history = useHistory();

  //move user to the VideoChat Room
  const buttonClick = useCallback(() => {
    history.push(`/room/${value}`);
  }, [history, value]);

  return (
    <>
      {/* IconButton to trigger the modal */}
      <Tooltip label="Join video room" hasArrow placement="bottom-end">
        <IconButton
          icon={<BiSolidVideoPlus style={{ color: "white" }} />}
          bg="#EF233C"
          aria-label="Open Modal"
          onClick={onOpen}
          fontSize="2xl"
          _hover={{
            background: "linear-gradient(to right, #6c5ed2, #8854d3)",
          }}
        />
      </Tooltip>
      {/* Modal Component */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              type="text"
              placeholder="Enter roomId"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={buttonClick}>
              Join Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoModal;
