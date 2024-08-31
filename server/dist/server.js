"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const ErrorHandler_middleware_1 = __importDefault(require("./middlewares/ErrorHandler.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const gig_route_1 = __importDefault(require("./routes/gig.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const conversation_route_1 = __importDefault(require("./routes/conversation.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL, "http://localhost:4173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/auth", auth_route_1.default);
app.use("/gigs", gig_route_1.default);
app.use("/orders", order_route_1.default);
app.use("/messages", message_route_1.default);
app.use("/conversations", conversation_route_1.default);
app
    .get("*", (req, res) => {
    res.status(404).send("Not Found");
})
    .post("*", (req, res) => {
    res.status(404).send("Not Found");
});
app.use(ErrorHandler_middleware_1.default);
try {
    mongoose_1.default.connect(process.env.MONGO_URI);
    console.log("Connected to the database");
    app.listen(3001, () => {
        console.log("Server is running on port 3000");
    });
}
catch (error) {
    console.error("Error connecting to the database: ", error);
}
// Graceful shutdown
const SIGNALS = ["SIGINT", "SIGTERM", "SIGQUIT"];
SIGNALS.forEach((signal) => {
    process.on(signal, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Received ${signal}`);
        yield mongoose_1.default.connection.close();
        process.exit(0);
    }));
});
