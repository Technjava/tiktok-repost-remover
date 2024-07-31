"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TikTokApp_1 = __importDefault(require("./app/TikTokApp"));
const main = () => {
    const app = new TikTokApp_1.default();
    app.initialize();
};
main();
