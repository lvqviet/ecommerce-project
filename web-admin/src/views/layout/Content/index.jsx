import React, { useEffect } from "react";
import {  Route, Switch, useLocation } from "react-router-dom";
import DocumentTitle from "react-document-title";
import { Layout } from "antd";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import routeList from "../../../config/routeMap";
import menuList from "../../../config/menuConfig";

const { Content } = Layout;

const LayoutContent = () => {
  let location = useLocation();
 
  let { pathname } = location;
  function getMenuItemInMenuListByProperty(value) {
    const temp = menuList.find((item) => item.path === value);
    return temp ? temp.title : "Details";
  }

  useEffect(() => {}, []);

  return (
    <DocumentTitle title={getMenuItemInMenuListByProperty(pathname)}>
      <Content style={{ height: "calc(100% - 100px)", "overflow-y": "auto" }}>
        <TransitionGroup>
          <CSSTransition
            key={pathname}
            timeout={500} 
            classNames="fade"
            exit={false}
          >
            <Switch location={location}>
              {routeList.map((item,index) => {
                return (
                  <Route
                    component={item.component}
                    key={`${item.path} ${index}`}
                    path={item.path}
                  />
                );
              })}
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </Content>
    </DocumentTitle>
  );
};

export default LayoutContent;
