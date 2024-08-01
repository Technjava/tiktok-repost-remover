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
class TikTokApi {
    constructor(browser, page) {
        this.browser = null;
        this.page = null;
        this.queryParams = new Map();
        this.browser = browser;
        this.page = page;
    }
    getQueryString() {
        return this.queryParams;
    }
    setQueryString(key, value) {
        this.queryParams.set(key, value);
    }
    buildQueryString(params = this.queryParams) {
        return Array.from(params.entries())
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
    }
    deleteWithApi(uniqueId, videoId, remaining) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                const url = `https://www.tiktok.com/tiktok/v1/upvote/delete?${this.buildQueryString()}&item_id=${videoId}`;
                const referer = `https://www.tiktok.com/@${uniqueId}/video/${videoId}?lang=fr`;
                const result = yield this.page.evaluate((url, referer) => {
                    return fetch(url, {
                        credentials: "include",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                            Accept: "*/*",
                            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin",
                            Priority: "u=0",
                        },
                        referrer: referer,
                        method: "POST",
                        mode: "cors",
                    })
                        .then((response) => response.json().then((data) => ({
                        status: response.status,
                        statusText: response.statusText,
                        data,
                    })))
                        .catch((error) => ({
                        status: error.status,
                        statusText: error.message.includes("Unexpected token '<'")
                            ? "Forbidden"
                            : error.message,
                        data: null,
                    }));
                }, url, referer);
                console.log(`(${result.status} [${result.statusText}]): ${uniqueId} ${videoId} ${result.status === 200
                    ? "has been removed successfully."
                    : "cant be removed due to a request rejection."} [${remaining} left] (ETA: ${(remaining / 30).toFixed(2)} minutes)`);
                return;
            }
            console.log("No page defined.");
        });
    }
}
exports.default = TikTokApi;
