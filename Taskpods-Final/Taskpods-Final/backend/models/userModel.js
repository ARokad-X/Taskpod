import mongoose from "mongoose";
import { FallbackUser } from "./fallbackStore.js";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const userModelInstance = mongoose.models.user || mongoose.model("user", userSchema);

const PUBLIC_METHODS = new Set(['find', 'findOne', 'findById', 'create', 'findByIdAndUpdate', 'findOneAndUpdate', 'findOneAndDelete']);

const userModelProxy = new Proxy(userModelInstance, {
    get(target, prop, receiver) {
        if (mongoose.connection.readyState === 1) {
            return Reflect.get(target, prop, receiver);
        }
        if (PUBLIC_METHODS.has(prop)) {
            console.log(`[Fallback DB] User.${prop}`);
        }
        return Reflect.get(FallbackUser, prop);
    }
});

export default userModelProxy;