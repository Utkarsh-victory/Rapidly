import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { useDispatch } from 'react-redux'
import SummaryApi from './Common/SummaryApi'
import axiosToastError from './utils/axiosToastError'
import Axios from './utils/axios'
import { setAllCategory,setAllSubCategory } from './store/productSlice'

function App() {
  const dispatch = useDispatch()
  const fetchUser = async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
    }

    const fetchCategory = async () => {
      try {
        
        const response = await Axios({
          ...SummaryApi.getCategory
        })
        const { data: responseData } = response
  
        if (responseData.success) {
          dispatch(setAllCategory(responseData.data))
        }
      } catch (error) {
          axiosToastError(error)
      } finally { /* empty */ }
    }
  
    const fetchSubCategory = async () => {
      try {
        
        const response = await Axios({
          ...SummaryApi.getSubCategory
        })
        const { data: responseData } = response
  
        if (responseData.success) {
          dispatch(setAllSubCategory(responseData.data))
        }
      } catch (error) {
          axiosToastError(error)
      } finally { /* empty */ }
    }

  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  },[])

  return (
    <>
    <Header/>
 <main className='min-h-[78vh]'>
  <Outlet/>
 </main>
    <Footer/>
    <Toaster/>
    </>
  )
}

export default App
