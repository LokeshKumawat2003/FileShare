import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { FiDownload, FiEye, FiShare2, FiFile, FiImage, FiFileText, FiActivity } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function FileCard({ file, onShare, onView }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isOwner = user && file.owner === user.id;
  const isShared = user && file.sharedWith.includes(user.id);
  const canView = isOwner || (isShared && file.sharedPermissions?.canView);
  const canDownload = isOwner || (isShared && file.sharedPermissions?.canDownload);
  const canShare = isOwner || (isShared && file.sharedPermissions?.canShare);

  const isViewable = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf' || file.mimetype === 'text/csv';

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getFileIcon = () => {
    if (file.mimetype.startsWith('image/')) return FiImage;
    if (file.mimetype === 'application/pdf') return FiFileText;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/files/download/${file._id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleView = () => {
    onView(file);
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      shadow="sm"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      position="relative"
    >
      <VStack spacing={4} align="stretch">
        <HStack>
          <Icon as={getFileIcon()} boxSize={8} color="blue.500" />
          <Box flex={1}>
            <Text fontWeight="semibold" fontSize="md" noOfLines={2}>
              {file.originalName}
            </Text>
            <HStack spacing={2} mt={1}>
              <Badge size="sm" colorScheme="gray">
                {file.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {formatFileSize(file.size)}
              </Text>
            </HStack>
          </Box>
        </HStack>

        <HStack>
          {isOwner && <Badge colorScheme="green">Owner</Badge>}
          {isShared && !isOwner && <Badge colorScheme="blue">Shared</Badge>}
        </HStack>

        <HStack spacing={2} pt={2}>
          {isOwner && (
            <Tooltip label="View activity log">
              <Button
                size="sm"
                leftIcon={<FiActivity />}
                colorScheme="teal"
                variant="outline"
                onClick={() => navigate("/audit/" + file._id)}
              >
                Activity
              </Button>
            </Tooltip>
          )}
          {canShare && (
            <Tooltip label="Share file">
              <Button
                size="sm"
                leftIcon={<FiShare2 />}
                colorScheme="blue"
                variant="outline"
                onClick={() => onShare(file)}
                flex={1}
              >
                Share
              </Button>
            </Tooltip>
          )}
          {isViewable && canView && (
            <Tooltip label="View file">
              <Button
                size="sm"
                leftIcon={<FiEye />}
                colorScheme="purple"
                variant="outline"
                onClick={handleView}
                flex={1}
              >
                View
              </Button>
            </Tooltip>
          )}
          {canDownload && (
            <Tooltip label="Download file">
              <Button
                size="sm"
                leftIcon={<FiDownload />}
                colorScheme="green"
                onClick={handleDownload}
                flex={1}
              >
                {/* Download */}
              </Button>
            </Tooltip>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
