/**
 * Create name, age, enrollment status variables
 * Add a check for enrollment type
 * add the variables to the html page
 */
 

let personName = "Alex";
let age = 21;
let isStudent = false;
let futureAge = age + 8;

if (isStudent) {
   console.log(personName + " is a student");
}

const newMsg = document.getElementById("msg");
newMsg.innerHTML = personName + " is " + age + " years old, in 8 years they will be " + futureAge;