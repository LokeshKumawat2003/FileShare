import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Spinner,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import FileViewer from "../components/FileViewer";
import axios from "axios";

export default function ShareView() {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedFile();
  }, [token]);

  const fetchSharedFile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/share/info/${token}`);
      setFile(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load shared file");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.600">
          Loading shared file...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" p={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <AlertTitle>Access Denied!</AlertTitle>
            <AlertDescription>
              {error}. The shared file may not exist or the link may be invalid.
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!file) {
    return (
      <Box minH="100vh" p={8}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>File not found</AlertTitle>
          <AlertDescription>
            The shared file could not be loaded.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Shared File: {file.originalName}
        </Text>
        <FileViewer file={file} onClose={() => navigate('/')} />
      </VStack>
    </Box>
  );
}