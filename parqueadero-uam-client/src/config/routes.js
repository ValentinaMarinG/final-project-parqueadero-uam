import { LayoutGeneral } from "../Layouts/LayoutGeneral";
import { Admin } from "../pages/admin/Admin";
import { SignIn } from "../pages/admin/SignIn";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home/Home";
import { LogIn } from "../pages/LogIn/LogIn";
import { NotFound } from "../pages/NotFound/NotFound";
import { Register } from "../pages/Register/Register";

/* Components > Layouts > Pages > routes */
const AdminRoutes = [
    {path:"/admin", component:Admin, layout:LayoutGeneral},
    {path:"/admin/sign-in", component:SignIn, layout:LayoutGeneral}
];

const GeneralRoutes = [
    {path:"/", component:Home, layout:Home},
    {path:"/contact", component:Contact, layout:LayoutGeneral},
    {path:"*", component:NotFound, layout:LayoutGeneral},
    {path:"/LogIn", component:LogIn, layout:LogIn},
    {path:"/signin", component:NotFound, layout:NotFound},
    {path:"/register", component:Register, layout:Register}
];

/* ... -> Split operator: Poner todo al mismo nivel */
const allRoutesProject = [...AdminRoutes, ...GeneralRoutes];

export default allRoutesProject;
