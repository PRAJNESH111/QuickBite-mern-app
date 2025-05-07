import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [address, setAddress] = useState("");
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    let navLocation = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    };
    
    let latlong = await navLocation().then(res => {
      let latitude = res.coords.latitude;
      let longitude = res.coords.longitude;
      return [latitude, longitude];
    });

    let [lat, long] = latlong;
    console.log(lat, long);

    const response = await fetch("http://localhost:5000/api/getlocation", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latlong: { lat, long } })
    });

    const { location } = await response.json();
    console.log(location);
    setAddress(location);
    setCredentials({ ...credentials, geolocation: location });  // Corrected here
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use fetched geolocation or manual address as the location field
    const locationValue = credentials.geolocation || address;
    const response = await fetch("http://localhost:5000/api/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: locationValue
      })
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem('token', json.authToken);
      navigate("/login");
    } else {
      if (json.error) {
        alert(json.error);
      } else if (json.errors) {
        alert(json.errors.map(err => err.msg).join(", "));
      } else {
        alert("Enter Valid Credentials");
      }
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
      <div className='pb-3'>
        <Navbar />
      </div>

      <div className='container pt-4'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} />
          </div>
          <div className="m-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" name="address" placeholder="Click below for fetching address" value={address} onChange={(e) => {
              setAddress(e.target.value);
              // Keep credentials.geolocation in sync so Mongoose has a location value
              setCredentials({ ...credentials, geolocation: e.target.value });
            }} />
          </div>
          <div className="m-3">
            <button type="button" onClick={handleClick} className="btn btn-success">Click for current Location</button>
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
        </form>
      </div>
    </div>
  )
}
