import 'react'
import { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/axios'
import SummaryApi from '../Common/SummaryApi'
import axiosToastError from '../utils/axiosToastError'
import { updateAvatar } from '../store/userSlice'
import { IoIosClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
const UserProfileAvatarUpload = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch =useDispatch()
    const [loading, setloading] = useState(false)

    const handelSubmit = (e) => {
        e.preventDefault()
    }

    const handelUploadAvatarImage = async (e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }
        const formData = new FormData()
        formData.append('avatar',file)

        try {
           setloading(true)
        const response = await Axios({
            ...SummaryApi.uploadAvatar,
            data : formData
        })

        const { data : responseData} = response
        dispatch(updateAvatar(responseData.data.avatar))
        console.log(response)
       } catch (error) {
        axiosToastError(error)
       }finally{

           setloading(false)
       }
    }
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900
    bg-opacity-60 p-4 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col
        items-center justify-center '>

                <buton className='text-neutral-800 cursor-pointer w-fit block ml-auto'>
                    <IoIosClose onClick={close} size={30}/>
                </buton>

                <div className='w-20 h-20 bg-yellow-400 flex items-center
              justify-center rounded-full overflow-hidden drop-shadow-sm'>
                    {
                        user.avatar ? (
                            <img
                                alt={user.name}
                                src={user.avatar}
                                className='w-full h-full'
                            />
                        ) : (

                            <FaRegUserCircle size={65} />
                        )
                    }
                </div>
                <form onSubmit={handelSubmit}>
                    <label htmlFor='uploadProfile'>
                        <div className=' cursor-pointer border border-primary-200 hover:bg-primary-200
             px-4 py-1 rounded text-sm my-3'>
                            {
                                loading ? "Loading..." : "Upload"
                            }
                        </div>
                    </label>
                    <input onChange={handelUploadAvatarImage}
                    type='file' id='uploadProfile' className='hidden' />
                </form>


            </div>

        </section>
    )
}
export default UserProfileAvatarUpload
