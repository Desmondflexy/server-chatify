"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.cookies.token;
    if (!token)
        return res.status(401).json({ error: "Please login" });
    try {
        const decodedPayload = (0, jwt_1.verifyToken)(token);
        req.user = decodedPayload;
        next();
    }
    catch (error) {
        (0, helpers_1.devLog)(error.message);
        return res.status(401).json({ error: "Please login" });
    }
}
exports.default = authenticate;
