import { address } from './otto.address.mjs';

globalThis.fns = { loginInto };

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
		const checkOut = fetch(url, {
			method: "GET",
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
		}).then(body => body.status)
			.then(status => status === 200 ? backEndLoginAuth(userLogin) : false)
	}
	return;
};


async function setLogin(info, userData) {
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


async function backEndLoginAuth({ name, passFrase }) {
	const url = `${address}/start`;
	const body = JSON.stringify({ name, passFrase });
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "*/*");
	headers.append("Host", "solver.ottocratesolver.com");
	headers.append("Connection", "keep-alive");
	const request = new Request(url, {
		method: "POST",
		mode: 'cors',
		body,
		site: 'same-site',
		headers,
	});

	await fetch(request).then(body => body.json())
		.then(data => setLogin(data, { name, passFrase }))
	//.catch(takeLogin(userInfo));
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
