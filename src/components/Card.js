import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatchCart, useCart } from './ContextReducer'

// import { Dropdown, DropdownButton } from 'react-bootstrap';
export default function Card(props) {
  let data = useCart();

  let navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState("")
  const priceRef = useRef();
  // const [btnEnable, setBtnEnable] = useState(false);
  // let totval = 0
  // let price = Object.values(options).map((value) => {
  //   return parseInt(value, 10);
  // });
  let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props.item;
  const dispatch = useDispatchCart();
  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login")
    }
  }
  const handleQty = (e) => {
    setQty(e.target.value);
  }
  const handleOptions = (e) => {
    setSize(e.target.value);
  }
  const handleAddToCart = async () => {
    let food = []
    for (const item of data) {
      if (item.id === foodItem._id) {
        food = item;

        break;
      }
    }
    console.log(food)
    console.log(new Date())
    if (food !== 0) {
      if (food.size === size) {
        await dispatch({ type: "UPDATE", id: foodItem._id, price: finalPrice, qty: qty })
        return
      }
      else if (food.size !== size) {
        await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size,img: props.ImgSrc })
        console.log("Size different so simply ADD one more to the list")
        return
      }
      return
    }

    await dispatch({ type: "ADD", id: foodItem._id, name: foodItem.name, price: finalPrice, qty: qty, size: size })


    // setBtnEnable(true)

  }

  useEffect(() => {
    setSize(priceRef.current.value)
  }, [])

  // useEffect(()=>{
  // checkBtn();
  //   },[data])

  let finalPrice = qty * parseInt(options[size]);   //This is where Price is changing
  // totval += finalPrice;
  // console.log(totval)
  return (
    <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
      <img src={props.ImgSrc} className="card-img-top img-fluid" alt={props.foodName} style={{ height: "180px", objectFit: "cover" }} />
      <div className="card-body">
        <h5 className="card-title">{props.foodName}</h5>
        
        <div className="d-flex align-items-center mb-3">
          <select className="form-select form-select-sm w-auto me-2" onClick={handleClick} onChange={handleQty} value={qty}>
            {Array.from(Array(6), (e, i) => {
              return (
                <option key={i + 1} value={i + 1}>{i + 1}</option>)
            })}
          </select>
          <select className="form-select form-select-sm w-auto me-2" ref={priceRef} onClick={handleClick} onChange={handleOptions} value={size}>
            {priceOptions.map((i) => {
              return <option key={i} value={i}>{i}</option>
            })}
          </select>
          <div className="ms-auto fs-5 fw-bold">
            ₹{finalPrice}/-
          </div>
        </div>
        <hr></hr>
        <button className="btn btn-success w-100 mt-auto" onClick={handleAddToCart}>Add to Cart</button>
      
      </div>
    </div>
  )
}
