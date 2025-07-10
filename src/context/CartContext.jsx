import { createContext, useReducer,useContext,useEffect } from "react";
import {useAuth} from './AuthContext'
import axios from "axios";

const CartContext = createContext();

const initialstate={
   cart: JSON.parse(localStorage.getItem("cart")) || []
   
}

const reducer = (state,action) => {
         
    switch(action.type){
        case "AddToCart":
            const exist = state.cart.find((item)=>item.id === action.payload.id)
            if(exist){
               return {...state,
                cart:state.cart.map((item)=>
                    item.id === action.payload.id ?{...item,quantity:item.quantity+1}:item
                ),
               };
                
            }
            return{...state,
                cart:[...state.cart,{...action.payload,quantity:1}],
               
            };
           
        case "RemoveFromCart":
            return {...state,
                cart:state.cart.filter((item)=>item.id !== action.payload),
            };
        case "ClearCart":
            return {...state,
                cart:[]
            }
        case "IncQuantity":
                return {...state,cart:state.cart.map(item =>
                     item.id === action.payload ? { ...item, quantity: item.quantity + 1 }: item)}   
       case "DecQntity":
            return {...state,cart:state.cart.map((item)=>item.id === action.payload && item.quantity > 1 ?
         {...item , quantity:item.quantity-1}:item)}
        default :
        return state;

    }
}

    export const CartProvider = ({children}) => {

        const {user,setUser}=useAuth()


        const [state,dispatch]=useReducer(reducer,initialstate)

        
        useEffect(()=>{

            localStorage.setItem("cart",JSON.stringify(state.cart))

            const Sync = async ()=>{
                 if (user && user.id){
                    try{
                    await axios.patch(`http://localhost:3000/users/${user.id}`,{
                     cart:state.cart})
                    const updatedUser={...user,cart:state.cart}
                    localStorage.setItem("user",JSON.stringify(updatedUser))
                    setUser(updatedUser)
                        }
                    catch (err){
                        console.error("Error in updating",err)
                    }
               
            }
            }
            Sync();
           


        },[state.cart,user])
        return (
            <>
            <CartContext.Provider value={{cart:state.cart,dispatch}}>
                {children}
            </CartContext.Provider>
            </>
        );

    }
    export const useCart=()=>useContext(CartContext);
