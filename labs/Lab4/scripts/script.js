// Registration logic
const users = {
	alex: "StrongPassword12!",
	Maddy: "SecureLogin#99",
	boyd: "Validpassword@123"
};

// Init log of amount of users for clarity during testing
console.log("Total Users:", Object.keys(users).length);

const usersMap = new Map();
const usernameSet = new Set();

for (const username in users) {
	usersMap.set(username, users[username]);
	usernameSet.add(username);
}

const getElement = (selector) => document.querySelector(selector);

const registerForm = getElement("#register-form");
const loginForm = getElement("#login-form");

const registerMessage = getElement("#register-message");
const loginMessage = getElement("#login-message");

const setMessage = (target, text, isSuccess) => {
	if (!target) return;
	target.textContent = text;
	if (isSuccess) {
		target.style.color = "green";
	} else {
		target.style.color = "red";
	}
};

const setBorder = (field, isValid) => {
	if (!field) return;
	if (isValid) {
		field.style.border = "2px solid green";
	} else {
		field.style.border = "2px solid red";
	}
};

const getRegisterValues = () => {
	const emailInput = getElement("#email");
	const usernameInput = getElement("#username");
	const passwordInput = getElement("#password");
	const confirmPasswordInput = getElement("#confirm_password");

	if (!emailInput || !usernameInput || !passwordInput || !confirmPasswordInput) {
		throw new Error("Missing registration inputs");
	}

	const { value: email } = emailInput;
	const { value: username } = usernameInput;
	const { value: password } = passwordInput;
	const { value: confirmPassword } = confirmPasswordInput;

    return { email, username, password, confirmPassword, inputs: { emailInput, usernameInput, passwordInput, confirmPasswordInput } };
};

// login logic
const getLoginValues = () => {
	const usernameInput = getElement("#username");
	const passwordInput = getElement("#password");

	if (!usernameInput || !passwordInput) {
		throw new Error("Missing login inputs");
	}
	const { value: username } = usernameInput;
	const { value: password } = passwordInput;

	return { username, password, inputs: { usernameInput, passwordInput } };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,8}$/;
const usernamePattern = /^[A-Za-z][A-Za-z0-9]*$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;


const validateEmail = (email) => {
	return emailPattern.test(email);
};

const validateUsername = (username) => {
	return usernamePattern.test(username);
};

const validatePassword = (password) => {
	return passwordPattern.test(password);
};

const validateConfirmPassword = (password, confirmPassword) => {
	return password === confirmPassword;
};

if (registerForm) {
	registerForm.addEventListener("submit", (event) => {
		event.preventDefault();

		try {
			const data = getRegisterValues();
			const { email, username, password, confirmPassword, inputs } = data;
			const { emailInput, usernameInput, passwordInput, confirmPasswordInput } = inputs;

			const emailOk = validateEmail(email.trim());
			const usernameOk = validateUsername(username.trim());
			const passwordOk = validatePassword(password);
			const confirmOk = validateConfirmPassword(password, confirmPassword);

			setBorder(emailInput, emailOk);
			setBorder(usernameInput, usernameOk);
			setBorder(passwordInput, passwordOk);
			setBorder(confirmPasswordInput, confirmOk);

			if (!emailOk || !usernameOk || !passwordOk || !confirmOk) {
				if (!emailOk) {
					setMessage(registerMessage, "Invalid email format (domain must be 2 to 8 letters).", false);
				} else if (!usernameOk) {
					setMessage(registerMessage, "Username must start with a letter and use only letters/numbers.", false);
				} else if (!passwordOk) {
					setMessage(registerMessage, "Password must be at least 12 chars and include upper, lower, number, and special char.", false);
				} else {
					setMessage(registerMessage, "Confirm password must match password.", false);
				}
				return;
			}

			const cleanUsername = username.trim();
			if (usernameSet.has(cleanUsername)) {
				setBorder(usernameInput, false);
				setMessage(registerMessage, "Username already exists.", false);
				return;
			}

			users[cleanUsername] = password;
			usersMap.set(cleanUsername, password);
			usernameSet.add(cleanUsername);

			setMessage(registerMessage, "Registration successful.", true);
			console.log("Registration success:", cleanUsername);
			console.log("New user registered:", cleanUsername, "| Total users:", Object.keys(users).length);
			registerForm.reset();
		} catch (error) {
			setMessage(registerMessage, "Registration error occurred.", false);
			console.error(error);
		}
	});
}

if (loginForm) {
	loginForm.addEventListener("submit", (event) => {
		event.preventDefault();

		try {
			const data = getLoginValues();
			const { username, password, inputs } = data;
			const { usernameInput, passwordInput } = inputs;
			const cleanUsername = username.trim();

			const knownPassword = usersMap.get(cleanUsername);

			if (!knownPassword) {
				setBorder(usernameInput, false);
				setBorder(passwordInput, false);
				setMessage(loginMessage, "Username does not exist.", false);
				console.log("Login failed:", cleanUsername);
				return;
			}

			if (knownPassword !== password) {
				setBorder(usernameInput, true);
				setBorder(passwordInput, false);
				setMessage(loginMessage, "Incorrect password.", false);
				console.log("Login failed:", cleanUsername);
				return;
			}

			setBorder(usernameInput, true);
			setBorder(passwordInput, true);
			setMessage(loginMessage, "Login successful.", true);
			console.log("Login success:", cleanUsername);
			loginForm.reset();
		} catch (error) {
			setMessage(loginMessage, "Login error occurred.", false);
			console.error(error);
		}
	});
}