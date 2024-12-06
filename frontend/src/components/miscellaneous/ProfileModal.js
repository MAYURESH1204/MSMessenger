//Chakra-UI Components
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <IconButton
            bg="#EF233C"
            d={{ base: "flex" }}
            icon={<ViewIcon style={{ color: "white" }} fontSize="xl" />}
            onClick={onOpen}
            _hover={{
              background: "linear-gradient(to right, #6c5ed2, #8854d3)",
            }}
          />
        </div>
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="370px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            flexDir="column"
            justifyContent="flex-start"
          >
            {user.name}
            <Text fontSize="25px" fontFamily="Work sans">
              Email: {user.email}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" justifyContent="flex-start">
            <Image
              borderRadius="10px"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              width="259px"
              height="205px"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
