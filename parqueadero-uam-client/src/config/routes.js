import { LayoutGeneral } from "../Layouts/LayoutGeneral";
import { Admin } from "../pages/admin/Admin";
import { SignIn } from "../pages/admin/SignIn";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home/Home";
import { LogIn } from "../pages/LogIn/LogIn";
import { NotFound } from "../pages/NotFound/NotFound";
import { Register } from "../pages/Register/Register";
import { Delegate } from "../pages/Delegate/Delegate";
import { User } from "../pages/User/User";
import { EditUser } from "../pages/EditUser/EditUser";
import { SetPassword } from "../pages/SetPassword/SetPassword";
import { RegisterUser } from "../Layouts/AdminUsers/RegisterUser";
import { RegisterDelegate } from "../Layouts/AdminDelegates/RegisterDelegate";
import { AdminEditUser } from "../Layouts/AdminUsers/AdminEditUser/AdminEditUser";
import { AdminEditUserForm } from "../Layouts/AdminUsers/AdminEditUser/Form";
import { UserProfile } from "../Layouts/AdminUsers/UserProfile";

/* Components > Layouts > Pages > routes */
const AdminRoutes = [
    {path:"/admin", component:Admin, layout:LayoutGeneral},
    {path:"/admin/sign-in", component:SignIn, layout:LayoutGeneral},
    /* {path:"/admin/delegates", component:AdminDelegates, layout:AdminDelegates}, */
    {path:"/admin/delegates/register", component:RegisterDelegate, layout:RegisterDelegate},
    /* {path:"/admin/parkings/register", component:RegisterParking, layout:RegisterParking}, */
    {path:"/admin/users/register", component:RegisterUser, layout:RegisterUser},
    {path:"/admin/users/:document", component:AdminEditUserForm, layout:AdminEditUser},
    {path:"/admin/users/profile/:document", component:UserProfile, layout:UserProfile},
];

const GeneralRoutes = [
    {path:"/", component:Home, layout:Home},
    {path:"/contact", component:Contact, layout:LayoutGeneral},
    {path:"*", component:NotFound, layout:LayoutGeneral},
    {path:"/LogIn", component:LogIn, layout:LogIn},
    {path:"/signin", component:NotFound, layout:NotFound},
    {path:"/delegate", component:Delegate, layout:Delegate},
    {path:"/delegate/parkings/economia", component:Delegate, layout:Delegate},
    {path:"/delegate/parkings/vagon", component:Delegate, layout:Delegate},
    {path:"/user/profile", component:User, layout:User},
    {path:"/register", component:Register, layout:Register},
    {path:"/user/edit", component:EditUser, layout:EditUser},
    {path:"/user/setpassword", component:SetPassword, layout:SetPassword}
];

/* ... -> Split operator: Poner todo al mismo nivel */
const allRoutesProject = [...AdminRoutes, ...GeneralRoutes];

export default allRoutesProject;
