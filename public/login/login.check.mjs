globalThis.fns = { loginInto };

globalThis.onkeydown = (keyPress) => {
	if (keyPress.key === 'Enter')
		loginInto ();
};


// TODO: change the span from 7 to 20.
function checkingPass (passFrase) {
	if (passFrase.length < 20)
		return (true);

	const regex = new RegExp('^([a-z]|[A-Z]|[0-9]){4,15}$');
	return (regex.test(passFrase));
};


export function loginInto () {
	const userName	= document.getElementById("user-name").value;
	const userPass	= document.getElementById("passFrase").value;
	const badge		= {
		name: userName,
		passFrase: userPass
	};

	if (userName && !checkingPass (userPass))
		return (backEndLoginAuth(badge));
	// document.getElementById("warning").open = true;
	alert(`Opss! Wrong credentials. Please try again!`);
};


async function takeLogin(userLogin){
	const url = `/api/v1/boot/login/`;

	if (confirm("This USER is already logged in. Would you like to take it?")) {
		fetch(url, {
			method: "POST",
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify({ user: userLogin })
		}).then(body => body.status)
		.then(status => status === 200 ? backEndLoginAuth(userLogin): false)
	};
};


async function setLogin(info, userData) {
	switch(info.msg) {
		case 'active':
			return(await appAccessCheckIn(info));
		case "ended":
			return (takeLogin(userData));
		default:
			alert('Wrong credentials. Please try again!');
	};
	return(info);
};


async function backEndLoginAuth(userInfo) {
	const USER =	JSON.stringify(userInfo);
	//const url =		'/start';
	const url =		'https://otto-home.josephjoarell.workers.dev/random';

	console.log(url)
	await fetch (url, {
		method: "POST",
		body: USER,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	}).then(body => body.json())
	.then(data => setLogin(data, userInfo))
	//.catch(takeLogin(userInfo));
};


async function appAccessCheckIn({ result, access }) {
	const header =	{
		'Authorization': `Bearer ${result[0]}`,
		'Content-Type': 'application/javascript',
		'Accept': 'text/html; text/css; application/javascript',
	};
	const request =		new Request(`/app`, {
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
	catch(err) {
		alert(`Attention redirection: ${err}`);
	};
};
