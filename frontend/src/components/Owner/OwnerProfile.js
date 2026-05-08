import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:8083/api";

const OwnerProfile = () => {
  const { t } = useTranslation("ownerProfile");
  const navigate = useNavigate();
  const state = useOutletContext();
  const queryClient = useQueryClient();

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [newValue, setNewValue] = useState("");

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state) navigate("/");
    }, 300);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  
  const fetchOwner = async () => {
    const res = await axios.get(
      `${API_BASE}/owners/profile/${state.id}`
    );
    return res.data;
  };

  const {
    data: owner,
    isLoading
  } = useQuery({
    queryKey: ["ownerProfile", state?.id],
    queryFn: fetchOwner,
    enabled: !!state?.id
  });


  const updateFieldMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${API_BASE}/owners/update-field/${state.id}?field=${selectedField}&value=${newValue}`
      ),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ["ownerProfile", state?.id],
        res.data
      );
      alert(t("alerts.update_success"));
      setShowUpdatePopup(false);
      setNewValue("");
    },
    onError: () => {
      alert(t("alerts.update_failed"));
    }
  });

 
  const changePasswordMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${API_BASE}/owners/change-password/${state.id}`,
        { oldPassword, newPassword }
      ),
    onSuccess: () => {
      alert(t("password.success"));
      setShowPasswordPopup(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      alert(err.response?.data || t("password.failed"));
    }
  });

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert(t("password.required"));
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(t("password.mismatch"));
      return;
    }

    changePasswordMutation.mutate();
  };

  if (isLoading) return <h2>{t("loading")}</h2>;
  if (!owner) return <h2>{t("not_found")} {state?.id}</h2>;

  return (
    <div style={{ padding: "20px" }}>
    
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

      
      <div className="profile-card">
        <p><b>{t("labels.name")}:</b> {owner.name}</p>

        {[
          ["phone", owner.phone],
          ["business", owner.businessName],
          ["address", owner.address],
          ["district", owner.district],
          ["mandal", owner.mandal],
          ["pincode", owner.pincode]
        ].map(([field, value]) => (
          <p key={field}>
            <b>{t(`labels.${field}`)}:</b> {value}
            <button
              onClick={() => {
                setSelectedField(field);
                setNewValue(value);
                setShowUpdatePopup(true);
              }}
            >
              ✏️
            </button>
          </p>
        ))}

        <p>
          <b>{t("labels.registered")}:</b>{" "}
          {owner.registered ? t("yes") : t("no")}
        </p>
      </div>

     
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


      {showUpdatePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{t("update_popup.title")} {selectedField}</h3>

            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />

            <button onClick={() => updateFieldMutation.mutate()}>
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