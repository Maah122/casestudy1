
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from "views/User.js";
import TableList from "views/Tables.js";
import UserPage from "views/UserPage.js";
import Dashboard from "views/Dashboard.js";
import GameStocks from "views/GameStocks.js"

const getAdmin = async () => {
  const admin = await AsyncStorage.getItem('admin');
  console.log(admin);
  return admin === 'true';
};

const isAdmin = await getAdmin();

const routes = [
];

if (isAdmin) {
  routes.push(
    {
      path: "/graph",
      name: "Graph",
      icon: "nc-icon nc-bell-55",
      component: <Dashboard />,
      layout: "/admin",
    },
    {
      path: "/user-page",
      name: "Admin Profile",
      icon: "nc-icon nc-single-02",
      component: <User />,
      layout: "/admin",
    },
    {
      path: "/tables",
      name: "Table List",
      icon: "nc-icon nc-tile-56",
      component: <TableList />,
      layout: "/admin",
    },

    {
      path: "/stocks",
      name: "Game Library",
      icon: "nc-icon nc-tile-56",
      component: <GameStocks />,
      layout: "/admin",
    },
   
  );

}


export default routes;
