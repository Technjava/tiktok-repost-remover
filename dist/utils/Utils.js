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
exports.wait = wait;
exports.askUser = askUser;
exports.waitForUserConfirmation = waitForUserConfirmation;
exports.removeAfterLastSlash = removeAfterLastSlash;
exports.randomDouble = randomDouble;
const readline_1 = __importDefault(require("readline"));
function wait(seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    });
}
function askUser(question) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
function waitForUserConfirmation(question) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            if (answer.toLowerCase() === "y") {
                resolve();
            }
            else {
                console.log("Attente de la connexion manuelle...");
                resolve(waitForUserConfirmation(question));
            }
        });
    });
}
function removeAfterLastSlash(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex === -1) {
        return url;
    }
    return url.substring(0, lastSlashIndex + 1);
}
function randomDouble(min, max) {
    return Math.random() * (max - min) + min;
}
