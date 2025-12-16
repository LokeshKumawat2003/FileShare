import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  Heading,
  Text,
  Spacer,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FileUpload from "../components/FileUpload";
import FileCard from "../components/FileCard";
import ShareModal from "../components/ShareModal";
import FileViewer from "../components/FileViewer";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const { user, logout } = useAuth();

  const loadFiles = async () => {
    const res = await api.get("/files");
    setFiles(res.data);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" shadow="sm" borderBottomWidth={1} borderColor="gray.200">
        <Container maxW="container.xl">
          <Flex align="center" py={4}>
            <Heading size="md" color="blue.600">
              FileShare
            </Heading>
            <Spacer />
            <Text mr={4}>Welcome, {user?.name}</Text>
            <Button colorScheme="red" size="sm" onClick={logout}>
              Logout
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>
              Upload Files
            </Heading>
            <FileUpload refresh={loadFiles} />
          </Box>

          <Box>
            <Heading size="lg" mb={4}>
              Your Files
            </Heading>
            {files.length === 0 ? (
              <Text>No files uploaded yet.</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {files.map((file) => (
                  <FileCard
                    key={file._id}
                    file={file}
                    onShare={setSelectedFile}
                    onView={setViewFile}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </Container>

      {selectedFile && (
        <ShareModal
          isOpen={true}
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {viewFile && (
        <FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      )}
    </Box>
  );
}
