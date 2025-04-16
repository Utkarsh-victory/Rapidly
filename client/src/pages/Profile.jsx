import 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarUpload from '../components/UserProfileAvatarUpload';
import { useEffect, useState } from 'react';
import axiosToastError from '../utils/axiosToastError';
import SummaryApi from '../Common/SummaryApi';
import Axios from '../utils/axios';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';

const Profile = () => {
    const user = useSelector(state => state.user)
    const[openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,  
        })
    },[user])


    const handelOnChange = (e)=>{
        const {name, value} = e.target

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handelSubmit =async(e)=>{
        e.preventDefault()  

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updataeUserDetails,
                data : userData
            })

            const {data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            axiosToastError(error)
        }finally{
            setLoading(false)
        }
    }
    return (
    <div className='p-4'>

        {/**Profile upload and display image**/}
        <div className='w-20 h-20 bg-yellow-400 flex items-center justify-center 
        rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img
                        alt={user.name}
                        src={user.avatar}
                        className='w-full h-full'
                        />
                ):(
                    
                    <FaRegUserCircle size={65}/>
                )
            }
        </div>
        <button onClick={()=>setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-100
        hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3'>Edit</button>

        {
            openProfileAvatarEdit && (
                <UserProfileAvatarUpload close={()=>setProfileAvatarEdit(false)}/>
            )
        }

        {/*name, mobile, email, changePassword */}
        <form className='my-4 grid gap-4' onSubmit={handelSubmit}>
            <div className='grid'>
                <label >Name</label>
                <input 
                    type='text'
                    placeholder='Enter your name'
                    className='p-2 bg-blue-50 outline-none border 
                    focus-within:border-primary-200 rounded'
                    value={userData.name}
                    name='name'
                    onChange={handelOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>Email</label>
                <input 
                    type='email'
                    id='email'
                    placeholder='Enter your email'
                    className='p-2 bg-blue-50 outline-none border 
                    focus-within:border-primary-200 rounded'
                    value={userData.email}
                    name='email'
                    onChange={handelOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                <input 
                    type='text'
                    id='mobile'
                    placeholder='Enter your number'
                    className='p-2 bg-blue-50 outline-none border 
                    focus-within:border-primary-200 rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handelOnChange}
                    required
                />
            </div>

            <button className='border px-4 py-2 font-semibold
            hover:bg-primary-100 border-primary-100 text-primary-200
            hover:text-blue-900'>
                {
                    loading ? "Loading..." : "Submit"
                }
            </button>
        </form>
    </div>
 

  )
}

export default Profile
