import { Box, Text } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"

const fade = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`

const ServerLoader = () => {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      {/* Dot Loader */}
      <Box display="flex" gap={4}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            w="14px"
            h="14px"
            borderRadius="full"
            bg="gray.500"
            animation={`${fade} 1.5s infinite`}
            animationDelay={`${i * 0.2}s`}
          />
        ))}
      </Box>

      {/* Text */}
      <Text
        mt={6}
        fontSize="sm"
        color="gray.500"
        letterSpacing="wide"
      >
        Server starting, please wait
      </Text>
    </Box>
  )
}

export default ServerLoader
