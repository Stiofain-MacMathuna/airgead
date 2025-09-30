import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await axios.post("/api/auth/register", { username, password });
        alert("Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        const res = await axios.post("/api/auth/login", { username, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isRegister ? "Registration failed" : "Invalid username or password")
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4 shadow">
        <Card.Body>
          <h3 className="text-center mb-4">{isRegister ? "Register" : "Login"}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" type="submit">
                {isRegister ? "Register" : "Login"}
              </Button>
            </div>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="text-center">
            <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? "Already have an account? Login"
                : "No account? Register"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;