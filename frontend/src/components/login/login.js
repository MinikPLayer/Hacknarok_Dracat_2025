import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { Container, Form, Card} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {Box, Button, TextField} from "@mui/material";
import Alert from "@mui/material/Alert";

const Login = () => {
    const { loginUser, errmess, setErrmess, errtype, setErrtype } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submitLogin(event) {
        event.preventDefault();
        await loginUser(email, password);
    }

    // Clear error message when user types
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (errmess) setErrmess(null); // Clear error message on new input
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow" style={{ width: "350px" }}>
                <h3 className="text-center text-primary">Login</h3>

                {/* Display error message if login fails */}
                {errmess && errtype === "credentials" && <Alert variant="danger" className="text-center">{errmess}</Alert>}

                <Form onSubmit={submitLogin}>
                    <Box className="mb-3" controlId="email">
                        <TextField error={!!(errmess && errtype === "email")} helperText={errmess && errtype == "email"? errmess: null} id="outlined-basic" type={"email"} onChange={handleInputChange(setEmail)} value={email} label="Email" variant="outlined" />
                    </Box>
                    <Box className="mb-3" controlId="email">
                        <TextField error={!!(errmess && errtype === "password")} helperText={errmess && errtype == "password"? errmess: null} id="outlined-basic" type={"password"} onChange={handleInputChange(setPassword)} value={password} label="Hasło" variant="outlined" />
                    </Box>
                    <Button type="submit" variant="contained">
                        Zaloguj się
                    </Button>
                </Form>

                <p className="text-center mt-3">
                    Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                </p>
            </Card>
        </Container>
    );
};

export default Login;
