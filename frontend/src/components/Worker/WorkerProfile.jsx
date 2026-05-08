import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WorkerProfile.css";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "http://localhost:8083/api";

const WorkerProfile = () => {
  const { t } = useTranslation("workerProfile");
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state || JSON.parse(localStorage.getItem("workerState"));

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [newValue, setNewValue] = useState("");

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [message, setMessage] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state) navigate("/");
    }, 300);
    return () => clearTimeout(timer);
  }, [state, navigate]);

 
  const { data: worker, isLoading } = useQuery({
    queryKey: ["workerProfile", state?.id],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/users/profile/${state.id}`
      );
      return res.data;
    },
    enabled: !!state?.id,
  });

 
  const updateFieldMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.put(
        `${API_BASE}/users/update-field/${state.id}?field=${selectedField}&value=${(newValue)}`
      );
      return res.data;
    },
    onSuccess: (updatedWorker) => {
      queryClient.setQueryData(
        ["workerProfile", state?.id],
        updatedWorker
      );
      alert(t("alerts.update_success"));
      setShowUpdatePopup(false);
    },
    onError: () => {
      alert(t("alerts.update_failed"));
    },
  });


  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return axios.put(
        `${API_BASE}/users/change-password/${state.id}`,
        { oldPassword, newPassword }
      );
    },
    onSuccess: () => {
      alert(t("alerts.password_success"));
      setShowPasswordPopup(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      alert(err.response?.data || t("alerts.password_failed"));
    },
  });

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert(t("alerts.all_fields_required"));
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(t("alerts.password_mismatch"));
      return;
    }

    changePasswordMutation.mutate();
  };

  if (isLoading) return <h2>{t("loading")}</h2>;
  if (!worker) return <h2>{t("not_found")}</h2>;


  return (

  <div className="worker-profile-container">
 
      <div className="profile-header">
        <div className="header-content">
          <div className="profile-avatar">
            <span>{worker.name?.charAt(0).toUpperCase() || "W"}</span>
          </div>
          <div className="header-info">
            <h1 className="profile-title">{t("title")}</h1>
            <p className="profile-subtitle">{t("Manage")}</p>
          </div>
        </div>
        <button className="logout-btn"  onClick={() => {
            localStorage.removeItem("workerState");
            navigate("/");
          }} title="Logout">
          {t("logout")}
        </button>
      </div>

      {message && (
        <div className={`status-message ${message.includes("✅") ? t("success") : message.includes("❌") ? t("error") : t("warning")}`}>
          {message}
        </div>
      )}

      
      <div className="profile-grid">
     
        <div className="profile-section">
          <h2 className="section-title"> {t("Personal Information")}</h2>
          <p className="section-title"><b>{t("fields.name")}:</b> {worker.name}</p>
          <div className="fields-grid">
             {[
                ["phone", worker.phone],
                ["businessName", worker.businessName],
                ["address", worker.address],
                ["district", worker.district],
                ["mandal", worker.mandal],
                ["pincode", worker.pincode]
              ].map(([field, value]) => (
            <div key={field}>
              <span className="field-value">{t(`fields.${field}`)}:</span>
  <span className="field-label">{value}</span>
              <button
              className="edit-field-btn"
                onClick={() => {
                  setSelectedField(field);
                  setNewValue(value || "");
                  setShowUpdatePopup(true);
                }}
              >
                ✏️
              </button>
            </div>
          ))}

          <p>
            <b>{t("fields.registered")}:</b>{" "}
            {worker.registered ? t("yes") : t("no")}
          </p>
        </div>
        </div>
        </div>


 
        <div className="profile-section full-width">
          <h2 className="section-title"> {t("Account Settings")}</h2>
          <div className="account-settings">
            <div className="setting-item">
              <div className="setting-info">
                <h3>{t("Password Protection")}</h3>
                <p>{t("Update")}</p>
              </div>
              <button
                className="action-btn primary"
                onClick={() => setShowPasswordPopup(true)}
              >
                {t("Change Password")} 
              </button>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>{t("Account Status")}</h3>
                <p>{t("Your account is")} {worker.registered ? t("Registered") : t("Not Registered")}</p>
              </div>
            </div>
          </div>
        </div>
   

    
      {showUpdatePopup && (
        <div className="modal-overlay" onClick={() => setShowUpdatePopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("update_field")} {selectedField}</h3>
              <button className="close-btn" onClick={() => setShowUpdatePopup(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder={`Enter new ${selectedField}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="modal-input"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowUpdatePopup(false)}>
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={() => updateFieldMutation.mutate()}>
                {t("update")}
              </button>
            </div>
          </div>
        </div>
      )}

   
      {showPasswordPopup && (
        <div className="modal-overlay" onClick={() => setShowPasswordPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("change_password")}</h3>
              <button className="close-btn" onClick={() => setShowPasswordPopup(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="password"
                placeholder={t("placeholders.old_password")}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="modal-input"
                autoFocus
              />
              <input
                type="password"
                placeholder={t("placeholders.new_password")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="modal-input"
              />
              <input
                type="password"
                placeholder={t("placeholders.confirm_password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPasswordPopup(false)}>
                   {t("cancel")}
              </button>
              <button className="btn-primary" onClick={handleChangePassword}>
                {t("update_password")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;