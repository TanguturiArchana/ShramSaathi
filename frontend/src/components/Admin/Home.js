import { useState } from "react";
import "./Home.css";
import Popup from "./Popup";
import { useTranslation } from "react-i18next";

const heroImages = [
  "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/5691620/pexels-photo-5691620.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/8961300/pexels-photo-8961300.jpeg?auto=compress&cs=tinysrgb&w=1200",
];
const Home = () => {
  const { t, i18n } = useTranslation("home");
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleLanguageSelect = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleWorker = () => {
    alert("Redirect to Worker Login/Register Page");
    setShowPopup(false);
  };

  const handleOwner = () => {
    alert("Redirect to Owner Login/Register Page");
    setShowPopup(false);
  };

  return (
    <div>
    <div className="lang-switch">
        <select
          className="lang-select"
          value={i18n.language}
          onChange={handleLanguageSelect}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>
    <section className="home-hero">
      <div className="home-hero-content">
        <p className="hero-kicker">{t("welcome")}</p>
        <h1>{t("heading")}</h1>
        <p className="hero-description">
          {t("description")}
        </p>
        <div className="hero-actions">
          <button className="join-btn" onClick={() => setShowPopup(true)}>
            {t("join_now")}
          </button>
          <button className="tour-btn" onClick={() => setShowPopup(true)}>
            {t("hiring")}
          </button>
        </div>
      </div>

      <div className="home-hero-visuals">
        <div className="visual-main">
          <img src={heroImages[0]} alt="Construction team at work" />
        </div>
        <div className="visual-side">
          <img src={heroImages[1]} alt="Skilled carpenter working precisely" />
          <img src={heroImages[2]} alt="Worker taking measurements on site" />
        </div>
      </div>

  
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          onWorker={handleWorker}
          onOwner={handleOwner}
        />
      )}
    </section>
    </div>
    
  );
};


export default Home;
