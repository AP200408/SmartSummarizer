// frontend/src/App.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grow,
} from "@mui/material";
import { styled } from "@mui/system";
import "./App.css";

const CustomButton = styled(Button)({
  backgroundColor: "#007BFF",
  color: "white",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
});

const App = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setShowSummary(false);
    try {
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
        setPoints(data.points);
        setShowSummary(true);
      } else {
        console.error(data.error);
        setSummary("");
        setPoints([]);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("");
      setPoints([]);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" className="App">
      <Typography variant="h3" component="h1" gutterBottom>
        Text Summarization
      </Typography>
      <TextField
        label="Enter text to summarize..."
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="normal"
      />
      <CustomButton
        variant="contained"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </CustomButton>
      {loading && (
        <Box className="loading-spinner" mt={3}>
          <div className="spinner"></div>
        </Box>
      )}
      {showSummary && (
        <Grow in={showSummary}>
          <Paper elevation={3} style={{ marginTop: 20, padding: 20 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Summary:
            </Typography>
            <Card variant="outlined" className="summary-card">
              <CardContent>
                <Typography variant="body1" component="p">
                  {summary}
                </Typography>
              </CardContent>
            </Card>
            {points.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  style={{ marginTop: 20 }}
                >
                  Points:
                </Typography>
                <List>
                  {points.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        </Grow>
      )}
    </Container>
  );
};

export default App;
