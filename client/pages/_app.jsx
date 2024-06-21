import { UserProvider } from '../context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../components/Nav';
import '../public/global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






export default function MyApp({ Component, pageProps}){
    return(

        <UserProvider>
        <Nav/>
        <ToastContainer position='top-center'/>
    <Component {...Component.pageProps} />
    </UserProvider>

    )
}