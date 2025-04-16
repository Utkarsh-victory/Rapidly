import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home"
import SearchPage from "../pages/SearchPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/otpverification";
import ResetPassword from "../pages/resetPAssword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboards from "../layouts/Dashboards";
import Profile from "../pages/profile";
import MyOrder from "../pages/MyOrder";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
const router = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "",
        element : <Home/>
      },
      {
        path : "search",
        element : <SearchPage/>
      },
      {
        path : 'login',
        element : <Login/>
      },
      {
        path : "register",
        element : <Register/>
      },
      {
        path : "forgot-password",
        element : <ForgotPassword/>
      },
      {
        path : "verfication-otp",
        element : <OtpVerification/>
      },
      {
        path : "reset-password",
        element : <ResetPassword/>
      },
      {
        path : "user",
        element : <UserMenuMobile/>
      },
      {
        path : "dashboard",
        element : <Dashboards/>,
        children : [
          {
            path : "profile",
            element : <Profile/>
          },
          {
            path : "myorders",
            element : <MyOrder/>
          },
          {
            path : "address",
            element : <Address/>
          },
          {
            path : "category",
            element : <AdminPermission><CategoryPage/></AdminPermission>
          },
          {
            path : "subCategory",
            element : <AdminPermission><SubCategoryPage/></AdminPermission>
          },
          {
            path : "uploadProduct",
            element : <AdminPermission><UploadProduct/></AdminPermission>
          },
          {
            path : "product",
            element : <AdminPermission><ProductAdmin/></AdminPermission>
          }
        ]
       }
    ]
  }
])

export default router