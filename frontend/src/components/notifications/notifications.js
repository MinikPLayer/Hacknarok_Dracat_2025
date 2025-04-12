import React, { useEffect, useState } from "react";
import { Box, Chip, List, ListItem, ListItemIcon, ListItemText, Pagination, TextField, Button, Badge } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      title: "New Message",
      description: "You have a new message from John",
      reminderDate: new Date(),
      read: false,
    },
    {
      title: "Meeting Reminder",
      description: "Don't forget about the team meeting tomorrow.",
      reminderDate: new Date(),
      read: false,
    },
    {
      title: "System Update",
      description: "A new update is available for your system.",
      reminderDate: new Date(),
      read: true,
    },
    // Add more example notifications as needed
  ]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5); // Set the number of notifications per page

  const handleReadStatus = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = !updatedNotifications[index].read;
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(search.toLowerCase()) ||
    notification.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNotifications.length / perPage);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Powiadomienia</h2>

      {/* Search bar */}
      <TextField
        label="Wyszukaj..."
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Notifications list */}
      <List>
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification, index) => (
            <ListItem key={index} button className={notification.read ? "bg-light" : ""}>
              <ListItemIcon>
                <Badge color={"secondary"} variant="dot" invisible={false}>
                  <MailIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.description || "Brak opisu"}
              />
              <Chip label={notification.reminderDate.toLocaleString()} color="secondary" />
            </ListItem>
          ))
        ) : (
          <ListItem>Brak powiadomień</ListItem>
        )}
      </List>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </div>
  );
};

export default Notifications;
