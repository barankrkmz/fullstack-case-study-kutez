import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'; // Yarım yıldız için FaStarHalfAlt ekleniyor
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; // Slider bileşenini ekliyoruz
import { useRef } from "react";



const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setSelectedColors(data.map(product => Object.keys(product.images)[0])); // Default color for each product
      })
      .catch(error => console.error('Ürünleri çekerken hata oluştu:', error));
  }, []);

  const handleColorChange = (index, color) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = color;
    setSelectedColors(updatedColors);
  };

  const settings = {
    dots: true, // Alt kısımda nokta navigasyonlarını gösterir
    infinite: false, // Ürünler arasında sonsuz döngü
    speed: 500,
    slidesToShow: 4, // Aynı anda gösterilecek ürün sayısı
    slidesToScroll: 1, // Her seferinde kaydırılacak ürün sayısı
  };

  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(score)) {
        // Tam dolu yıldız
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i - score < 1) {
        // Yarım dolu yıldız
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        // Boş yıldız
        stars.push(<FaStar key={i} color="#e4e5e9" />);
      }
    }
    return stars;
  };


  return (
    <div className="product-list">
      <h2 className="product-list-title">Product List</h2>
      <Slider ref={sliderRef} {...settings}>
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img
              src={product.images[selectedColors[index]]}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <p className="price">${product.price} USD</p>
              <div className="color-options">
                {Object.keys(product.images).map((color, colorIndex) => (
                  <button
                    key={colorIndex}
                    className={`color-button ${color} ${
                      selectedColors[index] === color ? 'selected' : ''
                    }`}
                    onClick={() => handleColorChange(index, color)}
                  />
                ))}
              </div>
              
              <div className="selected-color-label">
                {selectedColors[index].charAt(0).toUpperCase() + selectedColors[index].slice(1)}
              </div>
              <p className="space"> </p>
              <div className="score-star-container">
                <div className="star-rating">{renderStars(product.popularityScore / 20)}</div>
                <div className="score">{(product.popularityScore / 20).toFixed(1)} / 5</div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};


export default ProductList;
