import { LayoutGeneral } from "../Layouts/LayoutGeneral";
import { Admin } from "../pages/admin/Admin";
import { SignIn } from "../pages/admin/SignIn";
import { Contact } from "../pages/Contact";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound/NotFound";

/* Components > Layouts > Pages > routes */
const AdminRoutes = [
    {path:"/admin", component:Admin, layout:LayoutGeneral},
    {path:"/admin/sign-in", component:SignIn, layout:LayoutGeneral}
];

const GeneralRoutes = [
    {path:"/", component:Home, layout:LayoutGeneral},
    {path:"/contact", component:Contact, layout:LayoutGeneral},
    {path:"*", component:NotFound, layout:LayoutGeneral}
];

/* ... -> Split operator: Poner todo al mismo nivel */
const allRoutesProject = [...AdminRoutes, ...GeneralRoutes];

export default allRoutesProject;