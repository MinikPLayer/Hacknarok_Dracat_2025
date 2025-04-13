// AddPlace.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCamera, FaStar, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; 
import './newPlace.css';


const AddPlace = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    name: '',
    location: '',
    description: '',
    rating: 0,
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + place.images.length > 5) {
      setError('Możesz dodać maksymalnie 5 zdjęć.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...newImages]);
    setPlace((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setError('');
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setPlace((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRatingChange = (rating) => {
    setPlace((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!place.name || !place.location) {
      setError('Nazwa i lokalizacja są wymagane.');
      return;
    }

    setIsSubmitting(true);
    // Symulacja wysyłania danych
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Miejsce zostało dodane pomyślnie!');
      navigate('/');
    }, 1000);
  };

  return (
    <motion.div
      className="add-place-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div className="add-place-header">
    <motion.button
        className="back-button"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <FaArrowLeft /> Powrót
    </motion.button>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginLeft: '20px' }}>
        <h1>Dodaj nowe miejsce</h1>
        <img 
        src={"/media/kotelIcon.png"} 
        alt="Cat icon" 
        style={{ width: '60px', height: '60px' }} 
        />
    </div>
    </div>

      <motion.form
        onSubmit={handleSubmit}
        className="place-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nazwa miejsca*</label>
          <motion.input
            type="text"
            id="name"
            name="name"
            value={place.name}
            onChange={handleInputChange}
            required
            placeholder="Wpisz nazwę miejsca"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Lokalizacja*</label>
          <div className="location-input">
            <FaMapMarkerAlt className="input-icon" />
            <motion.input
              type="text"
              id="location"
              name="location"
              value={place.location}
              onChange={handleInputChange}
              required
              placeholder="Podaj lokalizację"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis</label>
          <motion.textarea
            id="description"
            name="description"
            value={place.description}
            onChange={handleInputChange}
            rows="5"
            placeholder="Opisz, co sprawia, że to miejsce jest wyjątkowe..."
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="form-group">
          <label>Ocena</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStar
                  className={`rating-star ${star <= place.rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                  aria-label={`Ocena ${star} gwiazdek`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Zdjęcia (max 5)</label>
          <div className="image-upload-container">
            <motion.label
              htmlFor="image-upload"
              className="upload-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCamera /> Dodaj zdjęcia
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={previewImages.length >= 5}
                style={{ display: 'none' }}
              />
            </motion.label>
            <span className="image-count">{previewImages.length}/5 zdjęć</span>
          </div>

          <AnimatePresence>
            {previewImages.length > 0 && (
              <motion.div
                className="image-previews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {previewImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="image-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={image.preview} alt={`Podgląd zdjęcia ${index + 1}`} />
                    <motion.button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Usuń zdjęcie"
                    >
                      <FaTimes />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              Zapisywanie...
            </motion.span>
          ) : (
            <>
              <FaSave /> Zapisz miejsce
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddPlace;