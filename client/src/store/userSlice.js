import {createSlice} from "@reduxjs/toolkit";
const initialValue = {
    _id : "",
    name : "",
    email : "",
    avatar  :"",
    mobile : "",
    verify_email : "",
    last_login_date  :" ",
    status : "",
    address_details : "",
    shopping_cart : "",
    orderHistory : "",
    role : "",
    createdAt : "",
}

const userSlice = createSlice({
    name : "user",
    initialState : initialValue,
    reducers : {
        setUserDetails : (state,actions)=>{
            state._id= actions.payload?._id
            state.name = actions.payload?.name
            state.email = actions.payload?.email
            state.avatar = actions.payload?.avatar
            state.mobile = actions.payload?.mobile
            state.verify_email = actions.payload?.verify_email
            state.last_login_date = actions.payload?.last_login_date
            state.status = actions.payload?.status
            state.address_details = actions.payload?.address_details
            state.shopping_cart = actions.payload?.shopping_cart
            state.orderHistory = actions.payload?.orderHistory
            state.role = actions.payload?.role
            state.createdAt = actions.payload?.createdAt

        },

        updateAvatar : (state,action)=>{
                state.avatar = action.payload
        },
        logout : (state)=>{
            state._id= ""
            state.name = ""
            state.email = ""
            state.avatar = ""
            state.mobile = ""
            state.verify_email = ""
            state.last_login_date = ""
            state.status = ""
            state.address_details = []
            state.shopping_cart = []
            state.orderHistory = []
            state.role = ""
            state.createdAt =""
        }
    }
})

export const {setUserDetails,logout,updateAvatar}=userSlice.actions
 
export default userSlice.reducer