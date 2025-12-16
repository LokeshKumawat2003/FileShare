import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Progress,
  useToast,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FiUpload, FiFile } from "react-icons/fi";
import api from "../services/api";

export default function FileUpload({ refresh }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const handleUpload = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    try {
      await api.post("/files/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (refresh) refresh();
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    handleUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box
        border="2px dashed"
        borderColor={dragActive ? "blue.400" : borderColor}
        borderRadius="lg"
        p={8}
        bg={dragActive ? "blue.50" : bgColor}
        transition="all 0.2s"
        cursor="pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
      >
        <VStack spacing={4}>
          <Icon as={FiUpload} boxSize={12} color="gray.400" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
              Drag & drop files here, or click to select
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Support for multiple files
            </Text>
          </VStack>
          <Button
            leftIcon={<FiFile />}
            colorScheme="blue"
            variant="outline"
            size="sm"
          >
            Choose Files
          </Button>
        </VStack>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          display="none"
        />
      </Box>

      {isUploading && (
        <Box>
          <Text mb={2}>Uploading...</Text>
          <Progress value={uploadProgress} colorScheme="blue" size="sm" />
          <Text fontSize="sm" color="gray.600" mt={1}>
            {uploadProgress}% complete
          </Text>
        </Box>
      )}
    </VStack>
  );
}
