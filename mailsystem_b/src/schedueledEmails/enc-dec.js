const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", 'hex');

// Encrypt
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // <-- store as hex
}

// Decrypt
const decrypt = (appPassword) => {
  appPassword = appPassword.split(":")
  const hash = {
    iv:appPassword[0],
    content:appPassword[1]
  }
  const decipher = crypto.createDecipheriv(
    algorithm, 
    secretKey, 
    Buffer.from(hash.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")), 
    decipher.final()
  ]);
  return decrypted.toString();
}


module.exports = {encrypt, decrypt}