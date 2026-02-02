// import React, { useEffect, useState } from "react";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import axios from "axios";

// const OwnerProfile = () => {
//   const [owner, setOwner] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showUpdatePopup, setShowUpdatePopup] = useState(false);
//   const [selectedField, setSelectedField] = useState("");
//   const [newValue, setNewValue] = useState("");


//   const [showPasswordPopup, setShowPasswordPopup] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const navigate = useNavigate();
//   const state = useOutletContext();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!state) navigate("/");
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [state, navigate]);

//   useEffect(() => {
//     if (!state) return;

//     const fetchOwner = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8083/api/owners/profile/${state.id}`
//         );
//         setOwner(res.data);
//       } catch (err) {
//         console.error("Error loading profile", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwner();
//   }, [state]);

//   const handleChangePassword = async () => {
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       alert("All fields are required!");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       alert("New password and Confirm password do not match!");
//       return;
//     }

//     try {
//       await axios.put(`http://localhost:8083/api/owners/change-password/${state.id}`, {
//         oldPassword,
//         newPassword,
//       });

//       alert("Password changed successfully!");
//       setShowPasswordPopup(false);
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       alert(err.response?.data || "Password update failed");
//     }
//   };

//   if (loading) return <h2>Loading profile...</h2>;
//   if (!owner) return <h2>Owner not found — ID: {state?.id}</h2>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h1>Owner Profile</h1>
//         <button
//           onClick={() => {
//             localStorage.removeItem("ownerState");
//             navigate("/");
//           }}
//           style={{
//             padding: "8px 15px",
//             backgroundColor: "#e63946",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//             fontWeight: "bold"
//           }}
//         >
//           Logout 🔐
//         </button>
//       </div>

//       <div className="profile-card">
//         <p><b>Name:</b> {owner.name}</p>
//         <p><b>Phone:</b> {owner.phone}
//           <button onClick={() => { setSelectedField("phone"); setShowUpdatePopup(true); }}>
//           ✏️
//           </button>
//         </p>

//       <p><b>Business Name:</b> {owner.businessName}
//         <button onClick={() => { setSelectedField("businessName"); setShowUpdatePopup(true); }}>
//         ✏️
//         </button>
//       </p>

//       <p><b>Address:</b> {owner.address}
//         <button onClick={() => { setSelectedField("address"); setShowUpdatePopup(true); }}>
//         ✏️
//         </button>
//       </p>

//       <p><b>District:</b> {owner.district}
//         <button onClick={() => { setSelectedField("district"); setShowUpdatePopup(true); }}>
//         ✏️
//         </button>
//       </p>

//       <p><b>Mandal:</b> {owner.mandal}
//         <button onClick={() => { setSelectedField("mandal"); setShowUpdatePopup(true); }}>
//         ✏️
//         </button>
//       </p>

//       <p><b>Pincode:</b> {owner.pincode}
//         <button onClick={() => { setSelectedField("pincode"); setShowUpdatePopup(true); }}>
//         ✏️
//         </button>
//       </p>
//         <p><b>Registered:</b> {owner.registered ? "Yes" : "No"}</p>
//       </div>

//       {/* Change Password Button */}
//       <button
//         onClick={() => setShowPasswordPopup(true)}
//         style={{
//           marginTop: "18px",
//           padding: "10px 18px",
//           backgroundColor: "#457b9d",
//           color: "white",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer",
//           fontWeight: "bold"
//         }}
//       >
//         Change Password 🔁
//       </button>

//       {/* Password Change Popup */}
//       {showPasswordPopup && (
//         <div style={{
//           position: "fixed",
//           top: 0, left: 0, width: "100vw", height: "100vh",
//           background: "rgba(0,0,0,0.5)",
//           display: "flex", justifyContent: "center", alignItems: "center"
//         }}>
//           <div style={{
//             background: "white",
//             padding: "25px",
//             borderRadius: "8px",
//             width: "350px"
//           }}>
//             <h3 style={{ marginBottom: "10px" }}>Change Password</h3>

//             <input
//               type="password"
//               placeholder="Old Password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
//             />

//             <input
//               type="password"
//               placeholder="Confirm New Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
//             />

//             <button
//               onClick={handleChangePassword}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 backgroundColor: "#1d3557",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//                 marginBottom: "10px"
//               }}
//             >
//               Update Password
//             </button>

//             <button
//               onClick={() => setShowPasswordPopup(false)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 backgroundColor: "#e63946",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: "pointer"
//               }}
//             >
//               Cancel ❌
//             </button>
//           </div>
//         </div>
//       )}
//       {showUpdatePopup && (
//   <div style={{
//     position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//     background: "rgba(0,0,0,0.5)", display: "flex",
//     justifyContent: "center", alignItems: "center"
//   }}>
//     <div style={{ background: "white", padding: "25px", borderRadius: "8px", width: "350px" }}>
//       <h3>Update {selectedField}</h3>
//       <input
//         type="text"
//         value={newValue}
//         onChange={(e) => setNewValue(e.target.value)}
//         style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
//       />
//       <button
//         onClick={async () => {
//           try {
//             const res = await axios.put(
//               `http://localhost:8083/api/owners/update-field/${state.id}?field=${selectedField}&value=${newValue}`
//             );
//             setOwner(res.data);
//             alert("Updated successfully!");
//             setShowUpdatePopup(false);
//           } catch (err) {
//             alert("Update failed");
//           }
//         }}
//         style={{
//           width: "100%", padding: "10px",
//           backgroundColor: "#1d3557", color: "white",
//           border: "none", borderRadius: "6px",
//           cursor: "pointer", fontWeight: "bold"
//         }}
//       >
//         Update
//       </button>

//       <button
//         onClick={() => setShowUpdatePopup(false)}
//         style={{
//           width: "100%", padding: "8px", backgroundColor: "#e63946",
//           color: "white", border: "none", borderRadius: "6px",
//           cursor: "pointer", marginTop: "10px"
//         }}
//       >
//         Cancel ❌
//       </button>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default OwnerProfile;
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const OwnerProfile = () => {
  const { t } = useTranslation("ownerProfile");

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [newValue, setNewValue] = useState("");

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const state = useOutletContext();

  /* 🔐 Protect route */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state) navigate("/");
    }, 300);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  /* 📦 Fetch owner profile */
  useEffect(() => {
    if (!state) return;

    const fetchOwner = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8083/api/owners/profile/${state.id}`
        );
        setOwner(res.data);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [state]);

  /* 🔑 Change password */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert(t("password.required"));
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(t("password.mismatch"));
      return;
    }

    try {
      await axios.put(
        `http://localhost:8083/api/owners/change-password/${state.id}`,
        { oldPassword, newPassword }
      );

      alert(t("password.success"));
      setShowPasswordPopup(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data || t("password.failed"));
    }
  };

  /* ⏳ States */
  if (loading) return <h2>{t("loading")}</h2>;
  if (!owner) return <h2>{t("not_found")} {state?.id}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{t("title")}</h1>

        <button
          onClick={() => {
            localStorage.removeItem("ownerState");
            navigate("/");
          }}
          style={{
            padding: "8px 15px",
            backgroundColor: "#e63946",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {t("buttons.logout")}
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">
        <p><b>{t("labels.name")}:</b> {owner.name}</p>

        <p>
          <b>{t("labels.phone")}:</b> {owner.phone}
          <button onClick={() => { setSelectedField("phone"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.business")}:</b> {owner.businessName}
          <button onClick={() => { setSelectedField("businessName"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.address")}:</b> {owner.address}
          <button onClick={() => { setSelectedField("address"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.district")}:</b> {owner.district}
          <button onClick={() => { setSelectedField("district"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.mandal")}:</b> {owner.mandal}
          <button onClick={() => { setSelectedField("mandal"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.pincode")}:</b> {owner.pincode}
          <button onClick={() => { setSelectedField("pincode"); setShowUpdatePopup(true); }}>✏️</button>
        </p>

        <p>
          <b>{t("labels.registered")}:</b>{" "}
          {owner.registered ? t("yes") : t("no")}
        </p>
      </div>

      {/* CHANGE PASSWORD */}
      <button
        onClick={() => setShowPasswordPopup(true)}
        style={{
          marginTop: "18px",
          padding: "10px 18px",
          backgroundColor: "#457b9d",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {t("buttons.change_password")}
      </button>

      {/* PASSWORD POPUP */}
      {showPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{t("password.title")}</h3>

            <input
              type="password"
              placeholder={t("password.old")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t("password.new")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t("password.confirm")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleChangePassword}>
              {t("password.update")}
            </button>

            <button onClick={() => setShowPasswordPopup(false)}>
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* UPDATE FIELD POPUP */}
      {showUpdatePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{t("update_popup.title")} {selectedField}</h3>

            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />

            <button
              onClick={async () => {
                try {
                  const res = await axios.put(
                    `http://localhost:8083/api/owners/update-field/${state.id}?field=${selectedField}&value=${newValue}`
                  );
                  setOwner(res.data);
                  alert(t("alerts.update_success"));
                  setShowUpdatePopup(false);
                } catch {
                  alert(t("alerts.update_failed"));
                }
              }}
            >
              {t("buttons.update")}
            </button>

            <button onClick={() => setShowUpdatePopup(false)}>
              {t("buttons.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;
