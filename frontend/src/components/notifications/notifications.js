import React, { useEffect, useState } from "react";
import { Box, Chip, List, ListItem, ListItemIcon, ListItemText, Pagination, TextField, Badge } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Message",
      description: "You have a new message from John",
      reminderDate: new Date(),
      read: false,
    },
    {
      id: 2,
      title: "Meeting Reminder",
      description: "Don't forget about the team meeting tomorrow.",
      reminderDate: new Date(),
      read: false,
    },
    {
      id: 3,
      title: "System Update",
      description: "A new update is available for your system.",
      reminderDate: new Date(),
      read: true,
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(search.toLowerCase()) ||
    notification.description.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNotifications.length / perPage);

return (
    <div className="container mt-5">
      <h2 className="mb-4">Powiadomienia</h2>

      <TextField
        label="Wyszukaj..."
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Box display="flex" gap={4} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Lista powiadomień */}
        <Box sx={{ flex: { xs: 1, md: 1 }, width: '100%' }}>
          <List>
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                    setSelectedNotification(notification);
                  }}
                  sx={{
                    backgroundColor: theme =>
                      selectedNotification?.id === notification.id
                        ? '#e3f2fd'
                        : notification.read
                        ? theme.palette.action.selected
                        : 'inherit',
                    border: theme =>
                      `2px solid ${
                        selectedNotification?.id === notification.id 
                        ? theme.palette.primary.main 
                        : 'transparent'
                      }`,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Badge
                      color="secondary"
                      variant="dot"
                      invisible={notification.read}
                    >
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

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        </Box>

        {/* Panel szczegółów - zawsze widoczny */}
        <Box
          sx={{
            flex: { xs: 1, md: 1 },
            p: 3,
            borderLeft: { md: '1px solid #e0e0e0' },
            borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
            minHeight: { xs: '300px', md: 'auto' },
            width: '100%',
            backgroundColor: '#f8f9fa'
          }}
        >
          {selectedNotification ? (
            <>
              <h3 style={{ marginBottom: '1rem' }}>{selectedNotification.title}</h3>
              <p style={{ marginBottom: '1.5rem' }}>{selectedNotification.description}</p>
              <Chip
                label={selectedNotification.reminderDate.toLocaleString()}
                color="primary"
                variant="outlined"
              />
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              color="text.secondary"
            >
              Wybierz powiadomienie, aby zobaczyć szczegóły
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Notifications;