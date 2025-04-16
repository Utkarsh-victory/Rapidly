import 'react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../Common/SummaryApi';
import axiosToastError from '../utils/axiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const OtpVerification
  = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const Location = useLocation()

    console.log("location", Location)

    useEffect(() => {
      if (!Location?.state?.email) {
        navigate("/forgot-password")
      }
    }, [])


    const validateValue = data.every(el => el)
    const HandleSubmit = async (e) => {
      e.preventDefault()


      try {
        const response = await Axios({
          ...SummaryApi.forgot_password_otp_verification,
          data: {
            otp: data.join(""),
            email: Location?.state?.email
          }
        })

        if (response.data.error) {
          toast.error(response.data.message)
        }

        if (response.data.success) {
          toast.success(response.data.message)
          setData(["","","","","",""])
          navigate("/reset-password", {
            state: {
              data: response.data,
              email : Location?.state?.email
            }
          })
        }
      } catch (error) {
        axiosToastError(error)

      }

    }
    return (
      <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
          <p className='font-semibold text-lg'>Enter OTP</p>
          <form className='grid gap-4 py-4' onSubmit={HandleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='otp'>Enter Your OTP :  </label>
              <div className='flex items-center gap-2 justify-center mt-3'>
                {
                  data.map((element, index) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <input
                        key={"otp" + index}
                        type='text'
                        id="otp"
                        ref={(ref) => {
                          inputRef.current[index] = ref
                          return ref
                        }}
                        value={data[index]}
                        onChange={(e) => {
                          const value = e.target.value
                          console.log("value", value)

                          const newData = [...data]
                          newData[index] = value
                          setData(newData)

                          if (value && index < 5) {
                            inputRef.current[index + 1].focus()
                          }
                        }}
                        maxLength={1}
                        className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'

                      />
                    )
                  })
                }
              </div>
            </div>

            <button disabled={!validateValue} className={` ${validateValue ? "bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide `}>Verify OTP</button>

          </form>

          <p>
            Already have account ? <Link to={"/register"}
              className='font-semibold text-green-700 hover:text-green-600'>Login</Link>
          </p>
        </div>
      </section>
    )
  }

export default OtpVerification

