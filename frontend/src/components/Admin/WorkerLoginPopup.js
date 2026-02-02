// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Popup.css";
// import API from "./api";
// import axios from "axios";
// const LoginPopup = ({ onClose,name ,phone,isAfterWorkerRegister }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const nav=useNavigate();
//   async function getWorkerId(name, phone) {
//   const res = await axios.get(`http://localhost:8083/api/users/findWorker`, {
//     params: { name, phone }
//   });
//   return res.data.id;
// }


//   const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//      const res = await API.post(`/login/user?name=${username}&password=${password}`);
//     if (res.status === 200) {
//       if(isAfterWorkerRegister ){
//         const id = await getWorkerId(name, phone);
//         console.log("login via register",id);
//         alert("Worker Login successful!");
//         nav("workerDashboard",{state:{id}});
        

//       }
//       else{
//         const res = await axios.get(`http://localhost:8083/api/users/findByNameAndPassword`, {
//            params: { name: username, password } 
//         });
//         const id=res.data.id;
//         console.log("login via login",id);
//         alert("Worker Login successful!");
//         nav("/workerDashboard", {state:{id}});

//       } 
      
//     }
//   } catch (err) {
//     alert(err.response.data);
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

// export default LoginPopup;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Popup.css";
import API from "./api";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LoginPopup = ({ onClose, name, phone, isAfterWorkerRegister }) => {
  const { t } = useTranslation("popup");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function getWorkerId(name, phone) {
    const res = await axios.get(`http://localhost:8083/api/users/findWorker`, {
      params: { name, phone }
    });
    return res.data.id;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        `/login/user?name=${username}&password=${password}`
      );

      if (res.status === 200) {
        let id;

        if (isAfterWorkerRegister) {
          id = await getWorkerId(name, phone);
        } else {
          const res2 = await axios.get(
            `http://localhost:8083/api/users/findByNameAndPassword`,
            { params: { name: username, password } }
          );
          id = res2.data.id;
        }

        alert(t("popup.login_success"));
        nav("/workerDashboard", { state: { id } });
      }
    } catch (err) {
      alert(err.response?.data || "Error");
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

export default LoginPopup;
