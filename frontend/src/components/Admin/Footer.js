// import React from "react";
// import "./Footer.css"; 

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <p>Contact Info | Social Media Links</p>
//       <p className="footer-copy">© 2025 Shramsaathi. All Rights Reserved.</p>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("common");

  return (
    <footer className="footer">
      <p>{t("footer.contact")}</p>
      <p className="footer-copy">{t("footer.copyright")}</p>
    </footer>
  );
};

export default Footer;
