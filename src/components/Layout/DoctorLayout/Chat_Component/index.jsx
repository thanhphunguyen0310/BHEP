import TopBar from './TopBar';
import SideBar from './SideBar';


const DoctorChatLayout = ({children}) => {
    return ( 
        <div>
            <TopBar />
            <div className="container">
                <div className="content">
                    {children}
                </div>
                <SideBar />
            </div>
        </div>
     );
}
 
export default DoctorChatLayout;