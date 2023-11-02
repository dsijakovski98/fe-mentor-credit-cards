const form = document.querySelector("form");
const thankYou = document.querySelector(".thank-you");

const owner = form.querySelector(".owner-input");
const number = form.querySelector(".number-input");
const date = form.querySelector(".date-input");
const cvc = form.querySelector(".cvc-input");

const ERR_BLANK = "Can't be blank";
let errorDetected = false;

const validation = {
	test: {
		lettersOnly: /^[a-zA-Z\s]+$/,
		numbersOnly: /^[0-9]+$/,
	},
	numberLength: 16,
	dateLength: 2,
	cvcLength: 3,

	month: {
		min: 1,
		max: 12,
	},

	year: {
		min: 0,
		max: 99,
	},
};

const clearErrors = () => {
	errorDetected = false;

	form.querySelectorAll("input").forEach((input) => {
		input.removeAttribute("aria-invalid");
	});

	form.querySelectorAll(".error").forEach((error) => {
		error.remove();
	});
};

const addError = (formInput, msg, index = 0) => {
	errorDetected = true;

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

	// Owner input
	if (ownerInput.value.trim() === "") {
		addError(owner, ERR_BLANK);
	}

	if (!validation.test.lettersOnly.test(ownerInput.value)) {
		addError(owner, "Wrong format, letters only");
	}

	// Number input
	const rawNumberInput = numberInput.value.replaceAll(" ", "");
	if (numberInput.value.trim() === "") {
		addError(number, ERR_BLANK);
	}

	if (!validation.test.numbersOnly.test(rawNumberInput)) {
		addError(number, "Wrong format, numbers only");
	}

	if (rawNumberInput.length < validation.numberLength) {
		addError(number, `Credit card number must be ${validation.numberLength} digits exactly`);
	}

	// Date input
	const { month, year } = validation;
	let dateError = "";
	let errorIndexes = [];

	errorIndexes.push(0);
	if (monthInput.value.trim() === "") {
		dateError += `Month ${ERR_BLANK.toLowerCase()}! `;
	} else if (monthInput.valueAsNumber < month.min || monthInput.valueAsNumber > month.max) {
		dateError += `Month must be a value from ${month.min} to ${month.max}! `;
	} else if (monthInput.value.length < validation.dateLength) {
		dateError += `Month must be ${validation.dateLength} digits exactly! `;
	} else {
		errorIndexes.pop();
	}

	errorIndexes.push(1);
	if (yearInput.value.trim() == "") {
		dateError += `Year ${ERR_BLANK.toLowerCase()}! `;
	} else if (yearInput.valueAsNumber < year.min || yearInput.valueAsNumber > year.max) {
		dateError += `Year must be a value from ${year.min} to ${year.max}! `;
	} else if (yearInput.value.length < validation.dateLength) {
		dateError += `Year must be ${validation.dateLength} digits exactly! `;
	} else {
		errorIndexes.pop();
	}

	if (dateError.length > 0) {
		errorIndexes.forEach((index) => {
			addError(date, dateError.trim(), index);
		});
	}

	// CVC Input
	if (cvcInput.value.trim() === "") {
		addError(cvc, ERR_BLANK);
	}

	if (cvcInput.value.length < validation.cvcLength) {
		addError(cvc, `CVC must be ${validation.cvcLength} digits exactly!`);
	}

	if (errorDetected) return;

	form.reset();
	form.style.display = "none";
	thankYou.style.display = "grid";
});

// Credit card number pattern while typing
let prevNumberValue = "";
number.querySelector("input").addEventListener("input", (e) => {
	let trimmedValue = e.target.value.replaceAll(" ", "").trim();

	if (trimmedValue.length === validation.numberLength) {
		return;
	}

	if (trimmedValue.length > validation.numberLength) {
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
		checkMaxLength(e.target, validation.dateLength);
	});
});

cvc.querySelector("input").addEventListener("input", (e) => {
	checkMaxLength(e.target, validation.cvcLength);
});

thankYou.querySelector("button").addEventListener("click", () => {
	form.style.display = "grid";
	thankYou.style.display = "none";
});
