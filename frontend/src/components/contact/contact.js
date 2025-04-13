import React, {useState} from "react";
import "./contact.css"
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

const Contact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Tutaj możesz dodać logikę wysyłania wiadomości np. API call
        setSubmitted(true);
    };

    return (
        <section id="contact" className="mb-5" style={{maxWidth: 1000, margin: "auto"}}>

            <div className="contact-card">
                <div className="contact-image"/>
                <div className="contact-form-container">
                    {submitted ? (
                        <div className="thank-you-message" style={{color: "black", textAlign: "center"}}>
                            <h2>Dziękujemy za wiadomość!</h2>
                            <p>Odpowiemy tak szybko, jak to możliwe.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <h2>Masz pytania?</h2>
                            <h5 style={{color: "black", marginTop: -10, marginBottom: 20}}>Skontaktuj się z nami!</h5>
                            <div className="form-group">
                                <label>Imię:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Wiadomość:</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    style={{maxHeight: 400}}
                                ></textarea>
                            </div>
                            <div style={{margin: "auto", textAlign: "center"}}>
                                <button type="submit" className="btn btn-dark"
                                        style={{width: 200}}>
                                    Wyślij
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>


            <div style={{margin: 20}}>
                <div style={{marginBottom: 40}}>
                    <h2> Możesz też skorzystać z innych opcji kontaktu:</h2>
                </div>


                <div style={{
                    color: "black",
                    display: "grid",
                    backgroundColor: "white",
                    borderRadius: 50,
                    gridTemplateColumns: "80px auto",
                    margin: "20px auto",
                    maxWidth: 350,
                    padding: 5
                }}>
                    <div style={{
                        backgroundColor: "rgba(255,0,128,0.56)",
                        borderRadius: 120,
                        padding: 26,
                        display: "flex",
                        justifyContent: "center",  // Center the icon horizontally
                        alignItems: "center"       // Center the icon vertically
                    }}>
                        <PhoneRoundedIcon style={{transform: "scale(2)"}}/>
                    </div>

                    <h3 style={{
                        display: "flex",
                        alignItems: "center",  // Vertically center the phone number
                        margin: 20  // Remove default margin
                    }}>
                        +48 123 456 789
                    </h3>
                </div>

                <div style={{
                    color: "black",
                    display: "grid",
                    backgroundColor: "white",
                    borderRadius: 50,
                    gridTemplateColumns: "80px auto",
                    margin: " 20px auto",
                    maxWidth: 440,
                    padding: 5
                }}>
                    <div style={{
                        backgroundColor: "rgba(113,255,217,0.77)",
                        borderRadius: 120,
                        padding: 26,
                        display: "flex",
                        justifyContent: "center",  // Center the icon horizontally
                        alignItems: "center"       // Center the icon vertically
                    }}>
                        <MailOutlineRoundedIcon style={{transform: "scale(2)"}}/>
                    </div>

                    <h3 style={{
                        display: "flex",
                        alignItems: "center",  // Vertically center the phone number
                        margin: 20  // Remove default margin
                    }}>
                        kontakt@example.com
                    </h3>
                </div>

                <div style={{
                    color: "black",
                    display: "grid",
                    backgroundColor: "white",
                    borderRadius: 50,
                    gridTemplateColumns: "80px auto",
                    margin: " 20px auto",
                    maxWidth: 640,
                    padding: 5
                }}>
                    <div style={{
                        backgroundColor: "rgba(0,4,255,0.56)",
                        borderRadius: 120,
                        padding: 26,
                        display: "flex",
                        justifyContent: "center",  // Center the icon horizontally
                        alignItems: "center"       // Center the icon vertically
                    }}>
                        <BusinessRoundedIcon style={{transform: "scale(2)"}}/>
                    </div>

                    <h3 style={{
                        display: "flex",
                        alignItems: "center",  // Vertically center the phone number
                        margin: 20  // Remove default margin
                    }}>
                        Juliana Tokarskiego 1, 30-065 Kraków
                    </h3>
                </div>
            </div>

        </section>
    );
};

export default Contact;
