import React, { useState } from "react";
import logo from "./logo1.png";
import "./Navbar.css";
import Popup from "./Popup";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation("navbar");

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={logo} alt={t("navbar.title")} className="navbar-logo" />
        <h1 className="navbar-title">{t("navbar.title")}</h1>
      </div>

      <div className="navbar-buttons">
        <button className="btn-primary" onClick={handleOpenPopup}>
          {t("navbar.login")}
        </button>
        <button className="btn-outline" onClick={handleOpenPopup}>
          {t("navbar.register")}
        </button>
      </div>

      {showPopup && <Popup onClose={handleClosePopup} />}
    </header>
  );
};

export default Navbar;
