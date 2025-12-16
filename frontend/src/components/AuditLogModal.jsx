import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Box,
  Badge,
  HStack,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function AuditLogModal({ isOpen, onClose, fileId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && fileId) {
      fetchLogs();
    }
  }, [isOpen, fileId]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>File Activity Log</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button onClick={onClose} mb={4} size="sm" colorScheme="red" variant="outline">
            Close
          </Button>
          {loading ? (
            <Text>Loading...</Text>
          ) : logs.length === 0 ? (
            <Text>No activity yet.</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {logs.map((log, index) => (
                <Box key={index} p={3} borderWidth="1px" borderRadius="md">
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}