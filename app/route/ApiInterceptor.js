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
const url_1 = require("url");
class ApiInterceptor {
    constructor(browser, page, username) {
        this.browser = null;
        this.page = null;
        this.queryParams = new Map();
        this.username = null;
        this.browser = browser;
        this.page = page;
        this.username = username;
    }
    handleRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = request.url();
            if (url.startsWith('https://www.tiktok.com/api/repost/item_list/') && this.queryParams.size === 0) {
                const parsedUrl = new url_1.URL(url);
                const params = parsedUrl.searchParams;
                for (const [key, value] of params) {
                    this.queryParams.set(key, value);
                }
                console.log('Paramètres extraits :', Array.from(this.queryParams.entries()));
            }
            request.continue();
        });
    }
    handleResponse(res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = res.url();
            if (url.startsWith('https://www.tiktok.com/api/repost/item_list/')) {
                const data = yield res.json();
                if (!data || !data.itemList || data.itemList.length === 0) {
                    console.log('Vous avez fini de supprimer vos republications.');
                    process.exit();
                }
                const deletePromises = data.itemList.map(item => this.deleteWithApi(item.author.uniqueId, item.id));
                yield Promise.all(deletePromises);
                console.log(data.itemList.length + ' republications ont étées supprimées de votre compte.');
                return yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.goto(`https://www.tiktok.com/${this.username}?lang=fr`));
            }
        });
    }
    getQueryParams() {
        return this.queryParams;
    }
    buildQueryString(params = this.getQueryParams()) {
        return Array.from(params.entries())
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }
    deleteWithApi(uniqueId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                const url = `https://www.tiktok.com/tiktok/v1/upvote/delete?${this.buildQueryString()}&item_id=${videoId}`;
                const referer = `https://www.tiktok.com/@${uniqueId}/video/${videoId}?lang=fr`;
                const result = yield this.page.evaluate((url, referer) => {
                    return fetch(url, {
                        credentials: 'include',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
                            'Accept': '*/*',
                            'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-origin',
                            'Priority': 'u=0'
                        },
                        referrer: referer,
                        method: 'POST',
                        mode: 'cors'
                    })
                        .then(response => response.json().then(data => ({
                        status: response.status,
                        statusText: response.statusText,
                        data
                    })))
                        .catch(error => ({
                        status: 'Error',
                        statusText: error.message,
                        data: null
                    }));
                }, url, referer);
                console.log(`(${result.status}): ${result.statusText}: ${videoId}`);
                return;
            }
            console.log('No page defined.');
        });
    }
    wait(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(resolve, seconds * 1000);
            });
        });
    }
}
exports.default = ApiInterceptor;
