import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://admin.asbfashion.com/glamour_gate";

function CustomerForm() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [details, setDetails] = useState({
    name: "",
    address: "",
    nic: "",
    dob: "",
    gender: "",
  });

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Colombo" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ======================= VALIDATION HELPERS =======================
  const isValidSLPhone = (num) => /^947[0-9]{8}$/.test(num);
  const isValidSLNic = (nic) => /^[0-9]{9}[VvXx]$/.test(nic) || /^[0-9]{12}$/.test(nic);

  const getBirthdayFromNIC = (nic) => {
    let year, days;
    if (nic.length === 10) {
      year = parseInt("19" + nic.substring(0, 2));
      days = parseInt(nic.substring(2, 5));
    } else if (nic.length === 12) {
      year = parseInt(nic.substring(0, 4));
      days = parseInt(nic.substring(4, 7));
    } else return null;
    if (days > 500) days -= 500;
    let date = new Date(year, 0);
    date.setDate(days);
    return date.toISOString().split("T")[0];
  };

  const getGenderFromNIC = (nic) => {
    if (!isValidSLNic(nic)) return "";
    let days = nic.length === 10 ? parseInt(nic.substring(2, 5)) : parseInt(nic.substring(4, 7));
    return days > 500 ? "Female" : "Male";
  };

  const handleNICChange = (nicValue) => {
    nicValue = nicValue.trim().toUpperCase();
    const gender = getGenderFromNIC(nicValue);
    setDetails({ ...details, nic: nicValue, gender: gender });
    if (nicValue && !isValidSLNic(nicValue)) {
      setError("Invalid NIC format! Use 9 digits + V/X or 12 digits.");
    } else {
      setError("");
    }
  };

  const validateMatch = () => {
    if (!details.nic || !details.dob) {
      setError("Please fill both NIC and Birthday.");
      return false;
    }
    if (!isValidSLNic(details.nic)) {
      setError("Please enter a valid Sri Lankan NIC.");
      return false;
    }
    const nicBirthday = getBirthdayFromNIC(details.nic);
    if (nicBirthday !== details.dob) {
      setError(`Birthday mismatch! According to NIC, your birthday is ${nicBirthday}.`);
      return false;
    }
    setError("");
    return true;
  };

  // Social media button handlers
  const handleSocialClick = (platform) => {
    const socialLinks = {
      facebook: "https://www.facebook.com/asbglamourgate",
      instagram: "https://www.instagram.com/glamourgatelk/",
      tiktok: "https://www.tiktok.com/@glamourgatelk?is_from_webapp=1&sender_device=pc"
    };
    window.open(socialLinks[platform], "_blank");
  };

  // ======================= API CALLS =======================
  const sendOTP = async () => {
    setError("");
    if (!isValidSLPhone(phone)) {
      setError("Phone must be 11 digits starting with 947 (e.g., 94771234567)");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/send_otp.php`, { phone });
      if (res.data.success) setStep(2);
      else setError(res.data.message);
    } catch (err) {
      setError("Network Error. Please try again.");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setError("");
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/verify_otp.php`, { phone, otp });
      if (res.data.status === "verified") setStep(3);
      else setError(res.data.message || "Invalid OTP");
    } catch (err) {
      setError("Verification failed");
    }
    setLoading(false);
  };

  const submitFinalData = async () => {
    if (!details.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!details.address.trim()) {
      setError("Address is required");
      return;
    }
    if (!isValidSLNic(details.nic)) {
      setError("Valid NIC is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/save_details.php`, { phone, ...details });
      if (res.data.success) setSuccess(true);
      else setError(res.data.message);
    } catch (err) {
      setError("Failed to save data");
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setDetails({ name: "", address: "", nic: "", dob: "", gender: "" });
    setError("");
    setSuccess(false);
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full glass-card rounded-3xl p-8 text-center animate-fade-up">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <i className="fas fa-check-circle text-5xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            Welcome to Glamour Gate!
          </h2>
          <p className="text-gray-300 mb-6">Your details have been saved successfully.</p>
          <button onClick={handleSignOut} className="btn-primary flex items-center justify-center gap-2">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      {/* Main Card */}
      <div className="w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 animate-fade-up">
        
        {/* Header with Larger Logo */}
<div className="relative bg-gradient-to-r from-[#001d3d] to-[#000b1a] px-6 py-5 border-b border-cyan-500/30">
  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
  <div className="flex justify-between items-center flex-wrap gap-3 relative z-10">
    <div className="flex items-center gap-4">
      {/* Logo with different corner options */}
      <div className="relative group">
        {/* Option 1: Slightly rounded corners (rounded-lg) */}
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg ring-2 ring-cyan-400/50 group-hover:ring-cyan-400 transition-all duration-300">
          <img 
            src="/assets/logo.png" 
            alt="Glamour Gate Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<i class="fas fa-crown text-2xl text-white"></i>';
            }}
          />
        </div>
        
        {/* Option 2: Fully rounded (rounded-full) - Uncomment to use */}
        {/* <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
          <img 
            src="/assets/logo.png" 
            alt="Glamour Gate Logo" 
            className="w-full h-full object-cover"
          />
        </div> */}
        
        {/* Option 3: Only top corners rounded */}
        {/* <div className="w-14 h-14 rounded-t-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
          <img 
            src="/assets/logo.png" 
            alt="Glamour Gate Logo" 
            className="w-full h-full object-cover"
          />
        </div> */}
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          GLAMOUR GATE
        </h1>
        <p className="text-cyan-300/80 text-xs mt-1">
          <i className="fas fa-map-marker-alt mr-1"></i> Negombo • The Fashion Landmark in Sri Lanka
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-xs text-gray-400">Local Time</p>
        <p className="text-sm font-mono text-cyan-300 font-semibold">{currentTime}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-xl text-white transition flex items-center gap-1 border border-white/20"
        aria-label="Sign out"
      >
        <i className="fas fa-sign-out-alt"></i> Exit
      </button>
    </div>
  </div>
</div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6 bg-red-500/20 border-l-4 border-red-500 text-red-200 p-4 rounded-xl backdrop-blur-sm animate-shake flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-red-200 hover:text-white" aria-label="Close error">
              ×
            </button>
          </div>
        )}

        {/* Step Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`step-dot ${step > s ? 'step-completed' : step === s ? 'step-active' : 'step-pending'}`}>
                  {step > s ? <i className="fas fa-check text-xs"></i> : s}
                </div>
                {s < 4 && <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-white/20'}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8">
          {/* Step 1: Phone */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h3>
                <p className="text-gray-400">Enter your mobile number to receive OTP</p>
              </div>
              <div className="relative">
                <i className="fas fa-phone-alt absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
                <input
                  type="tel"
                  placeholder="94771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="input-modern pl-12"
                  aria-label="Phone number"
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                <i className="fas fa-info-circle mr-1"></i> Enter 11 digits starting with 947
              </p>
              <button onClick={sendOTP} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? <div className="spinner"></div> : <i className="fas fa-paper-plane"></i>}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h3>
                <p className="text-gray-400">We've sent a 6-digit OTP to {phone}</p>
              </div>
              <input
                type="text"
                maxLength="6"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
                aria-label="OTP code"
              />
              <button onClick={verifyOTP} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? <div className="spinner"></div> : <i className="fas fa-check-circle"></i>}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button onClick={() => setStep(1)} className="btn-secondary flex items-center justify-center gap-2">
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
                <p className="text-gray-400">Please fill your details accurately</p>
              </div>
              
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
                <input type="text" placeholder="Full Name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="input-modern pl-12" aria-label="Full name" />
              </div>
              
              <div className="relative">
                <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
                <input type="text" placeholder="NIC Number (e.g., 199512345678 or 951234567V)" value={details.nic} onChange={(e) => handleNICChange(e.target.value)} className="input-modern pl-12" aria-label="NIC number" />
              </div>
              <p className="text-xs text-gray-400 -mt-2">Old: 9 digits + V/X | New: 12 digits</p>
              
              <div className="relative">
                <i className="fas fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"></i>
                <input type="date" value={details.dob} onChange={(e) => setDetails({ ...details, dob: e.target.value })} className="input-modern pl-12" aria-label="Date of birth" />
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <i className={`fas ${details.gender === "Female" ? "fa-venus-mars text-pink-400" : "fa-mars text-cyan-400"} text-xl`}></i>
                  <span className="text-gray-300">Gender:</span>
                  <span className={`font-semibold ${details.gender === "Female" ? "text-pink-400" : "text-cyan-400"}`}>
                    {details.gender || "Auto-detect from NIC"}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <i className="fas fa-home absolute left-4 top-4 text-cyan-400"></i>
                <textarea rows="2" placeholder="Your Complete Address" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} className="input-modern pl-12 pt-3" aria-label="Address"></textarea>
              </div>
              
              <button onClick={() => { if (validateMatch()) setStep(4); }} className="btn-primary flex items-center justify-center gap-2">
                <i className="fas fa-shield-alt"></i> Review & Match Details
              </button>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fas fa-id-card text-cyan-400"></i> Verified Identity
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Name", value: details.name, icon: "fa-user" },
                    { label: "NIC", value: details.nic, icon: "fa-id-card" },
                    { label: "Gender", value: details.gender, icon: details.gender === "Female" ? "fa-venus-mars" : "fa-mars", color: details.gender === "Female" ? "text-pink-400" : "text-cyan-400" },
                    { label: "Birthday", value: details.dob, icon: "fa-calendar" },
                    { label: "Phone", value: phone, icon: "fa-phone" },
                    { label: "Address", value: details.address, icon: "fa-home" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-wrap justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400 text-sm flex items-center gap-2"><i className={`fas ${item.icon} text-cyan-400`}></i> {item.label}:</span>
                      <strong className={`text-white text-right ${item.color || ''}`}>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <button onClick={submitFinalData} disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {loading ? <div className="spinner"></div> : <i className="fas fa-check-double"></i>}
                  {loading ? "Submitting..." : "Confirm & Submit"}
                </button>
                <button onClick={() => setStep(3)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <i className="fas fa-edit"></i> Edit Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Social Buttons (Fixed - now using buttons instead of anchor tags) */}
        <div className="border-t border-white/10 px-6 py-4 bg-black/20">
          <div className="flex flex-wrap justify-between items-center gap-3 text-sm">
            <div className="flex gap-5">
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="text-cyan-300 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1"
                aria-label="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </button>
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="text-cyan-300 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </button>
              <button 
                onClick={() => handleSocialClick('tiktok')}
                className="text-cyan-300 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1"
                aria-label="Follow us on TikTok"
              >
                <i className="fab fa-tiktok text-lg"></i>
              </button>
              <button 
                onClick={() => handleSocialClick('twitter')}
                className="text-cyan-300 hover:text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1"
                aria-label="Follow us on Twitter"
              >
                <i className="fab fa-twitter text-lg"></i>
              </button>
            </div>
            <div className="text-gray-400 text-xs text-center">
              <p>© 2026 Glamour Gate Negombo • The Fashion Landmark in Sri Lanka</p>
              <p className="mt-1">📧 info.asbfashion.com | 📞 94719057059</p>
              <p className="text-[10px] text-gray-500 mt-1">Developed by Vexel It • Kavizz</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;