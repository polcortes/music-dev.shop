import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';

const Layout = () => {
  return (<> 
    <Outlet />
    <Toaster />
  </>)
}

export default Layout;