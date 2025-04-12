import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  TextField,
  Badge,
  IconButton,
  Typography,
  styled
} from "@mui/material";
import { Delete, Mail, CircleNotifications } from "@mui/icons-material";

const ModernListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: "12px",
  margin: "8px 0",
  transition: "all 0.3s ease",
  boxShadow: selected ? theme.shadows[3] : theme.shadows[1],
  "&:hover": {
    transform: "translateX(4px)",
    boxShadow: theme.shadows[4]
  },
}));

const DetailPanel = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: "16px",
  padding: "24px",
  boxShadow: theme.shadows[2],
  height: "calc(100vh - 260px)",
  position: "sticky",
  top: "20px"
}));

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
const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Typography variant="h4" sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        color: "text.primary"
      }}>
        <CircleNotifications fontSize="large" />
        Powiadomienia
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Wyszukaj powiadomienia..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          }
        }}
      />

      <Box display="flex" gap={4} sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Lista powiadomień */}
        <Box sx={{ flex: 1, minWidth: { lg: 400 } }}>
          <List>
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => (
                <ModernListItem
                  key={notification.id}
                  selected={selectedNotification?.id === notification.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(notification.id)}
                      sx={{ color: "error.main" }}
                    >
                      <Delete />
                    </IconButton>
                  }
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                    setSelectedNotification(notification);
                  }}
                  sx={{
                    bgcolor: notification.read ? 'action.hover' : 'background.paper',
                    borderLeft: selectedNotification?.id === notification.id ?
                      "4px solid black": "none"
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={notification.read}
                    >
                      <Mail sx={{ color: "black" }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {notification.description}
                      </Typography>
                    }
                  />
                  <Chip
                    label={new Date(notification.reminderDate).toLocaleDateString()}
                    size="small"
                    sx={{
                      ml: 2,
                      borderRadius: "8px",
                      bgcolor: "black",
                      color: "primary.contrastText"
                    }}
                  />
                </ModernListItem>
              ))
            ) : (
              <Typography variant="body1" sx={{ p: 2, textAlign: "center" }}>
                Brak nowych powiadomień
              </Typography>
            )}
          </List>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              color="black"
            />
          </Box>
        </Box>

        {/* Panel szczegółów */}
        <DetailPanel sx={{ flex: 1 }}>
          {selectedNotification ? (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="600">
                  {selectedNotification.title}
                </Typography>
                <Chip
                  label={new Date(selectedNotification.reminderDate).toLocaleDateString()}
                  color="black"
                />
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {selectedNotification.description}
              </Typography>
              <IconButton
                onClick={() => handleDelete(selectedNotification.id)}
                sx={{ mt: 2, color: "error.main" }}
              >
                <Delete />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Usuń powiadomienie
                </Typography>
              </IconButton>
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              textAlign="center"
            >
              <Typography variant="h6" color="text.secondary">
                Wybierz powiadomienie, aby zobaczyć szczegóły
              </Typography>
            </Box>
          )}
        </DetailPanel>
      </Box>
    </Box>
  );
};

export default Notifications;