import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Imported user icon
import { useCart } from './ContextReducer';
import Modal from '../Modal';
import Cart from '../screens/Cart';

export default function Navbar(props) {
    const [cartView, setCartView] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false); // For user icon hover
    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    const loadCart = () => {
        setCartView(true);
    };

    const items = useCart();

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success position-scrolled"
                style={{ boxShadow: "0px 10px 20px", filter: 'blur(20)', position: "fixed", zIndex: "10", width: "100%" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic text-white fw-bold" to="/">QuickBite</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link fs-5 active" aria-current="page" to="/">Home</Link>
                            </li>
                            {(localStorage.getItem("token")) &&
                                <li className="nav-item">
                                    <Link className="nav-link fs-5 active" aria-current="page" to="/myorder">My Orders</Link>
                                </li>}
                        </ul>
                        {(!localStorage.getItem("token")) ? (
                            <form className="d-flex">
                                <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
                                <Link className="btn bg-white text-success mx-1" to="/signup">Signup</Link>
                            </form>
                        ) : (
                            <div className="d-flex align-items-center">
                                <div className="btn bg-white text-success mx-2" onClick={loadCart}>
                                    <Badge color="secondary" badgeContent={items.length}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                    Cart
                                </div>
                                {cartView && <Modal onClose={() => setCartView(false)}><Cart /></Modal>}

                                {/* User Icon with Logout on Hover */}
                                <div
                                    className="mx-2"
                                    onClick={() => setShowUserMenu(prev => !prev)}
                                    style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                                >
                                    <AccountCircleIcon style={{ fontSize: '2rem', cursor: 'pointer', color: '#fff' }} />
                                    {showUserMenu && (
                                        <div onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute',
                                                top: '120%',
                                                right: 0,
                                                backgroundColor: '#fff',
                                                borderRadius: '6px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                zIndex: 20,
                                                padding: '5px 10px',
                                            }}
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="btn btn-sm btn-success"
                                                style={{ width: '100%' }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
