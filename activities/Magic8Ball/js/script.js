// Create an array of possible answers
const answersForEightBall = ["Outlook good", "Don’t count on it", "Yes", "It is certain"];
const answerForFortune = ["Do not be afraid of competition.", "You are wise beyond your years", "Expect the unexpected."];

  
// Create a function to fetch the question the user has asked 	
function askQuestion() {
    const userQuestion = document.getElementById("userQuestion").value;
    // Our function should also check from an empty value
    if (userQuestion.trim() === "") {
        console.log("Please enter a question.");
    }
    return userQuestion;
}

// Select a random answer from your array 
function getRandomAnswer() {
    const random = Math.floor(Math.random() * answersForEightBall.length);
    // Chose a random array to select the answer from
    const useEightBall = Math.random() < 0.5;
    if (useEightBall) {
        return answersForEightBall[random];
    } else {
        const randomFortune = Math.floor(Math.random() * answerForFortune.length);
        return answerForFortune[randomFortune];
    }
}

// Display the question and answer back to the user
function displayAnswer() {
    const question = askQuestion();
    const answer = getRandomAnswer();
    document.getElementById("question").innerText = `Question: ${question}`;
    document.getElementById("answer").innerText = `Answer: ${answer}`;
// And, log the question and answer to the console
    console.log(`Question: ${question}`);
    console.log(`Answer: ${answer}`);
}

document.querySelector("button").addEventListener("click", displayAnswer);