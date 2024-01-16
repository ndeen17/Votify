import React, { useState } from "react";
import "./settings.scss";

import { useDispatch, useSelector } from "react-redux";

import { settingsState, setSettingsRoute } from "./settingsSlice";

import { AiFillHome } from "react-icons/ai";
import { FaAddressCard } from "react-icons/fa";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

import Email from "./component/email/Email";
import General from "./component/general/General";

const Settings = () => {
  const [dropdown, setDropDown] = useState({
    Logo: AiFillHome,
  });
  const { settingsRoute } = useSelector(settingsState);
  const dispatch = useDispatch();
  const asideLinks = [
    {
      name: "General",
      Logo: AiFillHome,
      action: () => {
        setDropDown({ Logo: AiFillHome });
        dispatch(setSettingsRoute("General"));
      },
    },
    {
      name: "Email",
      Logo: FaAddressCard,
      action: () => {
        setDropDown({ Logo: FaAddressCard });
        dispatch(setSettingsRoute("Email"));
      },
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  const nonActiveLinks = asideLinks.filter(({ name }) => {
    return settingsRoute !== name;
  });
  const AsideLogo = dropdown.Logo;
  return (
    <div className="settings">
      <div
        className={`${
          isMobile
            ? "settings__aside__mobile isMobileActive"
            : "settings__aside__mobile"
        }`}
      >
        <div
          className={`${
            isMobile
              ? "settings__aside__mobile__header isMobileActive"
              : "settings__aside__mobile__header"
          }`}
        >
          <div className="settings__aside__mobile__header__info">
            <AsideLogo className="settings__aside__mobile__header__info__logo" />
            <p className="settings__aside__mobile__header__info__text">
              {settingsRoute}
            </p>
          </div>
          <div
            className="settings__aside__mobile__header__caret"
            onClick={() => setIsMobile((prev) => !prev)}
          >
            {!isMobile && (
              <RxCaretDown className="settings__aside__mobile__header__caret_icon" />
            )}
            {isMobile && (
              <RxCaretUp className="settings__aside__mobile__header__caret_icon" />
            )}
          </div>
        </div>
        {isMobile && (
          <div
            className={`${
              isMobile
                ? "settings__aside__mobile__options isMobileActive"
                : "settings__aside__mobile__options"
            }`}
          >
            {nonActiveLinks.map(({ Logo, name, action }) => {
              return (
                <div
                  key={name}
                  className="settings__aside__mobile__options__list"
                  onClick={() => {
                    action();
                    setIsMobile(false);
                  }}
                >
                  <Logo className="settings__aside__mobile__options__list__logo" />
                  <p className="settings__aside__mobile__options__list__name">
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <aside className="settings__aside">
        <div className="settings__aside__links">
          {asideLinks.map(({ name, Logo, action }) => {
            return (
              <div
                key={name}
                className={
                  settingsRoute === name
                    ? "settings__aside__link settings__aside__link__active"
                    : "settings__aside__link"
                }
                onClick={action}
              >
                <div className="settings__aside__link__logo">
                  <Logo className="settings__aside__link__logo__logo" />
                </div>
                <div className="settings__aside__link__name">{name}</div>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="settings__main">
        {settingsRoute === "Email" && <Email />}
        {settingsRoute === "General" && <General />}
      </main>
    </div>
  );
};

export default Settings;
