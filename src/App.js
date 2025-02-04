import React, { useState } from "react";
import "./App.css";
import { Mail, Smartphone, User } from "lucide-react";

const eventPrice = 300; // Fixed price for all events

function App() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    year: "",
    mobile: "",
    email: "",
    totalAmount: eventPrice,
  });

  const [qrCodeURL, setQRCodeURL] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.college || !formData.department || !formData.year || !formData.mobile || !formData.email) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://electryonz25.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);
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
      <h1>Electryonz'25 </h1>
      <h1>Technical Symposium Registration</h1>
      <p className="caption">You can participate in all the technical events.</p>
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
          <h3>Total Amount: ₹{eventPrice}</h3>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Pay with Google Pay"}
        </button>
      </form>

      {qrCodeURL && (
        <div className="qr-code-section">
          <h3>Scan this QR Code to Complete Payment:</h3>
          <img src={qrCodeURL} alt="Google Pay QR Code" style={{ width: "200px", height: "200px" }} />
        </div>
      )}

      <div className="offline-registration">
        <h3>Non-Technical Events Registration is Available Offline</h3>
        <p>Please visit the registration desk for non-technical event sign-ups.</p>
      </div>
    </div>
  );
}

export default App;
