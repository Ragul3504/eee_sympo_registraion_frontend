import React, { useState } from "react";
import "./App.css";
import { Mail, Smartphone, User } from "lucide-react";

const technicalEvents = [
  { id: 1, name: "Paper Presentation", price: 200 },
  { id: 2, name: "Project Expo", price: 300 },
  { id: 3, name: "Technical Quiz", price: 150 },
  { id: 4, name: "Tech Puzzles", price: 400 },
  { id: 5, name: "Coding Wizard", price: 350 },
  { id: 6, name: "Circuit Debugging", price: 250 },
];

const nonTechnicalEvents = [
  { id: 7, name: "Chess Champions", price: 200 },
  { id: 8, name: "Carrom ", price: 150 },
  { id: 9, name: "IPL Auction", price: 300 },
  { id: 10, name: "Free Fire", price: 200 },
  { id: 11, name: "", price: 250 },
  { id: 12, name: "Dance", price: 200 },
];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    year: "",
    mobile: "",
    email: "",
    selectedEvents: [],
    totalAmount: 0,
  });

  const [qrCodeURL, setQRCodeURL] = useState(""); // State to store QR code URL
  const [loading, setLoading] = useState(false);

  const eventFeeThreshold = 3; // Discount threshold
  const discountRate = 0.1; // 10% discount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEventSelection = (event) => {
    const selectedEvent =
      technicalEvents.concat(nonTechnicalEvents).find((ev) => ev.id === parseInt(event.target.value));
    const isSelected = formData.selectedEvents.find((ev) => ev.id === selectedEvent.id);

    if (isSelected) {
      setFormData((prevData) => ({
        ...prevData,
        selectedEvents: prevData.selectedEvents.filter((ev) => ev.id !== selectedEvent.id),
        totalAmount: prevData.totalAmount - selectedEvent.price,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        selectedEvents: [...prevData.selectedEvents, selectedEvent],
        totalAmount: prevData.totalAmount + selectedEvent.price,
      }));
    }
  };

  const calculateDiscountedAmount = () => {
    const baseAmount = formData.totalAmount;
    if (formData.selectedEvents.length >= eventFeeThreshold) {
      return baseAmount - baseAmount * discountRate;
    }
    return baseAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = calculateDiscountedAmount();

    // Basic validation
    if (
      !formData.name ||
      !formData.college ||
      !formData.department ||
      !formData.year ||
      !formData.mobile ||
      !formData.email ||
      formData.selectedEvents.length === 0
    ) {
      alert("Please fill all the fields and select at least one event.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, totalAmount: finalAmount }),
      });

      if (response.ok) {
        const data = await response.json();
        setQRCodeURL(data.qrCodeURL); // Receive QR Code URL from the backend
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
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name: <User className="icon" />
          </label>
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
          <label>
            Mobile Number: <Smartphone className="icon" />
          </label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>
            Email ID: <Mail className="icon" />
          </label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Technical Events:</label>
          <div className="events-list">
            {technicalEvents.map((event) => (
              <div key={event.id}>
                <input
                  type="checkbox"
                  id={`event-${event.id}`}
                  value={event.id}
                  onChange={handleEventSelection}
                />
                <label htmlFor={`event-${event.id}`}>
                  {event.name} - ₹{event.price}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Non-Technical Events:</label>
          <div className="events-list">
            {nonTechnicalEvents.map((event) => (
              <div key={event.id}>
                <input
                  type="checkbox"
                  id={`event-${event.id}`}
                  value={event.id}
                  onChange={handleEventSelection}
                />
                <label htmlFor={`event-${event.id}`}>
                  {event.name} - ₹{event.price}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <h3>
            Total Amount: ₹{formData.totalAmount} (After Discount: ₹{calculateDiscountedAmount()})
          </h3>
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
    </div>
  );
}

export default App;
