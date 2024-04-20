import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    expires_at: { type: Date, required: true }
  });
  
  const VerificationCodeModel = mongoose.model('VerificationCode', verificationCodeSchema);
  export default VerificationCodeModel;