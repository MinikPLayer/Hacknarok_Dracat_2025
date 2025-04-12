import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { Container, Form, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {Box, Button, TextField} from "@mui/material";

const Register = () => {
    const { registerUser, errmess, setErrmess } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordSecond, setPasswordSecond] = useState("");

    async function submitRegistration(event) {
        event.preventDefault();
        await registerUser(username, email, password, passwordSecond);
    }

    // Clear error message when user types
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (errmess) setErrmess(null); // Clear error message on new input
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow" style={{ width: "350px" }}>
                <h3 className="text-center text-primary">Rejestracja</h3>

                {/* Display error message if registration fails */}
                {errmess && <Alert variant="danger" className="text-center">{errmess}</Alert>}

                <Form onSubmit={submitRegistration}>
                    <Box className="mb-3" controlId="username">
                        <TextField id="outlined-basic" type={"text"} onChange={handleInputChange(setUsername)} value={username} label="Nazwa użytkownika" variant="outlined" />
                    </Box>

                    <Box className="mb-3" controlId="email">
                        <TextField id="outlined-basic" type={"email"} onChange={handleInputChange(setEmail)} value={email} label="Email" variant="outlined" />
                    </Box>

                    <Box className="mb-3" controlId="password">
                        <TextField id="outlined-basic" type={"password"} onChange={handleInputChange(setPassword)} value={password} label="Hasło" variant="outlined" />
                    </Box>

                    <Box className="mb-3" controlId="password_second">
                        <TextField id="outlined-basic" type={"password"} onChange={handleInputChange(setPasswordSecond)} value={passwordSecond} label="Potwierdź hasło" variant="outlined" />
                    </Box>

                    <Button variant="contained" type="submit">Zarejestruj się</Button>
                </Form>

                <p className="text-center mt-3">
                    Masz już konto? <Link to="/login">Zaloguj się</Link>
                </p>
            </Card>
        </Container>
    );
};

export default Register;
