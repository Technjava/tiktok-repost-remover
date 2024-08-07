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
const Utils_1 = require("../../utils/Utils");
const crypto_1 = require("crypto");
class TikTokAuto {
    constructor(web, page) {
        this.web = null;
        this.page = null;
        this.web = web;
        this.page = page;
    }
    deleteAutomatically() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log("Starting deletion period.\nYou have 5 seconds to close any pop-ups if there are any on this page. If the app doesn't click on the repost button automatically, please do it yourself.");
            yield (0, Utils_1.wait)(5);
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.mouse.click(490, 330)); /* repost button */
            yield (0, Utils_1.wait)(1);
            while (true) {
                yield ((_b = this.web) === null || _b === void 0 ? void 0 : _b.scroll());
                yield (0, Utils_1.wait)((0, crypto_1.randomInt)(3, 6));
            }
        });
    }
}
exports.default = TikTokAuto;
