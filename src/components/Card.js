import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatchCart, useCart } from "./ContextReducer";

export default function Card(props) {
  let data = useCart();
  let navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const priceRef = useRef();
  const [imgLoaded, setImgLoaded] = useState(false); // 👈 shimmer state

  let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props.item;
  const dispatch = useDispatchCart();

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleQty = (e) => setQty(e.target.value);
  const handleOptions = (e) => setSize(e.target.value);

  const handleAddToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === foodItem._id) {
        food = item;
        break;
      }
    }

    if (food !== 0) {
      if (food.size === size) {
        await dispatch({
          type: "UPDATE",
          id: foodItem._id,
          price: finalPrice,
          qty: qty,
        });
        return;
      } else if (food.size !== size) {
        await dispatch({
          type: "ADD",
          id: foodItem._id,
          name: foodItem.name,
          price: finalPrice,
          qty: qty,
          size: size,
          img: props.ImgSrc,
        });
        return;
      }
    }

    await dispatch({
      type: "ADD",
      id: foodItem._id,
      name: foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
      img: props.ImgSrc,
    });
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  let finalPrice = qty * parseInt(options[size]);

  return (
    <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
      {/* Shimmer placeholder */}
      {!imgLoaded && (
        <div
          className="card-img-top img-fluid shimmer"
          style={{ height: "180px", backgroundColor: "#e0e0e0" }}
        ></div>
      )}

      {/* Actual image */}
      <img
        src={props.ImgSrc}
        className={`card-img-top img-fluid ${imgLoaded ? "" : "d-none"}`}
        alt={props.foodName}
        style={{ height: "180px", objectFit: "cover" }}
        onLoad={() => setImgLoaded(true)}
      />

      <div className="card-body">
        <h5 className="card-title">{props.foodName}</h5>

        <div className="d-flex align-items-center mb-3">
          <select
            className="form-select form-select-sm w-auto me-2"
            onClick={handleClick}
            onChange={handleQty}
            value={qty}
          >
            {Array.from(Array(6), (e, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm w-auto me-2"
            ref={priceRef}
            onClick={handleClick}
            onChange={handleOptions}
            value={size}
          >
            {priceOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <div className="ms-auto fs-5 fw-bold">₹{finalPrice}/-</div>
        </div>
        <hr />
        <button
          className="btn btn-success w-100 mt-auto"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
