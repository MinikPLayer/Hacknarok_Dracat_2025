import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCamera, FaStar, FaArrowLeft, FaSave } from 'react-icons/fa';
import './newPlace.css';

const AddPlace = () => {
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    name: '',
    location: '',
    description: '',
    rating: 0,
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + place.images.length > 5) {
      alert('Możesz dodać maksymalnie 5 zdjęć');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages([...previewImages, ...newImages]);
    setPlace(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
    
    const newFiles = [...place.images];
    newFiles.splice(index, 1);
    setPlace(prev => ({ ...prev, images: newFiles }));
  };

  const handleRatingChange = (rating) => {
    setPlace(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Tutaj dodaj logikę wysyłania danych na serwer
    console.log('Dodawane miejsce:', place);
    
    // Symulacja wysyłania
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Miejsce zostało dodane pomyślnie!');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="add-place-container">
      <div className="add-place-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Powrót
        </button>
        <h1>Dodaj nowe miejsce</h1>
      </div>

      <form onSubmit={handleSubmit} className="place-form">
        <div className="form-group">
          <label htmlFor="name">Nazwa miejsca*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={place.name}
            onChange={handleInputChange}
            required
            placeholder="Wpisz nazwę miejsca"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Lokalizacja*</label>
          <div className="location-input">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              id="location"
              name="location"
              value={place.location}
              onChange={handleInputChange}
              required
              placeholder="Podaj lokalizację (adres lub współrzędne)"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            name="description"
            value={place.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Dodaj opis miejsca (co warto zobaczyć, atmosfera itp.)"
          />
        </div>

        <div className="form-group">
          <label>Ocena</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`rating-star ${star <= place.rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Zdjęcia (max 5)</label>
          <div className="image-upload-container">
            <label htmlFor="image-upload" className="upload-button">
              <FaCamera /> Dodaj zdjęcia
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            <span className="image-count">{previewImages.length}/5 zdjęć</span>
          </div>

          {previewImages.length > 0 && (
            <div className="image-previews">
              {previewImages.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image.preview} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : (
            <>
              <FaSave /> Zapisz miejsce
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPlace;