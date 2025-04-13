import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Container, IconButton, Badge, Avatar, Menu, MenuItem, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { AuthContext } from "../../AuthContext";
import { LogoutRounded } from "@mui/icons-material";
import client from "../../client";
import { API_BASE_URL } from "../../config";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import Link from '@mui/material/Link';

const CustomNavbar = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const token = localStorage.getItem("access");
    const image_set = localStorage.getItem("image_set");
    let flag = false;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const [num, setNum] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await client.get(API_BASE_URL + "user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.profile_picture) {
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
             try {
                const response = await client.get(API_BASE_URL + "notifications/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNum(response.data.num);
                console.log("Zalogowano");
                console.log(response.data);
            } catch (error) {
                console.log("Nie udało się zalogować");
            }
        };

        if (!flag) {
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
        <AppBar position="static" sx={{ backgroundColor: "#111111", boxShadow: 1 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <Box
                            component="img"
                            sx={{ height: 50, width: 50, mr: 1 }}
                            alt="Logo"
                            src="logo.png"
                        />
                    </Link>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {isAuthenticated && (
                            <IconButton href="/main" sx={{ color: 'white', mx: 1 }}>
                                <HomeRoundedIcon />
                            </IconButton>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <Link href="/about" sx={{ color: 'white', mx: 1, textDecoration: 'none' }}>
                                    <Typography variant="body1">O nas</Typography>
                                </Link>
                                <Link href="/contact" sx={{ color: 'white', mx: 1, textDecoration: 'none' }}>
                                    <Typography variant="body1">Kontakt</Typography>
                                </Link>
                            </>
                        ) : (
                            <IconButton href="/notifications" sx={{ color: 'white', mx: 1 }}>
                                <Badge badgeContent={num} color="primary">
                                    <CircleNotificationsRoundedIcon />
                                </Badge>
                            </IconButton>
                        )}

                        {isAuthenticated && (
                            <IconButton href="/userProfile" sx={{ color: 'white', mx: 1 }}>
                                <Avatar src={image} />
                            </IconButton>
                        )}

                        <IconButton href={isAuthenticated ? '/logout' : '/login'} sx={{ color: 'white', mx: 1 }}>
                            {isSmallScreen ? (
                                isAuthenticated ? <LogoutRounded /> : <LoginRoundedIcon />
                            ) : (
                                isAuthenticated ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ mr: 1 }}>Wyloguj</Typography>
                                        <LogoutRounded />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LoginRoundedIcon />
                                        <Typography variant="body1" sx={{ ml: 1 }}>Zaloguj</Typography>
                                    </Box>
                                )
                            )}
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default CustomNavbar;