import { NavLink,Outlet } from "react-router";

const AdminLayout = () => {


    return (
        <>
        <nav>
        <NavLink to ="dashboard">Dashboard</NavLink>
        <NavLink to ="orderadmin">Orders</NavLink>
        <NavLink to ="product">Products</NavLink>
        <NavLink to ="users">Users</NavLink>

        </nav>

        <main>

            <Outlet/>
        </main>

        </>
    );
}
export default AdminLayout