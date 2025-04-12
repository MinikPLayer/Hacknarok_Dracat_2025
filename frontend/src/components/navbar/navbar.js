import React, {useContext, useEffect, useState} from 'react';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import "./navbar.css"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {AuthContext} from "../../AuthContext";
import {LogoutRounded} from "@mui/icons-material";
import client from "../../client";
import {API_BASE_URL} from "../../config";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import {Avatar} from "@mui/material";
import Badge from '@mui/material/Badge';

const CustomNavbar = () => {
    const {isAuthenticated} = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const token = localStorage.getItem("access");
    const image_set = localStorage.getItem("image_set")
    let flag = false;
    const [isSmallScreen, setIsSmallScreen] = useState(false);


useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992); // You can adjust the threshold as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await client.get(API_BASE_URL + "user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.profile_picture){
                    setImage(response.data.profile_picture.toString().slice(15));
                    localStorage.setItem(response.data.profile_picture.toString().slice(15));
                }
                else {
                    setImage("/images/basic/user_no_picture.png");
                    localStorage.setItem("/images/basic/user_no_picture.png");
                }

            } catch (error) {
                console.log("Nie udało się zalogować");
            }
        };

        if (!flag){
            if (token && !image_set) {
                fetchUserData();
            }
            else {
                setImage(image_set)
            }
            flag = true;
        }


    }, [image, image_set, token]);

    return (
        <div>
            {/* Navbar */}
            <Navbar expand="lg" variant="dark" className="shadow-sm"  style={{ backgroundColor: "black"}}>
                <Container>
                    <Navbar.Brand className="text-primary fw-bold">
                        <Nav.Link href="/">
                            <img style={{display: "inline", marginRight: 10}} width={50} src={"/icons/kitty.ico"}/>
                        </Nav.Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls=" basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto" style={{alignItems: "center"}}>
                            {!isAuthenticated ?
                                null
                                :
                                <Nav.Link href="/main" className="text-white"><HomeRoundedIcon/></Nav.Link>
                            }


                            {/*<Nav.Link as={Link} to="/manage" className="text-white">Zarządzaj</Nav.Link>*/}

                            {!isAuthenticated ?
                                <>
                                    <Nav.Link href="/about" className="text-white">O nas</Nav.Link>
                                    <Nav.Link href="/contact" className="text-white">Kontakt</Nav.Link>
                                </>
                                :
                                <>
                                    <Nav.Link href="/actual-info" className="text-white">Aktualności</Nav.Link>
                                    <Nav.Link href="/pierogi" className="text-white">Rekrutacja</Nav.Link>
                                    <NavDropdown title="Planowanie">
                                        <NavDropdown.Item href="/calendar">Kalendarz</NavDropdown.Item>
                                        <NavDropdown.Item href="/localizations">
                                          Lokalizacje
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Społeczność">
                                        <NavDropdown.Item href="/groups">Grupy</NavDropdown.Item>
                                        <NavDropdown.Item href="/exchanges">
                                          Wymiany
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="/forum">
                                          Forum
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                    <Nav.Link href="/learning" className="text-white">Nauka</Nav.Link>
                                    <Nav.Link href="/notifications" className="text-white">
                                        <Badge badgeContent={4} color="primary">
                                          <CircleNotificationsRoundedIcon/>
                                        </Badge>
                                    </Nav.Link>
                                </>
                            }

                            {!isAuthenticated ?
                                null
                                :
                                <Nav.Link href="/userProfile" className="text-white">
                                    <Avatar src={image}/>
                                </Nav.Link>
                            }

                            {!isSmallScreen ? (
                                // For small screens, show login/logout icon
                                <Nav.Link href={isAuthenticated ? '/logout' : '/login'} className="text-white">
                                  {isAuthenticated ? <LogoutRounded /> : <LoginRoundedIcon />}
                                </Nav.Link>
                              ) : (
                                // For larger screens, show full text (Login / Logout)
                                <Nav.Link href={isAuthenticated ? '/logout' : '/login'} className="text-white">
                                    {isAuthenticated ? <div><span style={{marginRight: 10}}>Wyloguj</span><LogoutRounded /></div> :
                                        <div><LoginRoundedIcon /><span style={{marginLeft: 10}}> Zaloguj</span></div>}
                                </Nav.Link>
                              )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default CustomNavbar;