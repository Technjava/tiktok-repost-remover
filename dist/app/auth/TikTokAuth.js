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
Object.defineProperty(exports, "__esModule", { value: true });
class TikTokAuth {
    constructor(web, page) {
        this.web = null;
        this.page = null;
        this.web = web;
        this.page = page;
    }
    signInWithHuman() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.web.navigateTo("https://www.tiktok.com/login");
            console.log("Veuillez vous connecter manuellement, une fois fini, vous serez redirigé.");
            yield new Promise((resolve) => {
                const checkLogin = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const url = yield this.page.url();
                    if (url && !url.includes("tiktok.com/login")) {
                        clearInterval(checkLogin);
                        resolve(true);
                    }
                }), 1000);
            });
            console.log("Connexion effectuée avec succès.");
        });
    }
}
exports.default = TikTokAuth;
