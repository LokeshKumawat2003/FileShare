import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function FileViewer({ file, onClose }) {
  const [content, setContent] = useState(null);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const loadFile = async () => {
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        const res = await api.get(`/files/view/${file._id}`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        setContent(url);
      } else if (file.mimetype === 'text/csv') {
        const res = await api.get(`/files/view/${file._id}`, { responseType: 'text' });
        const csvText = res.data;
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const headers = lines[0].split(',');
          const rows = lines.slice(1).map(line => line.split(','));
          setCsvData({ headers, rows });
        }
      }
    };
    if (file) loadFile();
  }, [file]);

  useEffect(() => {
    return () => {
      if (content && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) {
        URL.revokeObjectURL(content);
      }
    };
  }, [content, file]);

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>{file.originalName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {file.mimetype.startsWith('image/') && (
            <Box textAlign="center">
              <img src={content} alt={file.originalName} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
            </Box>
          )}
          {file.mimetype === 'application/pdf' && (
            <Box height="70vh">
              <iframe src={content} width="100%" height="100%" title={file.originalName} />
            </Box>
          )}
          {file.mimetype === 'text/csv' && csvData.headers && (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {csvData.headers.map((header, i) => (
                      <Th key={i}>{header}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {csvData.rows.map((row, i) => (
                    <Tr key={i}>
                      {row.map((cell, j) => (
                        <Td key={j}>{cell}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
          {!content && !csvData.headers && <Text>Loading...</Text>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}