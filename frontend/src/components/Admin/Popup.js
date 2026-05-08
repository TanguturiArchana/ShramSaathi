import { useState } from "react";
import "./Popup.css";
import WorkerLoginPopup from "./WorkerLoginPopup";
import OwnerLoginPopup from "./OwnerLoginPopup";
import API from "./api";
import { useTranslation } from "react-i18next";

const Popup = ({ onClose }) => {
  const { t } = useTranslation("popup");

  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWorkerLogin, setShowWorkerLogin] = useState(false);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [workType, setWorkType] = useState("");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [pincode, setPincode] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [isAfterRegister, setIsAfterRegister] = useState(false);
  const [isAfterWorkerRegister, setIsAfterWorkerRegister] = useState(false);

  const lang = localStorage.getItem("lang") || "en";

  

  const workerData = {
    name,
    phone,
    address,
    workType,
    district,
    mandal,
    pincode,
    age,
    experience,
    preferredLanguage: lang
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/register/user", workerData);
      const password = res.data.split(": ").pop();
      setGeneratedPassword(password);
      setShowSuccess("worker");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

 

  const [ownerData, setOwnerData] = useState({
    name: "",
    phone: "",
    address: "",
    businessName: "",
    district: "",
    mandal: "",
    pincode: "",
    preferredLanguage: lang
  });

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/register/owner", ownerData);
      setName(ownerData.name);
      const password = res.data.split(": ").pop();
      setGeneratedPassword(password);
      setShowSuccess("owner");
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };



  if (showWorkerLogin) {
    return (
      <WorkerLoginPopup
        onClose={onClose}
        name={name}
        phone={phone}
        isAfterWorkerRegister={isAfterWorkerRegister}
      />
    );
  }

  if (showOwnerLogin) {
    return (
      <OwnerLoginPopup
        onClose={onClose}
        name={name}
        phone={ownerData.phone}
        isAfterRegister={isAfterRegister}
      />
    );
  }



  if (showSuccess) {
    return (
      <div className="popup-overlay">
        <div className="popup-box">
          <h2>{t("popup.success_title")}</h2>
          <p>
            {t("popup.password_msg")} <b>{generatedPassword}</b>
            <br />
            {t("popup.username")}: <b>{name}</b>
          </p>
          <button
            className="btn-primary"
            onClick={() =>
              showSuccess === "worker"
                ? setShowWorkerLogin(true)
                : setShowOwnerLogin(true)
            }
          >
            {t("popup.login")}
          </button>
        </div>
      </div>
    );
  }

 

  if (showWorkerForm) {
    return (
      <div className="popup-overlay">
        <div className="popup-box form-box">
          <h2>{t("popup.register_worker")}</h2>
          <form onSubmit={handleWorkerSubmit}>
            <input placeholder={t("popup.name")} required onChange={(e) => setName(e.target.value)} />
            <input placeholder={t("popup.phone")} required onChange={(e) => setPhone(e.target.value)} />
            <input placeholder={t("popup.address")} required onChange={(e) => setAddress(e.target.value)} />
            <input placeholder={t("popup.work_type")} required onChange={(e) => setWorkType(e.target.value)} />
            <input placeholder={t("popup.district")} required onChange={(e) => setDistrict(e.target.value)} />
            <input placeholder={t("popup.mandal")} required onChange={(e) => setMandal(e.target.value)} />
            <input placeholder={t("popup.pincode")} required onChange={(e) => setPincode(e.target.value)} />
            <input placeholder={t("popup.age")} required onChange={(e) => setAge(e.target.value)} />
            <input placeholder={t("popup.experience")} required onChange={(e) => setExperience(e.target.value)} />

            <button type="submit" className="btn-primary" onClick={() => setIsAfterWorkerRegister(true)}>
              {t("popup.register")}
            </button>

            <button type="button" className="btn-primary" onClick={() => setShowWorkerLogin(true)}>
              {t("popup.login")}
            </button>
          </form>

          <button className="btn-close" onClick={onClose}>
            {t("popup.close")}
          </button>
        </div>
      </div>
    );
  }


  if (showOwnerForm) {
    return (
      <div className="popup-overlay">
        <div className="popup-box form-box">
          <h2>{t("popup.register_owner")}</h2>
          <form onSubmit={handleOwnerSubmit}>
            <input placeholder={t("popup.name")} required onChange={(e) => setOwnerData({ ...ownerData, name: e.target.value })} />
            <input placeholder={t("popup.phone")} required onChange={(e) => setOwnerData({ ...ownerData, phone: e.target.value })} />
            <input placeholder={t("popup.email")} required onChange={(e) => setOwnerData({ ...ownerData, address: e.target.value })} />
            <input placeholder={t("popup.business_name")} required onChange={(e) => setOwnerData({ ...ownerData, businessName: e.target.value })} />
            <input placeholder={t("popup.district")} required onChange={(e) => setOwnerData({ ...ownerData, district: e.target.value })} />
            <input placeholder={t("popup.mandal")} required onChange={(e) => setOwnerData({ ...ownerData, mandal: e.target.value })} />
            <input placeholder={t("popup.pincode")} required onChange={(e) => setOwnerData({ ...ownerData, pincode: e.target.value })} />

            <button type="submit" className="btn-primary" onClick={() => setIsAfterRegister(true)}>
              {t("popup.register")}
            </button>

            <button type="button" className="btn-primary" onClick={() => setShowOwnerLogin(true)}>
              {t("popup.login")}
            </button>
          </form>

          <button className="btn-close" onClick={onClose}>
            {t("popup.close")}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{t("popup.login_register")}</h2>
        <p>{t("popup.select_role")}</p>

        <button className="btn-primary" onClick={() => setShowWorkerForm(true)}>
          {t("popup.login_worker")}
        </button>

        <button className="btn-success" onClick={() => setShowOwnerForm(true)}>
          {t("popup.login_owner")}
        </button>

        <button className="btn-close" onClick={onClose}>
          {t("popup.close")}
        </button>
      </div>
    </div>
  );
};

export default Popup;
