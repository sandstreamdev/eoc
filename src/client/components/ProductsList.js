import React from 'react';

function ProductsList() {
  return (
    <div className="products">
      <h2 className="products__heading">Lista produktów</h2>

      <ul className="products-list">
        <li className="products-list__item">
          <input
            className="product-list__input"
            id="option1"
            name="option1"
            type="checkbox"
          />
          <label
            className="products-list__label"
            id="option1"
            htmlFor="option1"
          >
            <img
              src="https://via.placeholder.com/50"
              alt="Product icon"
              className="products-list__icon"
            />
            Papier toaletowy rumiankowy
          </label>
        </li>

        <li className="products-list__item">
          <input
            className="product-list__input"
            id="option2"
            name="option2"
            type="checkbox"
          />
          <label
            className="products-list__label"
            id="option2"
            htmlFor="option2"
          >
            <img
              src="https://via.placeholder.com/50"
              alt="Product icon"
              className="products-list__icon"
            />
            Kawa Tchibo
          </label>
        </li>

        <li className="products-list__item">
          <input
            className="product-list__input"
            id="option3"
            name="option3"
            type="checkbox"
          />
          <label
            className="products-list__label"
            id="option3"
            htmlFor="option3"
          >
            <img
              src="https://via.placeholder.com/50"
              alt="Product icon"
              className="products-list__icon"
            />
            Kawa mielona
          </label>
        </li>

        <li className="products-list__item">
          <input
            className="product-list__input"
            id="option4"
            name="option4"
            type="checkbox"
          />
          <label
            className="products-list__label"
            id="option4"
            htmlFor="option4"
          >
            <img
              src="https://via.placeholder.com/50"
              alt="Product icon"
              className="products-list__icon"
            />
            Ogórek zielony
          </label>
        </li>
      </ul>
    </div>
  );
}

export default ProductsList;
