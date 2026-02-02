import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* ===== ENGLISH ===== */
import commonEN from "./locals/en/common.json";
import homeEN from "./locals/en/home.json";
import statsEN from "./locals/en/stats.json"
import openingEN from "./locals/en/opening.json"
import faqEN from "./locals/en/faq.json"
import testimonalEN from "./locals/en/testimonal.json"
import navbarEN from "./locals/en/navbar.json"
import popupEN from "./locals/en/popup.json"
import jobmanagerEN from "./locals/en/jobManager.json"
import addJobEN from "./locals/en/addJob.json";
import ownerProfileEN from "./locals/en/ownerProfile.json";
import analyticsEN from "./locals/en/analytics.json";
import applicationEN from "./locals/en/application.json"


/* ===== HINDI ===== */
import ownerProfileHI from "./locals/hi/ownerProfile.json";
import analyticsHI from "./locals/hi/analytics.json";
import addJobHI from "./locals/hi/addJob.json";
import commonHI from "./locals/hi/common.json";
import faqHI from "./locals/hi/faq.json"
import homeHI from "./locals/hi/home.json";
import testimonalHI from "./locals/hi/testimonal.json"
import statsHI from "./locals/hi/stats.json"
import openingHI from "./locals/hi/opening.json"
import navbarHI from "./locals/hi/navbar.json"
import popupHI from "./locals/hi/popup.json"
import jobmanagerHI from "./locals/hi/jobManager.json"
import applicationHI from "./locals/hi/application.json"


/* ===== TELUGU ===== */
import addJobTE from "./locals/te/addJob.json";
import ownerProfileTE from "./locals/te/ownerProfile.json";
import commonTE from "./locals/te/common.json";
import analyticsTE from "./locals/te/analytics.json";
import faqTE from "./locals/te/faq.json"
import testimonalTE from "./locals/te/testimonal.json"
import homeTE from "./locals/te/home.json";
import statsTE from "./locals/te/stats.json"
import openingTE from "./locals/te/opening.json"
import navbarTE from "./locals/te/navbar.json"
import popupTE from "./locals/te/popup.json"
import jobmanagerTE from "./locals/te/jobManager.json"
import applicationTE from "./locals/te/application.json"


i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEN,
      home: homeEN,
      stats:statsEN,
      opening:openingEN,
      faq: faqEN,
      testimonal:testimonalEN,
      navbar:navbarEN,
      popup:popupEN,
      jobManager:jobmanagerEN,
       addJob: addJobEN,
       ownerProfile: ownerProfileEN ,
       analytics: analyticsEN,
       application:applicationEN,

    },
    hi: {
      common: commonHI,
      home: homeHI,
      stats:statsHI,
      faq: faqHI,
      opening:openingHI,
      testimonal:testimonalHI,
      navbar:navbarHI,
      popup:popupHI,
      jobManager:jobmanagerHI,
       addJob: addJobHI,
       ownerProfile: ownerProfileHI,
       analytics: analyticsHI,
       application:applicationHI,
    },
    te: {
      common: commonTE,
      home: homeTE,
      stats:statsTE,
      opening:openingTE,
      faq: faqTE,
      testimonal:testimonalTE,
      navbar:navbarTE,
      popup:popupTE,
      jobManager:jobmanagerTE,
       addJob: addJobTE,
       ownerProfile: ownerProfileTE,
       analytics: analyticsTE,
       application:applicationTE,
    }
  },

  // 🔑 language selection
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",

  // 📁 namespaces
  ns: ["common","home","stats","opening","faq","testimonal","navbar","popup","jobManager","addJob","ownerProfile","analytics","application"],
  defaultNS: "common",

  interpolation: {
    escapeValue: false
  }
});

export default i18n;
