import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  AutoAwesome,
  Send,
  Person,
} from "@mui/icons-material";
import api from "../services/api";

const AICopilot = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi Ishaan! 👋 I'm your SmartCRM AI Copilot. Ask me about your customers, leads, activities, or sales pipeline.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: message,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.data.response,
        },
      ]);
    } catch (error) {
      console.error("AI Copilot error:", error);

      let errorMessage =
        "Sorry, I couldn't connect to the AI service right now.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1100px",
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <AutoAwesome sx={{ fontSize: 32 }} />

          <Typography variant="h4" fontWeight={700}>
            AI Copilot
          </Typography>

          <Chip
            label="Gemini"
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography color="text.secondary" mt={1}>
          Your intelligent assistant for SmartCRM.
        </Typography>
      </Box>

      {/* Chat container */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          height: "calc(100vh - 230px)",
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
            backgroundColor: "#fafafa",
          }}
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <Box
                key={index}
                display="flex"
                justifyContent={isUser ? "flex-end" : "flex-start"}
                mb={2}
              >
                <Box
                  display="flex"
                  flexDirection={isUser ? "row-reverse" : "row"}
                  alignItems="flex-start"
                  gap={1.2}
                  maxWidth={{ xs: "90%", md: "75%" }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                    }}
                  >
                    {isUser ? <Person /> : <AutoAwesome />}
                  </Avatar>

                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      backgroundColor: isUser ? "#1976d2" : "#ffffff",
                      color: isUser ? "#ffffff" : "inherit",
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            );
          })}

          {loading && (
            <Box display="flex" alignItems="center" gap={1.2} mb={2}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                }}
              >
                <AutoAwesome />
              </Avatar>

              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={18} />
                  <Typography color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
          }}
        >
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask your AI Copilot something..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              sx={{
                alignSelf: "flex-end",
                width: 52,
                height: 52,
              }}
            >
              <Send />
            </IconButton>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Press Enter to send
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AICopilot;