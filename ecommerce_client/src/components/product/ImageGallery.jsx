import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images = [], productName = '' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Default image if no images provided
  const displayImages = images.length > 0 
    ? images 
    : [{ image_url: 'https://via.placeholder.com/600x600?text=No+Image', alt_text: productName }];

  return (
    <div className="image-gallery">
      {/* Main Image Display */}
      <div 
        className="main-image-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={displayImages[selectedImage]?.image_url}
          alt={displayImages[selectedImage]?.alt_text || productName}
          className={`main-image ${isZoomed ? 'zoomed' : ''}`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: 'scale(2.5)',
                }
              : {}
          }
        />
        {!isZoomed && (
          <div className="zoom-hint">
            <i className="fas fa-search-plus"></i>
            <span>Hover to zoom</span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="thumbnail-container">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
              onMouseEnter={() => setSelectedImage(index)}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} - Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
