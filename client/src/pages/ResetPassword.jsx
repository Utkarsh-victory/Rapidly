import 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../Common/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const Location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newpassword: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)
    const validateValue = Object.values(data).every(el => el)



    useEffect(() => {
        if (!(Location?.state?.data?.success)) {
            navigate("/")
        }

        if (Location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: Location?.state?.email
                }
            })
        }
    }, [])

    
    
    const handleChange = (e) => {
        const { name, value } = e.target
        
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const HandleSubmit = async (e) => {
      e.preventDefault()
        if(data.newpassword !== data.confirmPassword){
            toast.error("New password and confirm password must be same")
            
        }


        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
              })
              
              if (response.data.error) {
                toast.error(response.data.message)
              }
              
              if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newpassword: "",
                    confirmPassword: ""
                  })
                }
              } catch (error) {
                axiosToastError(error)
                
              }
              
              console.log("data reset password",data)
    }
  

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg'>Enter Your Password</p>
                <form className='grid gap-4 py-4' onSubmit={HandleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='newpassword'>New Password : </label>

                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id=" password"
                                className='w-full outline-none rounded'
                                name="newpassword"
                                value={data.newpassword}
                                onChange={handleChange}
                                placeholder=' Enter your new password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }


                            </div>

                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password : </label>

                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="password"
                                className='w-full outline-none rounded'
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder=' Enter your confirmPassword'
                            />
                            <div onClick={() => setshowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }


                            </div>

                        </div>
                    </div>

                    <button disabled={!validateValue} className={` ${validateValue ? "bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide `}>Change Password</button>

                </form>

                <p>
                    Already have account ? <Link to={"/login"}
                        className='font-semibold text-green-700 hover:text-green-600'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default ResetPassword
