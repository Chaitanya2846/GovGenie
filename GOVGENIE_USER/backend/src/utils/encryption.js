// import crypto from "crypto";

// const algorithm = "aes-256-cbc";
// const secretKey ="e5b0c8d2e8f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"; // Use a secure key
// const iv = crypto.randomBytes(16);

// // Encrypt Message
// export const encryptMessage = (text) => {
//   const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
// };

// // Decrypt Message
// export const decryptMessage = (text) => {
//   const [ivHex, encryptedText] = text.split(":");
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(secretKey),
//     Buffer.from(ivHex, "hex")
//   );
//   let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// };

// import crypto from "crypto";

// const algorithm = "aes-256-cbc";
// const secretKey = "e5b0c8d2e8f3a4b5c6d7e8f9a0b1c2d3"; // Must be 32 characters
// const iv = crypto.randomBytes(16);

// export const encryptMessage = (text) => {
//   const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return iv.toString("hex") + ":" + encrypted.toString("hex");
// };

// export const decryptMessage = (text) => {
//   const textParts = text.split(":");
//   const iv = Buffer.from(textParts.shift(), "hex");
//   const encryptedText = Buffer.from(textParts.join(":"), "hex");
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(secretKey),
//     iv
//   );
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// };
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = "e5b0c8d2e8f3a4b5c6d7e8f9a0b1c2d3"; // Must be 32 characters

// Validate the key length
if (Buffer.from(secretKey).length !== 32) {
  throw new Error("Invalid secretKey length. Must be 32 bytes.");
}

export const encryptMessage = (text) => {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  console.log("encrypted", encrypted);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptMessage = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log("decrypted", decrypted.toString());
  return decrypted.toString();
};