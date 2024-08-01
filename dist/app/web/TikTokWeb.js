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
const TikTokRequest_1 = __importDefault(require("../api/TikTokRequest"));
const TikTokApi_1 = __importDefault(require("../api/TikTokApi"));
const TikTokAuto_1 = __importDefault(require("../auto/TikTokAuto"));
const Utils_1 = require("../../utils/Utils");
class TikTokWeb {
    constructor(username) {
        this.browser = null;
        this.page = null;
        this.username = null;
        this.api = null;
        this.request = null;
        this.auto = null;
        this.username = username;
    }
    launchBrowser() {
        return __awaiter(this, arguments, void 0, function* (headless = false, width, height) {
            this.browser = yield puppeteer_1.default.launch({
                headless,
                defaultViewport: null,
                args: [`--window-size=${width},${height}`],
            });
            this.page = yield this.browser.newPage();
            this.api = new TikTokApi_1.default(this, this.page);
            this.request = new TikTokRequest_1.default(this, this.page, this.api);
            this.auto = new TikTokAuto_1.default(this, this.page);
        });
    }
    navigateTo(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(url));
        });
    }
    clickAt(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.mouse.click(x, y));
        });
    }
    scroll(deltaY) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                if (!deltaY) {
                    const deltaY = yield this.page.evaluate(() => window.innerHeight);
                    yield this.page.mouse.wheel({ deltaY: -200 });
                    yield (0, Utils_1.wait)(0.3);
                    yield this.page.mouse.wheel({ deltaY: deltaY + 500 });
                }
                else
                    yield this.page.mouse.wheel({ deltaY: deltaY });
            }
        });
    }
    navigateToProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigateTo(`https://www.tiktok.com/@${this.username}?lang=fr`);
        });
    }
    getPage() {
        return this.page;
    }
    closeBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
}
exports.default = TikTokWeb;
