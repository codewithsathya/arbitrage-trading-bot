const { By, Key, Builder, until } = require("selenium-webdriver");
const totp = require("totp-generator");
const config = require("./config/config.json");
const wazirxConfig = require("./config/wazirx.json");
const binanceConfig = require("./config/binance.json");
const { getGmailOtp } = require("./getGmailOtp");
require("dotenv").config();

const wazirxEmail = process.env.WAZIRX_EMAIL;
const wazirxPassword = process.env.WAZIRX_PASSWORD;
const wazirxAuthKey = process.env.WAZIRX_AUTH_KEY;

const binanceEmail = process.env.BINANCE_EMAIL;
const binancePassword = process.env.BINANCE_PASSWORD;
const binanceAuthKey = process.env.BINANCE_AUTH_KEY;

let driver;
let wazirxWindow;
let binanceWindow;

async function loadBrowser(){
	driver = await new Builder().forBrowser(config.browser).build();
}

async function loginWazirx(){
	await driver.get(wazirxConfig.baseUrl + wazirxConfig.login.link);
	await driver.wait(until.elementLocated(By.css(wazirxConfig.login.emailSelector)));
	await driver.findElement(By.css(wazirxConfig.login.emailSelector)).sendKeys(wazirxEmail);
	await driver.findElement(By.css(wazirxConfig.login.passwordSelector)).sendKeys(wazirxPassword, Key.RETURN);
	await driver.wait(until.elementLocated(By.css(wazirxConfig.login.authkeySelector)));
	const token = totp(wazirxAuthKey);
	await driver.findElement(By.css(wazirxConfig.login.authkeySelector)).sendKeys(token, Key.RETURN);
}

async function loginBinance(){
	await driver.get(binanceConfig.loginUrl);
	await driver.wait(until.elementLocated(By.css(binanceConfig.login.emailSelector)));
	await driver.findElement(By.css(binanceConfig.login.emailSelector)).sendKeys(binanceEmail);
	await driver.findElement(By.css(binanceConfig.login.passwordSelector)).sendKeys(binancePassword, Key.RETURN);
	
	await driver.wait(until.elementLocated(By.className("css-1mme6xj")));
	await driver.findElement(By.className("css-1mme6xj")).click();
	let gmailOtp = await getGmailOtp();
	console.log(gmailOtp);
	await driver.findElement(By.css(`input[aria-label="E-mail verification code"]`)).sendKeys(gmailOtp);
	await driver.findElement(By.css(`input[aria-label="Authenticator Code"]`)).sendKeys(totp(binanceAuthKey), Key.RETURN);
}

async function run(){
	await loadBrowser();
	await loginWazirx();
	wazirxWindow = await driver.getWindowHandle();

	await driver.switchTo().newWindow("tab");
	await loginBinance();
	binanceWindow = await driver.getWindowHandle();
}

run();