// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import Webcam from "react-webcam";

// const VerifyAgent = ({ agentId }) => {
//   const [aadharImage, setAadharImage] = useState(null);
//   const [otp, setOtp] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [extractedCode, setExtractedCode] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const webcamRef = useRef(null);

//   // Fetch Aadhar image
//   useEffect(() => {
//     if (!agentId) return;
//     axios
//       .get(`http://localhost:5000/api/agent/get-aadhar/${agentId}`)
//       .then((res) => {
//         if (res.data && res.data.aadharCard) {
//           setAadharImage(res.data.aadharCard);
//         } else {
//           console.error("Aadhar image not found in response:", res.data);
//         }
//       })
//       .catch((err) => console.error("Error fetching Aadhar image:", err));
//   }, [agentId]);

//   // Fetch OTP from Python API
//   useEffect(() => {
//     if (!agentId) return;
//     axios
//       .post(
//         `http://127.0.0.1:5001/generate-otp`,
//         { agentId },
//         { withCredentials: true } // Ensuring CORS works properly
//       )
//       .then((res) => {
//         if (res.data && res.data.otp) {
//           setOtp(res.data.otp);
//         } else {
//           console.error("OTP not received:", res.data);
//         }
//       })
//       .catch((err) => console.error("Error generating OTP:", err));
//   }, [agentId]);

//   // Capture image from webcam
//   const captureImage = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//   };

//   // Send captured image for verification
//   const verifyAgent = async () => {
//     if (!capturedImage) {
//       alert("Please capture an image first!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5001/verify_live",
//         {
//           agentId,
//           image: capturedImage,
//           verification_code: otp, // Optional field for OCR verification
//         },
//         { withCredentials: true } // Ensuring CORS compatibility
//       );

//       setLoading(false);
//       setMessage(response.data.message);
//       setExtractedCode(response.data.extracted_code);

//       // Update verification status in Node.js backend if verification is successful
//       if (response.status === 200) {
//         await axios.post(
//           "http://localhost:5000/api/agent/update-verification",
//           { agentId, isIPV_Verified: true, ipv_otp: otp },
//           { withCredentials: true }
//         );
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Verification error:", error);
//       if (error.response && error.response.data) {
//         setMessage(error.response.data.message);
//         setExtractedCode(error.response.data.extracted_code);
//       } else {
//         setMessage("Verification failed due to network or server error.");
//       }
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl text-gray-50 font-bold">In-Person Verification</h2>
//       {aadharImage && otp && (
//         <div className="mb-4">
//           <p className="text-lg font-semibold">
//             Please write this code on paper and show it with your face:
//           </p>
//           <p className="text-2xl font-bold text-red-500">{otp}</p>
//           <img
//             src={`http://localhost:5000/uploads/${aadharImage}`}
//             alt="Aadhar"
//             className="w-48 h-48 border-2 rounded-lg mt-2"
//           />
//         </div>
//       )}
//       <div className="mt-4">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="border-2 rounded-lg w-64 h-48"
//         />
//         <button
//           onClick={captureImage}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Capture Image
//         </button>
//       </div>
//       {capturedImage && (
//         <div className="mt-4">
//           <p>Captured Image:</p>
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="w-48 h-48 border-2 rounded-lg"
//           />
//         </div>
//       )}
//       <button
//         onClick={verifyAgent}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//       >
//         {loading ? "Verifying..." : "Verify"}
//       </button>
//       {message && (
//         <div className="mt-4 p-2 border rounded">
//           <p className="font-semibold">{message}</p>
//           {extractedCode && (
//             <p className="text-sm">
//               Extracted Code:{" "}
//               <span className="text-red-500">{extractedCode}</span>
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// VerifyAgent.propTypes = {
//   agentId: PropTypes.string.isRequired,
// };

// export default VerifyAgent;












// import { useRef, useState, useEffect } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// import PropTypes from "prop-types";

// const VerifyAgent = ({ agentId }) => {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [aadharImage, setAadharImage] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Fetch Aadhar Image from Backend
//     const fetchAadharImage = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:5001/get-aadhar/${agentId}`
//         );
//         if (response.data.aadharImage) {
//           setAadharImage(`data:image/jpeg;base64,${response.data.aadharImage}`);
//         }
//       } catch (error) {
//         console.error("Error fetching Aadhar image:", error);
//       }
//     };

//     fetchAadharImage();
//   }, [agentId]);

// const generateOtp = async () => {
//   if (!agentId) {
//     console.error("Agent ID is missing!");
//     setMessage("Agent ID is required.");
//     return;
//   }

//   try {
//     const response = await axios.post("http://127.0.0.1:5001/generate-otp", {
//       agentId,
//     });
//     setOtp(response.data.otp);
//     setMessage("OTP generated successfully!");
//   } catch (error) {
//     console.error(
//       "Error generating OTP:",
//       error.response?.data?.message || error.message
//     );
//     setMessage("Failed to generate OTP.");
//   }
// };


//   const captureImage = () => {
//     if (webcamRef.current && webcamRef.current.getScreenshot) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//     } else {
//       console.error("Webcam not ready");
//     }
//   };

// const verifyAgent = async () => {
//   if (!capturedImage) {
//     setMessage("Please capture an image first.");
//     return;
//   }

//   if (!agentId) {
//     setMessage("Agent ID is missing.");
//     return;
//   }

//   try {
//     const response = await axios.post("http://127.0.0.1:5001/verify_live", {
//       agentId,
//       image: capturedImage.replace(/^data:image\/\w+;base64,/, ""), // Remove Base64 prefix
//     });

//     setMessage(response.data.message);
//   } catch (error) {
//     console.error(
//       "Verification failed:",
//       error.response?.data?.message || error.message
//     );
//     setMessage(error.response?.data?.message || "Verification failed.");
//   }
// };


//   return (
//     <div className="p-4 text-gray-100">
//       <h2>Verify Agent</h2>
//       <button onClick={generateOtp}>Generate OTP</button>
//       {otp && <p>OTP: {otp}</p>}

//       {aadharImage && (
//         <div>
//           <h3>Aadhar Image</h3>
//           <img src={aadharImage} alt="Aadhar" width="200" />
//         </div>
//       )}

//       <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
//       <button onClick={captureImage}>Capture Image</button>
//       {capturedImage && <img src={capturedImage} alt="Captured" width="200" />}

//       <button onClick={verifyAgent}>Verify</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// VerifyAgent.propTypes = {
//   agentId: PropTypes.string.isRequired,
// };

// export default VerifyAgent;









//____________________________________________________________________________________________________




// import { useEffect, useState } from "react";
// import axios from "axios";

// const VerifyAgent = () => {
//   const [agentId, setAgentId] = useState("");
//   const [aadharImage, setAadharImage] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");

//   // ✅ Function to decode JWT
// const parseJwt = (token) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Error parsing JWT:", error);
//     return null;
//   }
// };


//   // ✅ Extract agentId from token
// useEffect(() => {
//   const storedToken = localStorage.getItem("authToken");

//   if (!storedToken) {
//     console.error("Auth Token not found in localStorage!");
//     setMessage("Auth Token is missing. Please log in again.");
//     return;
//   }

//   console.log("Stored Token:", storedToken); // 🔥 Log the token

//   const decodedToken = parseJwt(storedToken);
//   console.log("Decoded Token:", decodedToken); // 🔥 Log the decoded data

//   if (decodedToken && decodedToken.userId) {
//     setAgentId(decodedToken.userId);
//     console.log("Extracted Agent ID:", decodedToken.userId);
//   } else {
//     console.error("Agent ID not found in token!");
//     setMessage("Invalid token. Please log in again.");
//   }
// }, []);

//   const storedToken = localStorage.getItem("authToken");
//     const decodedToken = parseJwt(storedToken);
//   // ✅ Fetch Aadhar Image
//   const fetchAadharImage = async () => {
//     console.log("Fetching Aadhar Image for agentId:", decodedToken.userId);

//     if (!decodedToken.userId) {
//       console.error("Agent ID is missing!");
//       setMessage("Agent ID is required to fetch Aadhar.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:5001/get-aadhar/${decodedToken.userId}`
//       );
//       setAadharImage(response.data.image);
//       setMessage("Aadhar Image fetched successfully.");
//     } catch (error) {
//       console.error(
//         "Error fetching Aadhar image:",
//         error.response?.data?.message || error.message
//       );
//       setMessage("Failed to fetch Aadhar image.");
//     }
//   };

//   // ✅ Generate OTP for verification
//   const generateOtp = async () => {
//     console.log("Generating OTP for agentId:", agentId);

//     if (!agentId) {
//       console.error("Agent ID is missing!");
//       setMessage("Cannot generate OTP without Agent ID.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:5001/generate-otp", {
//         agentId,
//       });
//       setOtp(response.data.otp);
//       setMessage("OTP generated successfully.");
//     } catch (error) {
//       console.error(
//         "Error generating OTP:",
//         error.response?.data?.message || error.message
//       );
//       setMessage("Failed to generate OTP.");
//     }
//   };

//   return (
//     <div className="container text-blue-600">
//       <h2>Verify Agent</h2>

//       {message && <p style={{ color: "red" }}>{message}</p>}

//       <button onClick={fetchAadharImage}>Fetch Aadhar Image</button>
//       {aadharImage && <img src={aadharImage} alt="Aadhar" width="200" />}

//       <button onClick={generateOtp}>Generate OTP</button>
//       {otp && (
//         <p>
//           Generated OTP: <strong>{otp}</strong>
//         </p>
//       )}
//     </div>
//   );
// };

// export default VerifyAgent;
//____________________________________________________________________________________________________




// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Webcam from "react-webcam";

// const VerifyAgent = () => {
//   const [agentId, setAgentId] = useState(null);
//   const [aadharImage, setAadharImage] = useState(null);
//   const [otp, setOtp] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [extractedCode, setExtractedCode] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const webcamRef = useRef(null);

//   // ✅ Function to decode JWT
//   const parseJwt = (token) => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error("Error parsing JWT:", error);
//       return null;
//     }
//   };

//   // ✅ Extract agentId from token
//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");

//     if (!storedToken) {
//       console.error("Auth Token not found!");
//       setMessage("Authentication token is missing. Please log in again.");
//       return;
//     }

//     const decodedToken = parseJwt(storedToken);
//     if (decodedToken && decodedToken.userId) {
//       setAgentId(decodedToken.userId);
//     } else {
//       console.error("Invalid token structure.");
//       setMessage("Invalid session. Please log in again.");
//     }
//   }, []);

//   // ✅ Fetch Aadhar image from Python backend
//   useEffect(() => {
//     if (!agentId) return;
//     axios
//       .get(`http://127.0.0.1:5001/get-aadhar/${agentId}`)
//       .then((res) => {
//         console.log("Aadhar image response:", res.data.aadharImage);
//         if (res.data && res.data.aadharImage) {
//           setAadharImage(res.data.aadharImage);
//         } else {
//           console.error("Aadhar image missing in response:", res.data);
//           setMessage("Aadhar image not found.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching Aadhar image:", err);
//         setMessage("Failed to fetch Aadhar image.");
//       });
//   }, [agentId]);

//   // ✅ Fetch OTP from Python backend
//   useEffect(() => {
//     if (!agentId) return;
//     axios
//       .post(
//         `http://127.0.0.1:5001/generate-otp`,
//         { agentId },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         if (res.data && res.data.otp) {
//           setOtp(res.data.otp);
//         } else {
//           console.error("OTP not received:", res.data);
//           setMessage("Failed to generate OTP.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error generating OTP:", err);
//         setMessage("OTP generation failed.");
//       });
//   }, [agentId]);

//   <Webcam
//     ref={webcamRef}
//     screenshotFormat="image/jpeg" // Ensure correct format
//   />;
//   // ✅ Capture image from webcam
// const captureImage = () => {
//   const imageSrc = webcamRef.current.getScreenshot(); // Capture Base64 Image
//   console.log("📸 Captured Image Data:", imageSrc.substring(0, 100)); // Log first 100 chars

//   if (!imageSrc.startsWith("data:image")) {
//     console.error("🚨 ERROR: Image is not Base64! Received:", imageSrc);
//     return;
//   }

//   setCapturedImage(imageSrc);
// };


//   // ✅ Send captured image for verification
//   const verifyAgent = async () => {
//     if (!capturedImage) {
//       alert("Please capture an image first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5001/verify_live",
//         {
//           agentId,
//           image: capturedImage,
//           verification_code: otp, // Optional field for OCR verification
//         },
//         { withCredentials: true }
//       );

//       setLoading(false);
//       setMessage(response.data.message);
//       setExtractedCode(response.data.extracted_code);
//     } catch (error) {
//       setLoading(false);
//       console.error("Verification error:", error);
//       setMessage("Verification failed. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 text-gray-100">
//       <h2 className="text-xl text-gray-50 font-bold">In-Person Verification</h2>

//       {aadharImage && otp && (
//         <div className="mb-4">
//           <p className="text-lg font-semibold">
//             Write this code on paper and show it with your face:
//           </p>
//           <p className="text-2xl font-bold text-red-500">{otp}</p>
//           <img
//             src={`http://localhost:5000/${aadharImage}`}
//             alt="Aadhar"
//             className="w-48 h-48 border-2 rounded-lg mt-2"
//           />
//         </div>
//       )}

//       <div className="mt-4">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="border-2 rounded-lg w-64 h-48"
//         />
//         <button
//           onClick={captureImage}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Capture Image
//         </button>
//       </div>

//       {capturedImage && (
//         <div className="mt-4">
//           <p>Captured Image:</p>
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="w-48 h-48 border-2 rounded-lg"
//           />
//         </div>
//       )}

//       <button
//         onClick={verifyAgent}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//       >
//         {loading ? "Verifying..." : "Verify"}
//       </button>

//       {message && (
//         <div className="mt-4 p-2 border rounded">
//           <p className="font-semibold">{message}</p>
//           {extractedCode && (
//             <p className="text-sm">
//               Extracted Code:{" "}
//               <span className="text-red-500">{extractedCode}</span>
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyAgent;






//-------------------------------------------------------
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Webcam from "react-webcam";

// const VerifyAgent = () => {
//   const [agentId, setAgentId] = useState(null);
//   const [aadharImage, setAadharImage] = useState(null);
//   const [otp, setOtp] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [extractedCode, setExtractedCode] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [verificationSuccess, setVerificationSuccess] = useState(false);
//   const webcamRef = useRef(null);
//   const navigate = useNavigate();

//   const parseJwt = (token) => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error("Error parsing JWT:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     if (!storedToken) {
//       setMessage("Authentication token is missing. Please log in again.");
//       return;
//     }
//     const decodedToken = parseJwt(storedToken);
//     if (decodedToken?.userId) {
//       setAgentId(decodedToken.userId);
//     } else {
//       setMessage("Invalid session. Please log in again.");
//     }
//   }, []);

//   useEffect(() => {
//     if (!agentId) return;
//     axios
//       .get(`http://127.0.0.1:5001/get-aadhar/${agentId}`)
//       .then((res) => {
//         setAadharImage(res.data.aadharImage || "");
//       })
//       .catch(() => {
//         setMessage("Failed to fetch Aadhar image.");
//       });
//   }, [agentId]);

//   useEffect(() => {
//     if (!agentId || otp) return;
//     axios
//       .post(
//         `http://127.0.0.1:5001/generate-otp`,
//         { agentId },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         setOtp(res.data.otp || "");
//       })
//       .catch(() => {
//         setMessage("OTP generation failed.");
//       });
//   }, [agentId, otp]);

//   const captureImage = () => {
//     if (!webcamRef.current) return;
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc.startsWith("data:image")) return;
//     setCapturedImage(imageSrc);
//   };

//   const verifyAgent = async () => {
//     if (!capturedImage) {
//       alert("Please capture an image first!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5001/verify_live",
//         {
//           agentId,
//           image: capturedImage,
//           verification_code: otp,
//         },
//         { withCredentials: true }
//       );
 
//       setMessage(response.data.message);
//       setExtractedCode(response.data.extracted_code || "No code extracted.");
//       console.log(response.data.message);
//       if (response.data.message === "Verification successful!") {
//         setVerificationSuccess(true);
//       }
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message || "Verification failed. Try again."
//       );
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-w-full min-h-screen">
//       <h2 className="text-3xl font-bold mb-6">In-Person Verification</h2>
//       {aadharImage && otp && (
//         <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center mb-6">
//           <p className="text-lg font-semibold">Write this code on paper:</p>
//           <p className="text-4xl font-bold text-red-500">{otp}</p>
//           <img
//             src={aadharImage}
//             alt="Aadhar"
//             className="mt-4 w-56 h-56 rounded-lg border-2"
//           />
//         </div>
//       )}
//       <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="rounded-lg border-2 w-64 h-48"
//         />
//         <button
//           onClick={captureImage}
//           className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
//         >
//           Capture Image
//         </button>
//       </div>
//       {capturedImage && (
//         <div className="mt-4">
//           <p className="text-lg font-semibold">Captured Image:</p>
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="w-56 h-56 rounded-lg border-2"
//           />
//         </div>
//       )}
//       <button
//         onClick={verifyAgent}
//         className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow"
//       >
//         {loading ? "Verifying..." : "Verify"}
//       </button>
//       {message && (
//         <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md text-center">
//           <p className="font-semibold text-lg">{message}</p>
//           {extractedCode && (
//             <p className="text-lg text-red-500">
//               Extracted Code: {extractedCode}
//             </p>
//           )}
//         </div>
//       )}
//       {verificationSuccess && (
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow"
//         >
//           Continue to Dashboard
//         </button>
//       )}
//     </div>
//   );
// };

// export default VerifyAgent;
"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import {
  ArrowRight,
  Camera,
  CheckCircle,
  Info,
  RefreshCw,
  Shield,
  Loader,
} from "lucide-react";

const VerifyAgent = () => {
  const [agentId, setAgentId] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [otp, setOtp] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedCode, setExtractedCode] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [step, setStep] = useState(1); // Track verification steps
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setMessage("Authentication token is missing. Please log in again.");
      return;
    }
    const decodedToken = parseJwt(storedToken);
    if (decodedToken?.userId) {
      setAgentId(decodedToken.userId);
    } else {
      setMessage("Invalid session. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (!agentId) return;
    axios
      .get(`http://127.0.0.1:5001/get-aadhar/${agentId}`)
      .then((res) => {
        setAadharImage(res.data.aadharImage || "");
      })
      .catch(() => {
        setMessage("Failed to fetch Aadhar image.");
      });
  }, [agentId]);

  useEffect(() => {
    if (!agentId || otp) return;
    axios
      .post(
        `http://127.0.0.1:5001/generate-otp`,
        { agentId },
        { withCredentials: true }
      )
      .then((res) => {
        setOtp(res.data.otp || "");
      })
      .catch(() => {
        setMessage("OTP generation failed.");
      });
  }, [agentId, otp]);

  const captureImage = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || !imageSrc.startsWith("data:image")) return;
    setCapturedImage(imageSrc);
    setStep(2); // Move to next step after capturing
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setStep(1);
    setMessage("");
    setExtractedCode(null);
  };

  const verifyAgent = async () => {
    if (!capturedImage) {
      setMessage("Please capture an image first!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/verify_live",
        {
          agentId,
          image: capturedImage,
          verification_code: otp,
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setExtractedCode(response.data.extracted_code || "No code extracted.");

      if (response.data.message === "Verification successful!") {
        setVerificationSuccess(true);
        setStep(3); // Move to success step
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Verification failed. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white">
      {/* Header with blue accent */}
      <header className="w-full bg-slate-800 py-6 px-4 mb-8 border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              In-Person Verification
            </h1>
          </div>
          <p className="text-slate-300 max-w-2xl text-center">
            This verification ensures the security of our platform. Please
            follow the steps below to complete your identity verification.
          </p>

          {/* Progress steps */}
          <div className="flex items-center justify-center mt-6 w-full max-w-md">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? "text-blue-400" : "text-slate-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 1
                    ? "border-blue-400 bg-blue-400/10"
                    : "border-slate-600"
                }`}
              >
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Capture</span>
            </div>
            <div
              className={`w-16 h-0.5 ${
                step >= 2 ? "bg-blue-400" : "bg-slate-600"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 2 ? "text-blue-400" : "text-slate-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 2
                    ? "border-blue-400 bg-blue-400/10"
                    : "border-slate-600"
                }`}
              >
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Verify</span>
            </div>
            <div
              className={`w-16 h-0.5 ${
                step >= 3 ? "bg-blue-400" : "bg-slate-600"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                step >= 3 ? "text-blue-400" : "text-slate-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 3
                    ? "border-blue-400 bg-blue-400/10"
                    : "border-slate-600"
                }`}
              >
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Complete</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 pb-16">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Instructions and Aadhar */}
          <div className="flex flex-col">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Verification Instructions
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-slate-300">
                <li>
                  Write the verification code shown below on a piece of paper
                </li>
                <li>Hold the paper next to your face</li>
                <li>Ensure both your face and the code are clearly visible</li>
                <li>Capture the image and verify</li>
              </ol>
            </div>

            {aadharImage && otp && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Write this code on paper:
                  </h3>
                  <div className="bg-slate-900 rounded-lg py-3 px-8 mb-6 border border-slate-700">
                    <p className="text-5xl font-bold tracking-wider text-blue-500">
                      {otp}
                    </p>
                  </div>

                  <div className="relative">
                    <img
                      src={aadharImage || "/placeholder.svg"}
                      alt="Aadhar"
                      className="rounded-lg border-2 border-slate-600 shadow-lg max-w-full h-auto"
                    />
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-xs px-2 py-1 rounded-md border border-slate-700">
                      Your ID Card
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Webcam and verification */}
          <div className="flex flex-col">
            {step === 1 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Capture Your Image
                </h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md mx-auto mb-4">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-lg border-2 border-slate-600 shadow-lg w-full h-auto aspect-video object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 h-3 w-3 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-slate-300 text-sm mb-4 text-center">
                    Make sure your face and the verification code are clearly
                    visible in the frame
                  </p>
                  <button
                    onClick={captureImage}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg transition duration-200 font-medium"
                  >
                    <Camera className="h-5 w-5" />
                    Capture Image
                  </button>
                </div>
              </div>
            )}

            {step >= 2 && capturedImage && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Captured Image
                  </h2>
                  {!verificationSuccess && (
                    <button
                      onClick={resetCapture}
                      className="text-sm text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retake
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md mx-auto mb-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured"
                      className="rounded-lg border-2 border-slate-600 shadow-lg w-full h-auto"
                    />
                    {verificationSuccess && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full border-2 border-slate-800">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Identity
                </h2>
                <div className="flex flex-col items-center">
                  <p className="text-slate-300 text-sm mb-4 text-center">
                    Click verify to confirm your identity with the captured
                    image and verification code
                  </p>
                  <button
                    onClick={verifyAgent}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg shadow-lg transition duration-200 font-medium w-full justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5" />
                        Verify Identity
                      </>
                    )}
                  </button>

                  {message && (
                    <div
                      className={`mt-4 p-4 rounded-lg w-full text-center ${
                        verificationSuccess
                          ? "bg-green-500/20 border border-green-500/50"
                          : "bg-red-500/20 border border-red-500/50"
                      }`}
                    >
                      <p className="font-medium">{message}</p>
                      {extractedCode && (
                        <p className="text-sm mt-1">
                          Extracted Code:{" "}
                          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded">
                            {extractedCode}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && verificationSuccess && (
              <div className="bg-slate-800 rounded-xl p-6 border border-green-500/30 shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-500/20 p-4 rounded-full mb-4">
                    <CheckCircle className="h-16 w-16 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    Verification Successful!
                  </h2>
                  <p className="text-slate-300 mb-6">
                    Your identity has been verified successfully. You can now
                    proceed to the dashboard.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg transition duration-200 font-medium"
                  >
                    Continue to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyAgent;

