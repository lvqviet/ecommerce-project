import Loadable from "react-loadable";
import Loading from "../components/Loading";

const Products = Loadable({
  loader: () => import("../views/products"),
  loading: Loading,
});

const ProductDetail = Loadable({
  loader: () => import("../views/products/ProductDetail"),
  loading: Loading,
});

const Orders = Loadable({
  loader: () => import("../views/orders"),
  loading: Loading,
});

const OrderDetail = Loadable({
  loader: () => import("../views/orders/OrderDetail"),
  loading: Loading,
});

const Statistic = Loadable({
  loader: () => import("../views/statistic"),
  loading: Loading,
});

const StatisticOrder = Loadable({
  loader: () => import("../views/statistic/statisticOrder"),
  loading: Loading,
});

const Categories = Loadable({
  loader: () => import("../views/category"),
  loading: Loading,
});

const Vouchers = Loadable({
  loader: () => import("../views/vouchers"),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import("../views/users"),
  loading: Loading,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    path: "/products/:id",
    component: ProductDetail,
  },
  {
    path: "/orders/:id",
    component: OrderDetail,
  },

  {
    path: "/products",
    component: Products,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/statistic",
    component: Statistic,
  },
  {
    path: "/statistic-order",
    component: StatisticOrder,
  },
  {
    path: "/categories",
    component: Categories,
  },
  {
    path: "/vouchers",
    component: Vouchers,
  },
  {
    path: "/users",
    component: Users,
  },
];
