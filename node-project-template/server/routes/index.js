import adminRoute from './admin.routes.js';
import careScheduleRoute from './careSchedule.routes.js'
import usersRoute from './users.routes.js';
import productRoute from './products.routes.js';
import cartRoute from './carts.routes.js';
import orderRoute from './order.routes.js';
import paymentsRoute from './payments.routes.js';
import dashboardRoute from './dashboard.routes.js';

const routes = [
    {path: '/admins', router: adminRoute},
    {path: '/care-schedules', router: careScheduleRoute},
    {path: '/users', router: usersRoute},
    {path: '/products', router: productRoute},
    {path: '/carts', router: cartRoute},
    {path: '/orders', router: orderRoute},
    {path: '/payments', router: paymentsRoute},
    {path: '/dashboard', router: dashboardRoute},
];

export default routes;