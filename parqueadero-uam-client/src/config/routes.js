import { LayoutGeneral } from "../Layouts/LayoutGeneral";
import { Admin } from "../pages/admin/Admin";
import { SignIn } from "../pages/admin/SignIn";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home/Home";
import { LogIn } from "../pages/LogIn/LogIn";
import { NotFound } from "../pages/NotFound/NotFound";
import { Register } from "../pages/Register/Register";
import { Delegate } from "../pages/Delegate/Delegate";

import UserPage, { default as User } from "../pages/User/User";
import { EditUser } from "../pages/EditUser/EditUser";
import { SetPassword } from "../pages/SetPassword/SetPassword";
import { AdminDelegates } from "../Layouts/AdminDelegates/AdminDelegates";
import { RegisterDelegate } from "../Layouts/AdminDelegates/RegisterDelegate";
import { User } from "../pages/User/User";
import { EditUser } from "../pages/EditUser/EditUser";

/* Components > Layouts > Pages > routes */
const AdminRoutes = [
    {path:"/admin", component:Admin, layout:LayoutGeneral},
    {path:"/admin/sign-in", component:SignIn, layout:LayoutGeneral},
    {path:"/admin/delegates", component:AdminDelegates, layout:AdminDelegates},
    {path:"/admin/delegates/register", component:RegisterDelegate, layout:RegisterDelegate},
    {path:"/admin/parkings/register", component:RegisterParking, layout:RegisterParking},
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
