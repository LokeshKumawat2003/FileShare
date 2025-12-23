import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ShareView from "./pages/ShareView";
import PublicView from "./pages/PublicView";
import AuditLogPage from "./pages/AuditLogPage";
import { Box, Spinner, Text } from "@chakra-ui/react";
import ServerLoader from "./components/ServerLoader";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

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
          Loading...
        </Text>
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
     <ServerLoader/>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/share/:token"
        element={<ShareView />}
      />
      <Route
        path="/user/:id"
        element={
          <PrivateRoute>
            <PublicView />
          </PrivateRoute>
        }
      />
      <Route
        path="/audit/:fileId"
        element={
          <PrivateRoute>
            <AuditLogPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
