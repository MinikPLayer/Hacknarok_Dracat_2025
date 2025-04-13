import React, {useState, useEffect} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Rating,
    TextField,
    Typography,
    useTheme,
    styled
} from '@mui/material';
import {Upload as UploadIcon, CheckCircle, Star} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';

const GradientCard = styled(Card)(({theme}) => ({
    borderRadius: '24px',
    boxShadow: theme.shadows[10],
    maxWidth: '600px',
    margin: '2rem auto',
    position: 'relative',
    overflow: 'visible',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: '24px',
        zIndex: -1
    }
}));

const FeedbackForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Symulacja przesyłania danych i naliczania punktów
        const calculatedPoints = (rating || 0) * 50 + (comment.length > 10 ? 100 : 0);
        setPointsEarned(calculatedPoints);
        setIsSubmitted(true);
    };

    const handleNewRoute = () => {
        setIsSubmitted(false);
        setRating(0);
        setComment('');
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(to right, #556270, #ff6b6b);`,
                display: 'flex',
                alignItems: 'center',
                padding: 2
            }}
        >
            <GradientCard>
                <CardContent>
                    {!isSubmitted ? (
                        <Box py={4} px={5}>
                            <Typography variant="h4" gutterBottom sx={{fontWeight: 700}}>
                                Podziel się z nami opinią!
                            </Typography>
                            <Typography> Twoje zdanie się liczy - za każdą opinię dostaniesz punkty! </Typography>

                            <form onSubmit={handleSubmit}>
                                <Box mb={4} py={3}>
                                    <Typography variant="h6">Ocena punktu</Typography>
                                    <Rating
                                        name="rating"
                                        value={rating}
                                        onChange={(_, newValue) => setRating(newValue)}
                                        size="large"
                                        sx={{fontSize: '2.5rem'}}
                                    />
                                </Box>


                                <Box mb={4}>
                                    <TextField
                                        label="Twoja opinia"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        inputProps={{maxLength: 1000}}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        variant="filled"
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </Box>
                                <Box mb={4}>
                                    <Typography variant="h6">Wgraj nagranie</Typography>
                                    <input
                                        accept="audio/*"
                                        style={{display: 'none'}}
                                        id="upload-file"
                                        type="file"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="upload-file">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<UploadIcon/>}
                                            sx={{mt: 1}}
                                        >
                                            Wybierz plik
                                        </Button>
                                    </label>

                                    {selectedFile && (
                                        <Box mt={2}>
                                            <Typography variant="body2">
                                                Wybrany plik: {selectedFile.name}
                                            </Typography>
                                        </Box>
                                    )}

                                    {previewUrl && (
                                        <Box mt={2}>
                                            <audio controls src={previewUrl}>
                                                Twoja przeglądarka nie wspiera wgrywania wideo.
                                            </audio>
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{backgroundColor: "#22252c"}}
                                    size="large"
                                    fullWidth
                                    sx={{py: 1.5}}
                                >
                                    Prześlij
                                </Button>
                            </form>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={4} px={5}>
                            <img height={300} src={"media/cat_star.png"}/>

                            <Typography variant="h4" gutterBottom>
                                Dziękujemy!
                            </Typography>
                            <Typography variant="h6" sx={{mb: 4}}>
                                + {pointsEarned} <Star/>
                            </Typography>

                            <Box display="flex" gap={2} justifyContent="center">
                                <Button
                                    variant="outlined"
                                    style={{color: "#22252c", borderColor: "#22252c"}}
                                    size="large"
                                    onClick={() => navigate('/map')}
                                    sx={{}}
                                >
                                    Wróć do trasy
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{backgroundColor: "#22252c"}}
                                    size="large"
                                    onClick={() => navigate('/worlds')}
                                >
                                    Zakończ
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </GradientCard>
        </Box>
    );
};

export default FeedbackForm;