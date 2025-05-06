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
		await fetch(url, {
			method: "POST",
			mode: 'cors',
			headers: {
				'Authorization': `Basic ${ userLogin }`,
				'Content-Type': `text/html, text/css, text/javascript`
			},
			mode: 'cors',
			Redirect: 'follow',
			credentials: 'include'
		}).then(
			body => body.status === 200 ?
				globalThis.location.assign('https://app.ottocratesolver.com'):
				setLogin("", userLogin)
		);
	};
};


async function setLogin(info, userData) {
	switch (info.msg) {
		case "ended":
			return (takeLogin(userData));
		default:
			alert('Wrong credentials. Please try again!');
			globalThis.location.reload();
	};
	return (info);
};


async function backEndLoginAuth(userInfo) {
	const url = 'https://app.ottocratesolver.com/api/v1/login';
	const login = btoa(userInfo.userName + ':' + userInfo.passPhrase);
	const request =  new Request(url, {
		method: "GET",
		headers: {
			'Authorization': `Basic ${ login }`,
			'Content-Type': `text/html, text/css, text/javascript`
		},
		mode: 'cors',
		Redirect: 'follow',
		credentials: 'include'
	});

	await fetch(request).then(async res => {
		switch(res.status){
			case 200:
				return(globalThis.location.assign('https://app.ottocratesolver.com'));
			case 401:
				return(takeLogin(login));
			case 404:
				setLogin("", userInfo);
		};
	}).catch(async () => {
		globalThis.location.reload();
		alert('Wrong credentials. Please try again!');
		await takeLogin(userInfo);
	});
};
