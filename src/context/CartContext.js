import React, { useReducer, useContext, createContext } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img || "",
        },
      ];
    case "REMOVE":
      return state.filter((_, index) => index !== action.index);
    case "UPDATE":
      return state.map((food) => {
        if (food.id === action.id && food.size === action.size) {
          return {
            ...food,
            qty: parseInt(action.qty) + food.qty,
            price: action.price + food.price,
          };
        }
        return food;
      });
    case "INCREMENT":
      return state.map((food, index) => {
        if (index === action.index) {
          const unitPrice = food.price / food.qty;
          return { ...food, qty: food.qty + 1, price: food.price + unitPrice };
        }
        return food;
      });
    case "DECREMENT":
      return state
        .map((food, index) => {
          if (index === action.index) {
            if (food.qty <= 1) return null;
            const unitPrice = food.price / food.qty;
            return { ...food, qty: food.qty - 1, price: food.price - unitPrice };
          }
          return food;
        })
        .filter(Boolean);
    case "DROP":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
