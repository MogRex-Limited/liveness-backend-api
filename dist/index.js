"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var liveness_routes_1 = __importDefault(require("./routes/liveness.routes"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', function (req, res) {
    var name = process.env.NAME || 'World';
    res.send("Hello ".concat(name, "!"));
});
app.get('/current/', function (req, res) {
    res.json({ message: "Reached the current path!" });
});
app.use('/api/v1', liveness_routes_1.default);
var PORT = parseInt(process.env.PORT || '3000', 10);
var HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, function () {
    console.log("Liveness Server running on http://".concat(HOST, ":").concat(PORT));
});
//# sourceMappingURL=index.js.map