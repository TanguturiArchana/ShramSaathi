import { useState } from "react";
import { jobService } from "../../services/jobService";
import "./AddJobModal.css";
import "./JobManager.css";
import axios from "axios";
import { useTranslation } from "react-i18next";


const AddJobModal = ({ closeModal, onJobAdded ,id}) => {
  const { t } = useTranslation("addJob");

  const [form, setForm] = useState({
    title: "",
    skillNeeded: "",
    location: "",
    pay: "",
    duration: "",
    ownerId: id,
    status: "active",
    area: "",
    colony: "",
    state: "",
    pincode: "",
    ownerName: "",
    decisionDeadline: ""   // ✅ correct name matches backend Job.java
   });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  // Normalize numeric fields: pincode -> int
      const payload = { ...form };
          
      await axios.get(`http://localhost:8083/api/jobs/owner/${id}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

      if (payload.pincode === "") delete payload.pincode;
      else payload.pincode = parseInt(payload.pincode);
       if (payload.decisionDeadline === "") delete payload.decisionDeadline;

      await jobService.addJob(payload);
      onJobAdded();
      closeModal();
    } catch (err) {
      console.error("❌ Error creating job:", err);
      alert("Failed to create job. Check backend.");
    }
  };

  return (
    <div className="modal">
      <h3 className="modal-title">Add New Job</h3>
      <form onSubmit={handleSubmit}>
        <h3 className="modal-title">{t("title")}</h3>
        <input
          name="title"
          placeholder={t("fields.job_title")}
          value={form.title}
          onChange={handleChange}
          required
        />
        
        <input
          name="ownerName"
          placeholder={t("fields.owner_name")}
          value={form.ownerName}
          onChange={handleChange}
          required
        />
        
        <input
          type="date"
          name="decisionDeadline"
          value={form.decisionDeadline}
          onChange={handleChange}
          required
        />
        
        <input
          name="skillNeeded"
          placeholder={t("fields.skill_needed")}
          value={form.skillNeeded}
          onChange={handleChange}
          required
        />
        
        <input
          name="location"
          placeholder={t("fields.location")}
          value={form.location}
          onChange={handleChange}
          required
        />
        
        <input
          name="area"
          placeholder={t("fields.area")}
          value={form.area}
          onChange={handleChange}
        />
        
        <input
          name="colony"
          placeholder={t("fields.colony")}
          value={form.colony}
          onChange={handleChange}
        />
        
        <input
          name="state"
          placeholder={t("fields.state")}
          value={form.state}
          onChange={handleChange}
        />
        
        <input
          name="pincode"
          placeholder={t("fields.pincode")}
          value={form.pincode}
          onChange={handleChange}
        />
        
        <input
          name="pay"
          placeholder={t("fields.pay")}
          value={form.pay}
          onChange={handleChange}
          required
        />
        
        <input
          name="duration"
          placeholder={t("fields.duration")}
          value={form.duration}
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="save-btn">
          {t("buttons.save")}
        </button>
        
        <button type="button" className="cancel-btn" onClick={closeModal}>
          {t("buttons.cancel")}
        </button>


       
      </form>
    </div>
  );
};

export default AddJobModal;
