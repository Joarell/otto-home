import { address } from './otto.address.mjs';

//globalThis.fns = { loginInto };

globalThis.onsubmit = () => loginInto();

globalThis.onkeydown = (keyPress) => {
	if (keyPress.key === 'Enter')
		loginInto();
};


// TODO: change the span from 7 to 20.
function checkingPass(passFrase) {
	if (passFrase.length < 7)
		return (true);

	const regex = /['+"+\\+]/gm;
	return (regex.test(passFrase));
};


export function loginInto() {
	const userName = document.getElementById("user-name").value;
	const userPass = document.getElementById("passFrase").value;
	const badge = {
		name: userName,
		passFrase: userPass
	};

	if (userName && !checkingPass(userPass))
		return (backEndLoginAuth(badge));
	// document.getElementById("warning").open = true;
	alert(`Opss! Wrong credentials. Please try again!`);
};


async function takeLogin(userLogin) {
	const url = `${address}/takeLogin/${userLogin.name}`;

	if (confirm("This USER is already logged in. Would you like to take it?")) {
		await fetch(url, {
			method: "GET",
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
		}).then(body => body.status)
		.then(status => status === 200 ? backEndLoginAuth(userLogin) : false)
	}
	return;
};


async function setLogin(info, userData) {
	console.log(`SET LOGIN: ${info} and ${userData}`)
	switch (info.msg) {
		case 'active':
			return (await appAccessCheckIn(info));
		case "ended":
			return (takeLogin(userData));
		default:
			alert('Wrong credentials. Please try again!');
	};
	return (info);
};


async function backEndLoginAuth(userInfo) {
	const form = document.getElementById('login');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const test = await fetch(form.action, {
			method: 'POST',
			body: new FormData(form),
		}).then(response => alert(response.json()))
		.the(res => setLogin(res, userInfo))
		.catch(takeLogin(userInfo));
	});
	//form.removeEventListener("submit", login);
	alert(test)
};


async function appAccessCheckIn({ result, access }) {
	const header = {
		'Authorization': `Bearer ${result[0]}`,
		'Content-Type': 'application/javascript',
		'Accept': 'text/html; text/css; application/javascript',
	};
	const request = new Request(`${address}/app`, {
		Method: "POST",
		Mode: 'cors',
		Headers: header,
		Cache: 'default',
		Credentials: 'include',
		Connection: 'keep-alive',
		Redirect: 'follow',
	});
	try {
		const checkOut = await fetch(request)
			.catch(err => alert(`Warning! ${err}`));

		if (checkOut.status <= 350) {
			globalThis.localStorage.setItem('tier', access);
			globalThis.location.assign(checkOut.url);
		}
		else {
			alert("Not authorized. Please, try again!");
			globalThis.location.reload();
			throw new Error(checkOut.status);
		};
	}
	catch (err) {
		alert(`Attention redirection: ${err}`);
	};
};
