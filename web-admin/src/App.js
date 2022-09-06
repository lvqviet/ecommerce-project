import { useEffect } from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Switch , Redirect} from "react-router-dom";

import Layout from './views/layout'
import Login from './views/login'

import "./App.scss";

function App() {
  const token = localStorage.getItem("Bearer");

  useEffect(() => {}, [token]);

  return (
    <ConfigProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route
            path="/"
            render={() => {
               if (!token) {
                 return <Redirect to="/login" />;
               } else {
                  return <Layout />;
               }
            }}
          />
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
