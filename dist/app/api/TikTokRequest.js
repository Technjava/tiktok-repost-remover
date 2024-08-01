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
class TikTokRequest {
    constructor(browser, page, api) {
        this.browser = null;
        this.page = null;
        this.api = null;
        this.items = [];
        this.isProcessing = false;
        this.queue = [];
        this.requestMap = new Map();
        this.lastRequestTimestamp = 0;
        this.browser = browser;
        this.page = page;
        this.api = api;
        this.page.setRequestInterception(true);
        this.page.on("request", (req) => this.interceptRequest(req));
        this.page.on("response", (res) => this.handleResponse(res));
    }
    interceptRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = req.url();
            const now = Date.now();
            if (url.startsWith("https://www.tiktok.com/api/repost/item_list/")) {
                if (now - this.lastRequestTimestamp < 2000) {
                    req.abort();
                    return;
                }
                this.lastRequestTimestamp = now;
                const promise = new Promise((resolve, reject) => {
                    this.requestMap.set(url, { resolve, reject });
                });
                req.continue();
                try {
                    const response = yield promise;
                    this.processResponse(response);
                }
                catch (error) {
                    console.error(`Error processing request ${url}:`, error);
                }
            }
            else {
                req.continue();
            }
        });
    }
    handleResponse(res) {
        const url = res.url();
        const requestInfo = this.requestMap.get(url);
        if (requestInfo) {
            requestInfo.resolve(res);
            this.requestMap.delete(url);
        }
    }
    hasResponse(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = res.url();
            if (url.startsWith("https://www.tiktok.com/api/repost/item_list/")) {
                const data = yield res.json();
                if (!data || !data.itemList || data.itemList.length === 0) {
                    return;
                }
                for (const item of data.itemList) {
                    if (!this.items.some((existingItem) => existingItem.id === item.id)) {
                        this.items.push(item);
                        this.queue.push(item);
                    }
                }
                if (!this.isProcessing) {
                    yield this.processQueue();
                }
            }
        });
    }
    processResponse(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = res.url();
            try {
                const status = res.status();
                if (status === 404) {
                    console.log("(404) Not found " + (0, Utils_1.removeAfterLastSlash)(url));
                    return;
                }
                else if (status === 403) {
                    console.log(`(403) Forbidden ` + (0, Utils_1.removeAfterLastSlash)(url));
                    return;
                }
                const headers = res.headers();
                const contentType = headers["content-type"] || "";
                if (contentType.includes("application/json")) {
                    const data = yield res.json();
                    if (!data || !data.itemList || data.itemList.length === 0) {
                        return;
                    }
                    for (const item of data.itemList) {
                        const exists = this.items.some((existingItem) => existingItem.id === item.id);
                        if (!exists) {
                            this.items.push(item);
                            this.queue.push(item);
                        }
                    }
                    if (!this.isProcessing) {
                        yield this.processQueue();
                    }
                }
                else {
                    const text = yield res.text();
                    console.log(`Unexpected content type: ${contentType}.\nResponse body: ${text.slice(0, 200)}`);
                }
            }
            catch (error) {
                console.error("Error processing response:", error);
            }
        });
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.isProcessing = true;
            while (this.queue.length > 0) {
                const item = this.queue.shift();
                try {
                    yield ((_a = this.api) === null || _a === void 0 ? void 0 : _a.deleteWithApi(item.author.uniqueId, item.id, this.queue.length));
                    yield (0, Utils_1.wait)((0, Utils_1.randomDouble)(0.2, 0.8));
                }
                catch (error) {
                    console.log(`Failed to process item ${item.id}:`, error);
                    this.queue.push(item);
                }
            }
            this.isProcessing = false;
        });
    }
    waitForUserLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield new Promise((resolve) => {
                    var _a;
                    const requestHandler = (request) => {
                        var _a, _b;
                        const url = request.url();
                        if (url.startsWith("https://www.tiktok.com/api/repost/item_list/")) {
                            const params = new URL(url).searchParams;
                            for (const [key, value] of params) {
                                (_a = this.api) === null || _a === void 0 ? void 0 : _a.setQueryString(key, value);
                            }
                            console.log("User has finished loading up!");
                            (_b = this.page) === null || _b === void 0 ? void 0 : _b.off("request", requestHandler);
                            resolve();
                        }
                    };
                    (_a = this.page) === null || _a === void 0 ? void 0 : _a.on("request", requestHandler);
                });
            }
        });
    }
}
exports.default = TikTokRequest;
