import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate sending (replace with real API call if backend endpoint is added)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Reset form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="simple-page">
      <div className="page-container">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-description">
          Get in touch with us for any questions, support, or feedback about your fitness journey.
        </p>
        <div className="simple-content">
          <div className="contact-info">
            <div className="contact-section">
              <h3>📧 Email Support</h3>
              <p>For technical support and general inquiries:</p>
              <a href="mailto:Ghostfitnesstrack@gmail.com" className="contact-link">
                ghostfitnesstrack@gmail.com
              </a>
            </div>

            <div className="contact-section">
              <h3>🏢 Ghost Fitness Center</h3>
              <p>Visit us Ghost Fitness Tracker</p>
              <p>Virudhachalam ,Cuddalore 638060</p>
              <p>Tamil Nadu, India</p>
            </div>

            <div className="contact-section">
              <h3>⏰ Office Hours</h3>
              <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
              <p>Saturday: 7:00 AM - 8:00 PM</p>
              <p>Sunday: 8:00 AM - 6:00 PM</p>
            </div>

            <div className="contact-section">
              <h3>📞 Phone Support</h3>
              <p>Fitness Program Inquiries: +91-4294-226555</p>
              <p>Technical Support: +91-4294-226666</p>
            </div>

            <div className="contact-section">
              <h3>💬 Live Chat</h3>
              <p>Get instant help through our live chat support during business hours.</p>
              <button className="btn btn-primary">Start Chat</button>
            </div>
          </div>

          <div className="contact-form-section">
            <h3>Send us a Message</h3>

            {/* Success / Error feedback */}
            {submitStatus === "success" && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(76, 175, 80, 0.15)",
                border: "1px solid #4CAF50",
                color: "#4CAF50",
                marginBottom: "16px",
                fontWeight: "500"
              }}>
                ✅ Message sent successfully! We'll get back to you within 24 hours. 💪
              </div>
            )}
            {submitStatus === "error" && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(244, 67, 54, 0.15)",
                border: "1px solid #F44336",
                color: "#F44336",
                marginBottom: "16px",
                fontWeight: "500"
              }}>
                ❌ Failed to send message. Please try again or email us directly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject *</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  placeholder="What is your message about?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "⏳ Sending..." : "📨 Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
