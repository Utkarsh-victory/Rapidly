import 'react'
import { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/axios';
import SummaryApi from '../Common/SummaryApi';
import toast from 'react-hot-toast'
import axiosToastError from "../utils/axiosToastError"

// eslint-disable-next-line react/prop-types
const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setdata] = useState({
        name: "",
        image : "",
    })

    const [loading,setLoading] = useState(false)

    const handelOnChange = (e) => {
        const { name, value } = e.target

        setdata((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handelSubmit = async(e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addcategory,
                data : data
            })
            const {data : responseData} = response
            
                if(responseData.success){
                    toast.success(responseData.message)
                    fetchData()
                    close()
                   
                }
            
        } catch (error) {
            axiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    const handelUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }
        setLoading(true)
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setLoading(false)
        setdata((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })
    }
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
            <div className='bg-white max-w-4x1 w-full p-4 rounded'>
                <div className='flex items-center justify-center'>
                    <h1 className='font-semibold'>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoIosClose size={30} />
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handelSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handelOnChange}
                            className='bg-blue-50 p-2 border border-blue-100
                        focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center '>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex
                        items-center justify-center rounded'>

                                {
                                    data.image ? (
                                        <img
                                            alt='category'
                                            src={data.image}
                                            className='w-full h-full object-scale-down' />

                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>

                                    )
                                }

                            </div>
                            <label htmlFor='uploadCategoryImage'>
                                <div className={`
                                ${!data.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"}
                                 px-4 cursor-pointer py-2 rounded  border font-medium`} >
                                    {
                                        loading ? "Loading..."  : "Upload Image"
                                    }</div>
                                <input disabled={!data.name} onChange={handelUploadCategoryImage} type='file' id='uploadCategoryImage'
                                    className='hidden' />
                            </label>

                        </div>
                    </div>
                    <button
                        className={`
                    ${data.name && data.image ? "bg-primary-200  hover:bg-primary-100" : "bg-gray-300"}
                    py-2
                    font-semibold`}>Add Category</button>
                </form>
            </div>
        </section>
    )
}

export default UploadCategoryModel
