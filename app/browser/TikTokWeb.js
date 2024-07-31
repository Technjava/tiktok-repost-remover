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
const puppeteer_1 = __importDefault(require("puppeteer"));
const ApiInterceptor_1 = __importDefault(require("../route/ApiInterceptor"));
const TikTokAuth_1 = __importDefault(require("../auth/TikTokAuth"));
const readline_1 = __importDefault(require("readline"));
class TikTokWeb {
    constructor() {
        this.browser = null;
        this.page = null;
        this.apiInterceptor = null;
        this.tiktokAuth = null;
    }
    launchBrowser() {
        return __awaiter(this, arguments, void 0, function* (headless = true, width, height) {
            this.browser = yield puppeteer_1.default.launch({ headless, defaultViewport: null, args: [`--window-size=${width},${height}`] });
            this.page = yield this.browser.newPage();
            this.tiktokAuth = new TikTokAuth_1.default(this.browser, this.page);
            yield this.tiktokAuth.signWithHuman();
            this.page.setRequestInterception(true);
            this.apiInterceptor = new ApiInterceptor_1.default(this.browser, this.page, this.getAuth().username);
            this.page.on('request', req => { var _a; return (_a = this.apiInterceptor) === null || _a === void 0 ? void 0 : _a.handleRequest(req); });
            this.page.on('response', res => { var _a; return (_a = this.apiInterceptor) === null || _a === void 0 ? void 0 : _a.handleResponse(res); });
        });
    }
    getInterceptor() {
        return this.apiInterceptor;
    }
    getAuth() {
        return this.tiktokAuth;
    }
    closeBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
    static waitForUserInput(question) {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                if (answer) {
                    resolve(answer);
                }
            });
        });
    }
}
exports.default = TikTokWeb;
