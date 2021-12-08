const {Inbox} = require("gmail-inbox")

const delay = ms => new Promise(res => setTimeout(res, ms));

async function getMessages(inbox){
	await delay(5000);
	let messages = await inbox.getLatestMessages();
	return messages;
}

async function getGmailOtp(){
	let time = Date.now();
	let inbox = new Inbox('credentials.json');
  await inbox.authenticateAccount(); // logs user in
	let messages;

	while(true){
		messages = await getMessages(inbox);
		messages = messages.filter(item => {
			return parseInt(item.internalDate) > time && item.subject.includes("Authorize New Device");
		})
		if(messages.length !== 0) break;
	}
	let html = messages[0].body.html;
	let frontStr = `<div class="bigVertifyCode" style="font-size: 32px;margin-top: 16px;color: #1e2026;">`;
	let backStr = `</div>  <p class="section" style="font-weight: normal;margin:16px 0 0 0;color: #474d57;">If you don't recognize this activity, please <a style="text-decoration-line: none;font-weight: normal;line-height: 24px;color: #f0b90b;cursor: pointer;" href="https://www.binancezh.top/en/my/security/account-activity/disable-account"> disable your account</a>`;
	let pFrom = html.indexOf(frontStr) + frontStr.length;
	let pTo = html.lastIndexOf(backStr);
	let otp = html.substring(pFrom, pTo);
	return otp;
}

module.exports = {
	getGmailOtp
}
