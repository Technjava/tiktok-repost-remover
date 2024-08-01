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
const Utils_1 = require("../utils/Utils");
const TikTokAuth_1 = __importDefault(require("./auth/TikTokAuth"));
const TikTokWeb_1 = __importDefault(require("./web/TikTokWeb"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tiktokWeb = new TikTokWeb_1.default(yield (0, Utils_1.askUser)("Please enter your username on TikTok (without @):\n"));
    yield tiktokWeb.launchBrowser(false, 1920, 1080);
    const tiktokAuth = new TikTokAuth_1.default(tiktokWeb, tiktokWeb.getPage());
    yield tiktokAuth.signInWithHuman();
    yield tiktokWeb.navigateToProfile();
    yield ((_a = tiktokWeb.request) === null || _a === void 0 ? void 0 : _a.waitForUserLoad());
    yield tiktokWeb.auto.deleteAutomatically();
});
main();
