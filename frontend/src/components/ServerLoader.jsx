import { Box, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const ServerLoader = () => {
  const [dots, setDots] = useState("")

  // Animate dots (...)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Optional: simulate 5 seconds wait
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Server should be ready now")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bg="gray.50"
    >
      <Text fontSize="lg" fontWeight="medium" color="gray.600">
        Server starting, please wait{dots}
      </Text>
    </Box>
  )
}

export default ServerLoader
