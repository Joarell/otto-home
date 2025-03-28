globalThis.onsubmit = (event) => {
	event.preventDefault();
	loginInto();
};

globalThis.onkeydown = (keyPress) => {
	if (keyPress.key === 'Enter')
		loginInto();
};


function checkingPass(passPhrase) {
	if (passPhrase.length < 15)
		return (true);

	const regex = new RegExp('^([a-z]|[A-Z]|[0-9]){4,15}$');
	return (regex.test(passPhrase));
};


export function loginInto() {
	const userName = document.getElementById("user-name").value;
	const passPhrase = document.getElementById("passPhrase").value;

	if (userName && checkingPass(passPhrase))
		return (backEndLoginAuth({ userName, passPhrase }));
	alert(`Opss! Wrong credentials. Please try again!`);
};


async function takeLogin(userLogin) {
	const url = `https://app.ottocratesolver.com/api/v1/boot/login`;

	if (confirm("This USER is already logged in. Would you like to take it?")) {
		fetch(url, {
			method: "POST",
			mode: 'cors',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify({ user: userLogin })
		}).then(body => body.status)
			.then(status => status === 200 ? backEndLoginAuth(userLogin) : false)
	};
};


async function setLogin(info, userData) {
	switch (info.msg) {
		case 'Active!':
			return (await appAccessCheckIn(info));
		case "ended":
			return (takeLogin(userData));
		default:
			alert('Wrong credentials. Please try again!');
	};
	return (info);
};


async function backEndLoginAuth(userInfo) {
	const USER = JSON.stringify(userInfo);
	const url = 'https://app.ottocratesolver.com/api/v1/login';
	await fetch(url, {
		method: "POST",
		mode: 'no-cors',
		body: USER,
		Cache: 'default',
		Redirect: 'follow',
		headers: {
			'Content-Type': 'application/dns-message; charset=UTF-8',
			'Content-Type': 'application/json; charset=UTF-8',
			'Content-Type': 'text/html; charset=UTF-8',
			'Content-Type': 'text/css; charset=UTF-8',
			'Content-Type': 'text/javascript; charset=UTF-8',
			'Cache-Control': 'max-age=3600, max-stale=1800, min-fresh=3600, only-if-cached',
			'Vary': 'Accept-Language',
			'Accept': '*/*',
			'Accept': 'application/dns-message; charset=UTF-8'
		},
	}).then(async res => {
		console.log(res.headers.getSetCookie())
		res.headers.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		});
	});
	globalThis.location.assign(`https://app.ottocratesolver.com/?name=${userInfo.userName}`);
};


async function appAccessCheckIn(response) {
	const user = await response.json();
	const request = new Request(`https://app.ottocratesolver.com/${user.userName}`, {
		Method: "GET",
		Mode: 'no-cors',
		Cache: 'default',
		Redirect: 'follow',
	});
	const checkOut = await fetch(request)
		.catch(err => alert(`Warning! ${err}`));

	globalThis.location.assign('https://app.ottocratesolver.com');
	if (checkOut.status <= 350) {
		globalThis.localStorage.setItem('tier', user.access);
	}
	else {
		alert("Not authorized. Please, try again!");
		globalThis.location.reload();
		throw new Error(checkOut.status);
	};
};
