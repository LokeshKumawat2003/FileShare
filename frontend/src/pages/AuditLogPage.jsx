import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Badge,
  HStack,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AuditLogPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (fileId) {
      fetchLogs();
    }
  }, [fileId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/files/${fileId}/logs`);
      setLogs(res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'view': return 'blue';
      case 'download': return 'green';
      case 'share': return 'purple';
      case 'generate_link': return 'orange';
      default: return 'gray';
    }
  };

  if (!user) {
    return <Text>Please log in to view this page.</Text>;
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">File Activity Log</Heading>
            <Button onClick={() => navigate(-1)} colorScheme="blue" variant="outline">
              Back
            </Button>
          </HStack>

          {loading ? (
            <Box textAlign="center">
              <Spinner size="xl" color="blue.500" />
              <Text mt={4}>Loading...</Text>
            </Box>
          ) : logs.length === 0 ? (
            <Text>No activity yet.</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {logs.map((log, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg="white">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{log.user?.name || 'Unknown User'}</Text>
                      <Text fontSize="sm" color="gray.600">{log.user?.email}</Text>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Badge colorScheme={getActionColor(log.action)}>
                        {log.action.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(log.timestamp).toLocaleString()}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}