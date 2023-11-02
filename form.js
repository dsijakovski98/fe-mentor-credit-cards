const form = document.querySelector("form");

const owner = form.querySelector(".owner-input");
const number = form.querySelector(".number-input");
const date = form.querySelector(".date-input");
const cvc = form.querySelector(".cvc-input");

const ERR_BLANK = "Can't be blank";

const validation = {
	test: {
		lettersOnly: /^[a-zA-Z\s]+$/,
		numbersOnly: /^[0-9]+$/,
	},
	numberMaxLength: 16,
	dateMaxLength: 2,
	cvcMaxLength: 3,
};

const clearErrors = () => {
	form.querySelectorAll("input").forEach((input) => {
		input.removeAttribute("aria-invalid");
	});

	form.querySelectorAll(".error").forEach((error) => {
		error.remove();
	});
};

const addError = (formInput, msg, index = 0) => {
	const targetInput = formInput.querySelectorAll("input")[index];
	targetInput.setAttribute("aria-invalid", "true");

	const errorP = document.createElement("p");
	errorP.className = "error";
	errorP.textContent = msg;

	if (!formInput.querySelector(".error")) {
		formInput.append(errorP);
	}
};

const checkMaxLength = (target, maxLength) => {
	if (target.value.length > maxLength) {
		target.value = target.value.slice(0, -1);
	}
};

// Form validation
form.addEventListener("submit", (e) => {
	e.preventDefault();

	clearErrors();

	const ownerInput = owner.querySelector("input");
	const numberInput = number.querySelector("input");
	const [monthInput, yearInput] = date.querySelectorAll("input");
	const cvcInput = cvc.querySelector("input");

	// Check empty fields
	if (ownerInput.value.trim() === "") {
		addError(owner, ERR_BLANK);
	}

	if (numberInput.value.trim() === "") {
		addError(number, ERR_BLANK);
	}

	if (monthInput.value.trim() === "") {
		addError(date, ERR_BLANK, 0);
	}

	if (yearInput.value.trim() == "") {
		addError(date, ERR_BLANK, 1);
	}

	if (cvcInput.value.trim() === "") {
		addError(cvc, ERR_BLANK);
	}

	if (!validation.test.lettersOnly.test(ownerInput.value)) {
		addError(owner, "Wrong format, letters only");
	}

	if (!validation.test.numbersOnly.test(numberInput.value.replaceAll(" ", ""))) {
		addError(number, "Wrong format, numbers only");
	}
});

// Credit card number pattern while typing
let prevNumberValue = "";
number.querySelector("input").addEventListener("input", (e) => {
	let trimmedValue = e.target.value.replaceAll(" ", "").trim();

	if (trimmedValue.length === validation.numberMaxLength) {
		return;
	}

	if (trimmedValue.length > validation.numberMaxLength) {
		e.target.value = e.target.value.slice(0, -1);
		return;
	}

	let patternInput = "";
	while (trimmedValue.length) {
		const chunk = trimmedValue.slice(0, 4);
		patternInput += chunk + " ";
		trimmedValue = trimmedValue.slice(4);
	}

	e.target.value = patternInput.trim();
});

date.querySelectorAll("input").forEach((input) => {
	input.addEventListener("input", (e) => {
		checkMaxLength(e.target, validation.dateMaxLength);
	});
});

cvc.querySelector("input").addEventListener("input", (e) => {
	checkMaxLength(e.target, validation.cvcMaxLength);
});
