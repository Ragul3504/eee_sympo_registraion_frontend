import React, { useState } from "react";
import "./App.css";
import { Mail, Smartphone, User } from "lucide-react";

const soloEventPrice = 300;
const teamEventPrice = 300;

function App() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    year: "",
    mobile: "",
    email: "",
    eventType: "solo",
    teamEvent: "",
    teamSize: "",
    totalAmount: soloEventPrice,
  });

  const [qrCodeURL, setQRCodeURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedAmount = soloEventPrice;

    if (name === "eventType" && value === "team") {
      updatedAmount = teamEventPrice;
    }
    if (name === "teamEvent") {
      setFormData((prevData) => ({
        ...prevData,
        teamSize: "", // Reset team size when switching event type
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      totalAmount: updatedAmount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.college || !formData.department || !formData.year || !formData.mobile || !formData.email) {
      alert("Please fill all fields.");
      return;
    }
    if (formData.eventType === "team" && !formData.teamEvent) {
      alert("Please select either PPT or Project Expo for team participation.");
      return;
    }
    if (formData.eventType === "team" && !formData.teamSize) {
      alert("Please select a valid team size.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("https://electryonz25.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setQRCodeURL(data.qrCodeURL);
        alert("Registration successful! Scan the QR code to complete the payment.");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Electryonz'25</h1>
      <h1>Technical Symposium Registration</h1>
      <div className="event-instructions">
        <h3>Event Instructions</h3>
        <p>Solo Payment: Pay ₹300 and participate in all events.</p>
        <p>Team Payment (PPT, Project Expo): Pay ₹300 per team. Participate in either PPT or Project Expo only.</p>
        <p>PPT: 2-3 members | Project Expo: 2-4 members.</p>
      </div>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name: <User className="icon" /></label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>College:</label>
          <input type="text" name="college" value={formData.college} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Year:</label>
          <select name="year" value={formData.year} onChange={handleInputChange} required>
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="form-group">
          <label>Mobile Number: <Smartphone className="icon" /></label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email ID: <Mail className="icon" /></label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Participation Type:</label>
          <select name="eventType" value={formData.eventType} onChange={handleInputChange} required>
            <option value="solo">Solo</option>
            <option value="team">Team</option>
          </select>
        </div>
        {formData.eventType === "team" && (
          <>
            <div className="form-group">
              <label>Select Team Event:</label>
              <select name="teamEvent" value={formData.teamEvent} onChange={handleInputChange} required>
                <option value="">Select Event</option>
                <option value="ppt">PPT (2-3 members)</option>
                <option value="project-expo">Project Expo (2-4 members)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Team Size:</label>
              <select name="teamSize" value={formData.teamSize} onChange={handleInputChange} required>
                <option value="">Select Team Size</option>
                {formData.teamEvent === "ppt" && (
                  <>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                  </>
                )}
                {formData.teamEvent === "project-expo" && (
                  <>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                  </>
                )}
              </select>
            </div>
          </>
        )}
        <div className="form-group">
          <h3>Total Amount: ₹{formData.totalAmount}</h3>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Pay with UPI"}
        </button>
      </form>
      {qrCodeURL && (
        <div className="qr-code-section">
          <h3>Scan this QR Code to Complete Payment:</h3>
          <img src={qrCodeURL} alt="Google Pay QR Code" style={{ width: "200px", height: "200px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
