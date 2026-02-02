// import { useState } from "react";
// import "./Home.css";
// import Popup from "./Popup";

// const Home = () => {
//   const [showPopup, setShowPopup] = useState(false);

//   const handleOpenPopup = () => setShowPopup(true);
//   const handleClosePopup = () => setShowPopup(false);

//   const handleWorker = () => {
//     alert("Redirect to Worker Login/Register Page");
//     setShowPopup(false);
//   };

//   const handleOwner = () => {
//     alert("Redirect to Owner Login/Register Page");
//     setShowPopup(false);
//   };

//   return (
//     <div className="home-section">
//       <h1>Welcome to Shramsaathi</h1>
//       <p>
//         A digital bridge connecting skilled workers and employers. Our platform
//         empowers carpenters, plumbers, electricians, and other daily-wage
//      earners by providing visibility, direct job access, and freedom to
//        choose work easily. Join now to find verified workers nearby and explore
//        opportunities!
//       </p>
//       <button className="join-btn" onClick={handleOpenPopup}>
//         Join Now
//       </button>

//       {showPopup && (
//         <Popup
//           onClose={handleClosePopup}
//           onWorker={handleWorker}
//           onOwner={handleOwner}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;


import { useState } from "react";
import "./Home.css";
import Popup from "./Popup";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation("home");
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  // Language selection (before login)
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
    <div className="home-section">
      {/* Language Selector */}
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

      <h1>{t("welcome")}</h1>
      <p>{t("description")}</p>

      <button className="join-btn" onClick={handleOpenPopup}>
        {t("join_now")}
      </button>

      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          onWorker={handleWorker}
          onOwner={handleOwner}
        />
      )}
    </div>
  );
};

export default Home;
