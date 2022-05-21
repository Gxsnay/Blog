import React, { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { INavItem, navList } from "utils/dataMap";
import { useDOMScroll } from "utils/useCallback";
import styled from "@emotion/styled";
import { FlexBlock, UserNoSelect } from "style/common";
import { useStores } from "store";
import { Tag } from "antd";
import { observer } from "mobx-react";

export const Header: FC = observer(() => {
  const navigate = useNavigate();
  const routes = useLocation();

  const { sApp } = useStores();
  // 头部内容 初始化~
  const [navStatus, setNavStatus] = useState("static");
  const [navModel, setNavModel] = useState({
    font: "#fff",
    background: "rgba(0, 0, 0, 0.3)",
    borderColor: "",
  });
  const [scrolllTop] = useDOMScroll();

  const toggleNavActive: (_nav: INavItem) => void = (_nav) => {
    sApp.CHANGE_ACTIVE_TAG(_nav?.tag || "Home");
    sApp.CHANGE_HEADER_STYLE(_nav?.tag || "Home");
  };

  useEffect(() => {
    let curRoute = "Home";
    const currentRoute = routes.pathname.split("/")[1];
    const matchRouteTag = navList.find((_nav) => {
      return (
        _nav.tag?.toLocaleUpperCase() === currentRoute?.toLocaleUpperCase()
      );
    });
    curRoute = matchRouteTag?.tag || "Home";
    if (matchRouteTag || routes.pathname === "/") {
      toggleNavActive({ tag: curRoute });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.pathname]);

  let cacheTop = useRef(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      // 判断滚动高度是否大于 399 然后设置背景颜色~
      if (scrolllTop > 399) {
        setNavModel({
          ...navModel,
          font: "#000",
          background: "rgba(255, 255, 255, 0.9)",
          borderColor: "#eee",
        });
      } else {
        setNavModel({
          ...navModel,
          font: "#fff",
          background: "rgba(0, 0, 0, 0.3)",
          borderColor: "",
        });
      }
      // 判断向上向下滚动 设置浮动~
      if (scrolllTop > cacheTop.current) {
        setNavStatus("static");
      } else {
        setNavStatus("active");
      }
      cacheTop.current = scrolllTop;
    }, 111);
    return () => clearInterval(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolllTop]);
  const handleClickLogo: () => void = () => {
    navigate("/home");
    toggleNavActive({ tag: "Home" });
  };

  return (
    <HeaderBox headerBgImg={sApp.headerStyle?.headerImg}>
      <HeaderMain>
        <HeaderTitle>
          {sApp.headerStyle?.headerTitle}
          {sApp.headerStyle?.headerTag ? (
            <HeaderTag color={sApp.headerStyle?.headerTagColor}>
              <span style={{ color: sApp.headerStyle?.headerTagFontColor }}>
                {sApp.headerStyle?.headerTag}
              </span>
            </HeaderTag>
          ) : null}
        </HeaderTitle>
        <HeaderDesc>{sApp.headerStyle?.headerDesc}</HeaderDesc>
      </HeaderMain>

      <NavBox
        navBgc={navModel.background}
        className={navStatus === "active" ? "navbox--active" : ""}
        navBorderColor={navModel.borderColor}
      >
        <NavTitle fontColor={navModel.font} onClick={handleClickLogo}>
          {sApp.siteTag}
        </NavTitle>
        <Nav>
          {navList.map((_nav) => {
            return (
              <NavItem
                key={_nav.tag}
                fontColor={navModel.font}
                actived={sApp.activeTag === _nav.tag}
              >
                <Link to={`${_nav.link}`} onClick={() => toggleNavActive(_nav)}>
                  {_nav.title}
                </Link>
              </NavItem>
            );
          })}
        </Nav>
      </NavBox>
    </HeaderBox>
  );
});

const HeaderBox = styled(UserNoSelect)<{
  headerBgImg?: string;
}>`
  width: 100vw;
  height: 39.9rem;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 60% 80%;
  position: relative;
  z-index: 999;
  background-image: ${({ headerBgImg }) => headerBgImg || undefined};
  background-color: ${({ headerBgImg }) => headerBgImg || undefined};
`;
const HeaderMain = styled(FlexBlock)`
  width: 100%;
  height: 100%;
  position: absolute;
  flex-direction: column;
  color: #fff;
  font-size: 1.6rem;
  z-index: 3;
`;
const HeaderTag = styled(Tag)`
  position: absolute;
  top: 1.5rem;
  margin-left: 0.3rem;
`;
const HeaderTitle = styled.p`
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 0;
  position: relative;
`;
const HeaderDesc = styled.p`
  color: #fff;
`;
const NavBox = styled(FlexBlock)<{
  navBgc?: string;
  navBorderColor?: string;
}>`
  width: 100vw;
  height: 0;
  justify-content: space-between;
  padding: 0 60px;
  font-weight: bold;
  background-color: ${({ navBgc }) => navBgc || undefined};
  position: fixed;
  opacity: 0;
  transition: all ease 1s;
  z-index: 9;
  border: 1px solid;
  border-color: ${({ navBorderColor }) => navBorderColor || "transparent"};
  &.navbox--active {
    height: 6rem;
    opacity: 1;
  }
`;
const NavTitle = styled.div<{
  fontColor?: string;
}>`
  font-weight: bold;
  font-size: 2.6rem;
  cursor: pointer;
  color: ${({ fontColor }) => fontColor || "#fff"};
`;
const Nav = styled.div`
  display: flex;
`;
const NavItem = styled.span<{
  actived?: boolean;
  fontColor?: string;
}>`
  margin: 0 2rem;
  font-size: 1.4rem;
  display: block;
  position: relative;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    width: 150%;
    height: 5px;
    bottom: -18px;
    left: -20%;
    border-radius: 3px;
    background-color: ${({ actived }) => (actived ? "#AAABD3" : "transparent")};
  }
  a {
    color: ${({ actived, fontColor }) =>
      actived ? "#42b983" : fontColor ? fontColor : "#fff"};
    &:hover {
      color: #42b983;
    }
  }
`;
