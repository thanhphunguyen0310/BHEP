import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({children, role}) => {
    const userRole = useSelector((state) => state.auth?.user?.data?.user?.roleId);
    // console.log(userRole)
    // console.log(role)
    // if(!userRole){
    //     return (<Navigate to="/error"/>)
    // }
    if(role  && role != 0 && !role.includes(userRole)){
        return (<Navigate to="/error"/>)
    } 

    return ( 
        <>
            {children}
        </>
     );
}
 
export default PrivateRoute;