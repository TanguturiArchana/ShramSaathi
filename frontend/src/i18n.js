import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import skillTestEN from "./locals/en/skillTest.json"
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
import applicationEN from "./locals/en/application.json";
import workerDashboardEN from "./locals/en/WorkerDashboard.json";
import workerProfileEN from "./locals/en/workerProfile.json";
import chatModalEN from "./locals/en/chatModal.json";
import notificationsEN from "./locals/en/notifications.json"


import notificationsHI from "./locals/hi/notifications.json"
import skillTestHI from "./locals/hi/skillTest.json"
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
import workerDashboardHI from "./locals/hi/WorkerDashboard.json"
import workerProfileHI from "./locals/hi/workerProfile.json";
import chatModalHI from "./locals/hi/chatModal.json";



import skillTestTE from "./locals/te/skillTest.json"
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
import workerDashboardTE from "./locals/te/WorkerDashboard.json"
import workerProfileTE from "./locals/te/workerProfile.json";
import chatModalTE from "./locals/te/chatModal.json";
import notificationsTE from "./locals/te/notifications.json"


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
       workerDashboard:workerDashboardEN,
       workerProfile:workerProfileEN,
       chatModal:chatModalEN,
       skillTest:skillTestEN,
       notifications:notificationsEN
       

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
      workerDashboard:workerDashboardHI,
      workerProfile:workerProfileHI,
      chatModal:chatModalHI,
      skillTest:skillTestHI,
      notifications:notificationsHI
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
        workerDashboard:workerDashboardTE,
        workerProfile:workerProfileTE,
        chatModal:chatModalTE,
        skillTest:skillTestTE,
        notifications:notificationsTE
    }
  },

 
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",


  ns: ["common","home","stats","opening","faq","notifications","testimonal","navbar","popup","jobManager","addJob","ownerProfile","analytics","application","workerDashboard","workerProfile","chatModal","skillTest"],
  defaultNS: "common",

  interpolation: {
    escapeValue: false
  }
});

export default i18n;
