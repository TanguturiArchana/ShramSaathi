// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Popup.css";
// import axios from "axios";
// import API from "./api";
// const OwnerLoginPopup = ({ onClose,name ,phone,isAfterRegister}) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const nav=useNavigate();
//    async function getOwnerId(name, phone) {
//     const res = await axios.get(`http://localhost:8083/api/owners/find`, {
//       params: { name, phone }
//     });
//     return res.data.id;
//   }
//   const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await API.post(`/login/owner?name=${username}&password=${password}`);
//     if (res.status === 200) {
//       if(isAfterRegister){
//         const id = await getOwnerId(name, phone);
//         console.log("login via register",id);
//         alert("Login successful!");
//         nav("/ownerDashboard",{state:{id}});
//       }
//       else{
//         const res = await axios.get(`http://localhost:8083/api/owners/findByNameAndPassword`, {
//            params: { name: username, password } 
//         });
//         const id=res.data.id;
//         console.log("login via login",id);
//         alert("Login successful!");
//         nav("/ownerDashboard", {state:{id}});

//       } 
      
//     }
//   } 
    
//   catch (err) {
//     // alert(err.response.data);
//     alert("login error")
//     alert(err.response?.data || "Login failed");
//   }
// };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-box form-box">
//         <h2>Login to ShramSaathi</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             required
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button type="submit" className="btn-primary">
//             Login
//           </button>
//         </form>
//         <button className="btn-close" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OwnerLoginPopup;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Popup.css";
import axios from "axios";
import API from "./api";
import { useTranslation } from "react-i18next";

const OwnerLoginPopup = ({ onClose, name, phone, isAfterRegister }) => {
  const { t } = useTranslation("popup");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function getOwnerId(name, phone) {
    const res = await axios.get(`http://localhost:8083/api/owners/find`, {
      params: { name, phone }
    });
    return res.data.id;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        `/login/owner?name=${username}&password=${password}`
      );

      if (res.status === 200) {
        let id;

        if (isAfterRegister) {
          id = await getOwnerId(name, phone);
        } else {
          const res2 = await axios.get(
            `http://localhost:8083/api/owners/findByNameAndPassword`,
            { params: { name: username, password } }
          );
          id = res2.data.id;
        }

        alert(t("popup.login_success"));
        nav("/ownerDashboard", { state: { id } });
      }
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box form-box">
        <h2>{t("popup.login_title")}</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={t("popup.username")}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("popup.password")}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            {t("popup.login")}
          </button>
        </form>

        <button className="btn-close" onClick={onClose}>
          {t("popup.close")}
        </button>
      </div>
    </div>
  );
};

export default OwnerLoginPopup;
