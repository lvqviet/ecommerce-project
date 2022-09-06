import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

import menuConfig from "../../../../config/menuConfig";
import "./index.scss";

function Meun() {
  const location = useLocation();

  let { pathname } = location;

  return (
    <div className="sidebar-menu-container">
      <Menu
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={false}
      >
        {menuConfig.map((item, index) => {
          return (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
}

export default Meun;
