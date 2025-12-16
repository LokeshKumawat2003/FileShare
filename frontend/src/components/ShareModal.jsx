import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Checkbox,
  VStack,
  HStack,
  Box,
  Divider,
  Badge,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormControl,
  FormLabel,
  Avatar,
  Spacer,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiCopy, FiShare2, FiLink } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
const baseUel=import.meta.env.VITE_FRONTEND_BASE_URL;
export default function ShareModal({ isOpen, onClose, file }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [link, setLink] = useState("");
  const [canView, setCanView] = useState(true);
  const [canDownload, setCanDownload] = useState(true);
  const [canShare, setCanShare] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const toast = useToast();

  const isOwner = user && file.owner === user.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data.filter(u => u._id !== user?.id));
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load users",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    if (isOpen) {
      fetchUsers();
      setCanView(file.sharedPermissions?.canView ?? true);
      setCanDownload(file.sharedPermissions?.canDownload ?? true);
      setCanShare(file.sharedPermissions?.canShare ?? true);
      setCanEdit(file.sharedPermissions?.canEdit ?? false);
      setLink("");
      setSelectedUsers([]);
    }
  }, [isOpen, file, user, toast]);

  const shareWithUsers = async () => {
    if (selectedUsers.length === 0) return;

    setIsSharing(true);
    try {
      await api.post(`/share/user/${file._id}`, {
        users: selectedUsers,
      });
      if (isOwner) {
        await api.put(`/files/${file._id}/permissions`, {
          canView,
          canDownload,
          canShare,
          canEdit,
        });
      }
      toast({
        title: "Success",
        description: `Shared with ${selectedUsers.length} user(s)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedUsers([]);
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to share file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const generateLink = async () => {
    setIsGeneratingLink(true);
    try {
      setLink(`${baseUel}/public/${file._id}`);
      toast({
        title: "Link Generated",
        description: "Public link created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate link",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <FiShare2 />
            <Text>Share File</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* File Info */}
            <Box p={4} bg="gray.50" rounded="md">
              <HStack>
                <Avatar size="sm" name={file.filename} />
                <Box>
                  <Text fontWeight="medium">{file.originalName}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {file.size} bytes • {file.mimetype}
                  </Text>
                </Box>
                <Spacer />
                <Badge colorScheme={isOwner ? "green" : "blue"}>
                  {isOwner ? "Owner" : "Shared"}
                </Badge>
              </HStack>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={3}>
                Share with Users
              </Text>
              <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
                {users.map((u) => (
                  <Checkbox
                    key={u._id}
                    isChecked={selectedUsers.includes(u._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, u._id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== u._id));
                      }
                    }}
                  >
                    <HStack>
                      <Avatar size="xs" name={u.name} />
                      <Text>{u.name} ({u.email})</Text>
                    </HStack>
                  </Checkbox>
                ))}
              </VStack>
            </Box>

            {isOwner && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="medium" mb={3}>
                    Permissions
                  </Text>
                  <VStack align="start" spacing={3}>
                    <Checkbox
                      isChecked={canView}
                      onChange={(e) => setCanView(e.target.checked)}
                    >
                      Allow View
                    </Checkbox>
                    <Checkbox
                      isChecked={canDownload}
                      onChange={(e) => setCanDownload(e.target.checked)}
                    >
                      Allow Download
                    </Checkbox>
                    <Checkbox
                      isChecked={canShare}
                      onChange={(e) => setCanShare(e.target.checked)}
                    >
                      Allow Share
                    </Checkbox>
                    <Checkbox
                      isChecked={canEdit}
                      onChange={(e) => setCanEdit(e.target.checked)}
                    >
                      Allow Edit
                    </Checkbox>
                  </VStack>
                </Box>
              </>
            )}

            <Divider />
            <Box>
              <Text fontWeight="medium" mb={3}>
                Share Link
              </Text>
              <HStack>
                <Button
                  leftIcon={<FiLink />}
                  onClick={generateLink}
                  isLoading={isGeneratingLink}
                  loadingText="Generating..."
                  colorScheme="blue"
                  variant="outline"
                >
                  Generate Link
                </Button>
              </HStack>
              {link && (
                <Box mt={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Shareable Link</FormLabel>
                    <InputGroup>
                      <Input value={link} isReadOnly />
                      <InputRightElement>
                        <IconButton
                          icon={<FiCopy />}
                          onClick={copyToClipboard}
                          variant="ghost"
                          size="sm"
                          aria-label="Copy link"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
              )}
            </Box>

            <HStack spacing={3} pt={4}>
              <Button
                onClick={shareWithUsers}
                isDisabled={selectedUsers.length === 0}
                isLoading={isSharing}
                loadingText="Sharing..."
                colorScheme="green"
              >
                Share with {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
