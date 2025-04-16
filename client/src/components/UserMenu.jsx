import 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import axios from '../utils/axios'
import SummaryApi from '../Common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import axiosToastError from '../utils/axiosToastError'
import { LuExternalLink } from "react-icons/lu";
import isAdmin from '../utils/isAdmin'
import { use } from 'react'


// eslint-disable-next-line react/prop-types
const UserMenu = ({ close }) => {

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate()

  const HandelLogout = async () => {
    try {
      const response = await axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        if (close) {

          close()
        }
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      axiosToastError(error)
    }
  }

  const handelClose = () => {
    if (close) {
      close()
    }
  }
  return (
    <div>
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipis linle-clamp-1'>{user.name || user.mobile}<span className='text-red-600'>{user.role === "ADMIN" ? " (Admin)" : ""}</span></span>
        <Link onClick={handelClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
          <LuExternalLink size={15} />
        </Link></div>

      <Divider />
      <div className='text-sm grid gap-2'> 
        {
          isAdmin(user.role) && (

            <Link onClick={handelClose} to={"/dashboard/category"} className='px-2 
            
              hover:bg-gray-200 py-1'>Category </Link>
          )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handelClose} to={"/dashboard/subCategory"} className='px-2 
              hover:bg-gray-200 py-1'>Sub Category</Link>
            )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handelClose} to={"/dashboard/uploadProduct"} className='px-2 
            hover:bg-gray-200 py-1'>Upload Product</Link>
          )
        }
        {
          isAdmin(user.role)&& (
            <Link onClick={handelClose} to={"/dashboard/product"} className='px-2 
            hover:bg-gray-200 py-1'>Product</Link>
          )
        }    
        <Link onClick={handelClose} to={"/dashboard/myorders"} className='px-2 
          hover:bg-gray-200 py-1'>My Orders</Link>

        <Link onClick={handelClose} to={"/dashboard/address"} className='px-2 
          hover:bg-gray-200 py-1'>Save Address</Link>

        <button onClick={HandelLogout} className='text-left px-2 
        hover:bg-gray-200 py-1'>Log Out</button>

      </div>
    </div>
  )
}

export default UserMenu
