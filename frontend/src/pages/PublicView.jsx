import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import api from "../services/api";

export default function PublicView() {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicFile();
  }, [id]);

  const fetchPublicFile = async () => {
    try {
      const res = await api.get(`/files/public/${id}`);
      setFile(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load file");
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
          Loading file...
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
              {error}. The file may not exist or you may not have permission.
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
            The file could not be loaded.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          File: {file.originalName}
        </Text>
        <FileViewer file={file} onClose={() => navigate('/')} />
      </VStack>
    </Box>
  );
}