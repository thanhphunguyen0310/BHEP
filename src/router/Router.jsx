import Homepage from '../pages/Homepage';
import Category from '../pages/Category';
import Community from './../pages/Community';
import Store from '../pages/Store';
import Doctor from '../pages/Doctor';
import HealthRecord from "../pages/customer/HealthRecord";
import DoctorChat from "../pages/doctor/Chat";
import DoctorChatLayout from "../components/Layout/DoctorLayout/Chat_Component";
import Workspace from '../pages/doctor/Workspace';
import ListAppointment from '../pages/ListAppointment';
import AppointmentHistory_Doctor from '../pages/doctor/AppointmentHistory_Doctor';
import AppointmentHistory from "../pages/customer/AppointmentHistory";
import AllDoctor from "../pages/AllDoctor";
import DoctorDetail from "../components/DoctorDetail";
import ProductDetail from "../components/ProductDetail";
import DoctorSchedule from "../components/Doctor/DoctorSchedule";
import BookingAppointment from '../pages/customer/BookingAppointment';
import AppointmentPayment from '../components/Customer/AppointmentPayment';
import AddCoin from '../pages/customer/AddCoin';
import Cart from '../components/Customer/Cart';
import Order from '../pages/Order';
import ErrorPage from './../pages/Error';
import FailPayment from './../pages/FailPayment';
import SuccessPayment from './../pages/SuccessPayment';
import UserInfo from '../pages/customer/UserInfo';
import UserHealthTracking from '../pages/customer/UserHealthTracking'
import Policy from '../pages/Policy';
import AboutUs from '../pages/AboutUs';
import TermOfUse from '../pages/TermOfUse';
import DisableAccount from '../components/DisableAccount';
import Manage from '../pages/admin/Manage';

export const  publicRoutes = [
    {path: "/", component: Homepage},
    {path: "/category", component: Category},
    {path: "/store", component: Store},
    {path: "/product-detail/:type/:id", component: ProductDetail },
    {path: "/doctor", component: Doctor },
    {path: "/all-doctor", component: AllDoctor },
    {path: "/doctor-detail/:id", component: DoctorDetail },
    {path: "/community", component: Community },
    {path: "/booking-appointment", component: BookingAppointment},
    {path: "/booking-payment", component: AppointmentPayment},
    {path: "/add-coin", component: AddCoin},
    {path: "/cart", component: Cart},
    {path: "/order", component: Order}
]

export const  customerRoutes = [
    {path: "/health-records", component: HealthRecord},
    {path: "/history-appointment", component: AppointmentHistory},
    
]

export const  doctorRoutes = [
    {path: "/doctor-chat", component: DoctorChat, layout: DoctorChatLayout},
    {path: "/workspace", component: Workspace},
    {path: "/create-schedule", component: DoctorSchedule},
    {path: "/list-appointment", component: ListAppointment},
    {path: "/doctor-history-appointment", component: AppointmentHistory_Doctor},
]

export const  adminRoutes = [
    // {path: "/manage-application", component: , layout: null},
    // {path: "/manage-appointment", component: , layout: null},
    // {path: "/manage-user", component: , layout: null}
]

export const  defaultLayoutRoutes = [
    {path: "/", component: Homepage, role: [0]},
    {path: "/category", component: Category, role: [0]},
    {path: "/store", component: Store, role: [0]},
    {path: "/product-detail/:type/:id", component: ProductDetail, role: [0] },
    {path: "/doctor", component: Doctor, role: [0] },
    {path: "/all-doctor", component: AllDoctor, role: [0] },
    {path: "/doctor-detail/:id", component: DoctorDetail, role: [0] },
    {path: "/community", component: Community,role: [0] },
    {path: "/booking-appointment", component: BookingAppointment, role: [1, 2, 3]},
    {path: "/booking-payment", component: AppointmentPayment, role: [2]},
    {path: "/add-coin", component: AddCoin, role: [2, 3]},
    {path: "/cart", component: Cart, role: [0]},
    {path: "/order", component: Order, role: [2, 3]},
    {path: "/doctor-chat", component: DoctorChat, layout: DoctorChatLayout, role: [3]},
    {path: "/workspace", component: Workspace, role: [3]},
    {path: "/create-schedule", component: DoctorSchedule, role: [3]},
    {path: "/list-appointment", component: ListAppointment, role: [2, 3]},
    {path: "/doctor-history-appointment", component: AppointmentHistory_Doctor, role: [0]},
    {path: "/health-records", component: HealthRecord, role: [2]},
    {path: "/history-appointment", component: AppointmentHistory, role: [2]},
    {path: "/error", component: ErrorPage},
    {path: "/fail-payment", component: FailPayment},
    {path: "/success-payment", component: SuccessPayment},
    {path: "/profile", component: UserInfo, role: [1, 2, 3]},
    {path: "/health-tracking", component: UserHealthTracking,role: [1, 2, 3]},
    {path: "/policy", component: Policy},
    {path: "/about-us", component: AboutUs},
    {path: "/terms-of-use", component: TermOfUse},
    {path: "/disable-account", component: DisableAccount},
    {path: "/manage", component: Manage, role: [1]},
]

