
import axios from 'axios'

const URL= "http://localhost:3000/users"

export const UpdatedWish = async (userId,Wishlist)=>
    {
      try{
        const res=await axios.patch(`${URL}/${userId}`,{
            Wishlist,
        })
        return res.data;

      }
      catch(error){
        console.error("Error in updating",error)
        throw error;
      }
    }

    export const getWish = async (userId) =>{
        try{
            const res=await axios.get(`${URL}/${userId}`)
            return res.data.Wishlist
        }
        catch(error){
        console.error("Error in updating",error)
        throw error;
      }
    }


