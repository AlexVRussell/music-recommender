// Get the current time and hour
// HINT: you will have to first get the full date and then get the time and hour of the day
// You may explore the use of JS built-in functions
const currDate = new Date();
console.log(currDate);




// Create a variable to store your greeting message 
let greetingMessage = '';

// Based on the hour you get, you need to set the conditions you want your script to check
// in order to render a specific message
// for now we want to say 'Good Morning' if it is earlier than 12PM

if (currDate.getHours() < 12) {
	greetingMessage = 'Good Morning';
} else if (currDate.getHours() < 15) {
	greetingMessage = 'Good Afternoon! I think we are in class!';
} else {
	greetingMessage = 'Welcome!';
}

// otherwise we want to check if it is earlier than 3PM and let the visitor know
// 'Hey! I think we are in class!'
// For any other time (i.e., later than 3PM, we just want to say 'Welcome'




// This is an example of an if statement, or a conditional statement
// the JS interpreter checks if a conditions is true, if it is then it executes the code
// If the condition is FALSE, then it skips the code and moves onto the next one (i.e., our else if conditional)
// If that second condition is also FALSE then it moves to our last conditional, our else statement
// IF statements always end in an ELSE statement, if you want to give options in-between we always use ELSE IF



// Then, we use the DOM, and calling the 'getElementById( )' method and its innerHTML property to add some HTML for us onto our webpage
// we basically want to show the return result in <h2 id="greeting"></h2>
document.getElementById("greeting").innerHTML = greetingMessage;


// In this section of our script, we want to access the values the user entered into our form
// and add them together
// First we declare our variables for the two values
let first = 0;
let second = 0;
let sum = 0;
let difference = 0;
let product = 0;
let quotient = 0;

// Now, let's use the DOM now to access a value in our form and show it back to us in an alert( ) box
// First, we'll creatr a function to store the input values into the variables we declared above
// We'll enclose that code block in a function, getNumbers( )
    // Store the values from the form into the variables we declared above
function getNumbers() {
	first = parseFloat(document.getElementById("number1").value);
	second = parseFloat(document.getElementById("number2").value);
}
 
// Call the getNumbers() function to import the values the user enteres into the form into 
// this function
// We perform our addition on the two values

function Addition() {
	getNumbers();
	sum = first + second;
	document.getElementById("result").innerHTML = "The sum is: " + sum;
}

function Subtraction() {
	getNumbers();
	difference = first - second;
	document.getElementById("result").innerHTML = "The difference is: " + difference;
}

function Multiply() {
	getNumbers();
	product = first * second;
	document.getElementById("result").innerHTML = "The product is: " + product;
}

function Division() {
	getNumbers();
	quotient = first / second
	if (second === 0) {
		document.getElementById("result").innerHTML = "Error: Division by zero is not allowed.";
		return;
	}
	document.getElementById("result").innerHTML = "The quotient is: " + quotient;
}


// evenOddArray() function 
// this functions takes an array of numbers as input and returns even if the total number of 
// items in the array is even, and odd if the total number of items in the array is odd
function evenOddArray() {
	let input = document.getElementById("arrayInput").value;
	let arr = input.split('');
	let len = arr.length;
	console.log(len);
	
	if (len % 2 === 0){
		document.getElementById("arrayResult").innerHTML = "even";
	} else {
		document.getElementById("arrayResult").innerHTML = "odd";
	}
}


// evenOddArrayItems() function
// this function iterates through the array and returns a new array of either "even" or "odd"
function evenOddArrayItems() {
	let arr = [];  // Clear array each time function runs
	input = document.getElementById("arrayInput").value;  
	// split the input string into an array of numbers
	let temp = input.split('');
	let len = temp.length;  // Use array length, not string length

	for (let i = 0; i < len; i++) {
		if (temp[i] % 2 === 0){
			arr.push("even");
		} else {
			arr.push("odd");
		}
	}
	document.getElementById("arrayResult").innerHTML = "[" + arr.join(',') + "]";
}



