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
const readline_1 = __importDefault(require("readline"));
const TikTokWeb_1 = __importDefault(require("../browser/TikTokWeb"));
class TikTokAuth {
    constructor(browser, page) {
        this.browser = null;
        this.page = null;
        this.username = null;
        this.browser = browser;
        this.page = page;
    }
    navigateToLoginPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.goto('https://www.tiktok.com/login', { waitUntil: 'networkidle2' });
            }
            else {
                throw new Error('Le navigateur n\'est pas initialisé. Appelez launchBrowser() d\'abord.');
            }
        });
    }
    signWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page) {
                throw new Error('Le navigateur n\'est pas initialisé. Appelez launchBrowser() d\'abord.');
            }
            yield this.navigateToLoginPage();
            yield this.page.waitForSelector('input[name="email"]');
            yield this.page.type('input[name="email"]', email);
            yield this.page.type('input[name="password"]', password);
            yield this.page.click('button[type="submit"]');
            yield this.page.waitForNavigation({ waitUntil: 'networkidle2' });
        });
    }
    signWithHuman() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page) {
                throw new Error('Le navigateur n\'est pas initialisé. Appelez launchBrowser() d\'abord.');
            }
            this.username = yield TikTokWeb_1.default.waitForUserInput('Entrez votre @ [utile pour la suite]: ');
            yield this.navigateToLoginPage();
            console.log('Veuillez vous connecter manuellement dans le navigateur.');
            yield this.waitForUserConfirmation('Avez-vous fini de vous connecter ? (Y/n): ');
        });
    }
    getUserPage() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(`https://www.tiktok.com/${this.username}?lang=fr`));
        });
    }
    waitForUserConfirmation(question) {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'y') {
                    resolve();
                }
                else {
                    console.log('Attente de la connexion manuelle...');
                    resolve(this.waitForUserConfirmation(question));
                }
            });
        });
    }
}
exports.default = TikTokAuth;
