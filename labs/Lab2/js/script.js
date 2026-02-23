const students = ["Aidan", "Alex", "Boyd", "Sahil", "Connie", "Nigel", "Seth", "Asher"];

const courseGrades = [
    [83, 90, -1, 75], // Aidan
    [90, 95, 80, 77], // Alex
    [52, 64, 85, 97], // Boyd
    [90, 91, 92, 78], // Sahil
    [82, 98, -1, 79], // Connie
    [54, 98, 84, 94], // Nigel
    [50, 66, 97, 55], // Seth
    [70, 50, 94, 62]  // Asher
];

const clickableNames = ["Aidan", "Alex", "Boyd"];
const clickablePages = ["aidan.html", "alex.html", "boyd.html"];

function getStudentLink(studentName) {
    const index = clickableNames.indexOf(studentName);
    if (index === -1) {
        return "";
    }
    return clickablePages[index];
}

/**
 * Calculate the average numeric grade for a student, ignoring missing grades (-1).
 * 
 * @param {number[]} gradesArray - An array of numeric grades for a student.
 * @returns {number} The average grade rounded to the nearest whole number, or 0 if no valid grades.
 */
function getAverageGrade(gradesArray) {
    const validGrades = gradesArray.filter(grade => grade >= 0);
    if (validGrades.length === 0) {
        return 0;
    }       
    const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
    const average = Math.round(sum / validGrades.length);
    return average;
}
/**
 * Get the letter grade based on the average numeric grade.
 * 
 * use Dal grade scale thresholds
 * return letter (A+, A, A-, B+, ... F)
 * 
 * @param {number} avgNumber - The average numeric grade.
 * @returns {string} The corresponding letter grade.
 */
function getLetterGrade(avgNumber) {
    if (avgNumber >= 90) {
        return "A+";
    } else if (avgNumber >= 85) {
        return "A";
    } else if (avgNumber >= 80) {
        return "A-";
    } else if (avgNumber >= 77) {
        return "B+";
    } else if (avgNumber >= 73) {
        return "B";
    } else if (avgNumber >= 70) {
        return "B-";
    } else if (avgNumber >= 67) {
        return "C+";
    } else if (avgNumber >= 65) {
        return "C";
    } else if (avgNumber >= 60) {               
        return "C-";
    } else if (avgNumber >= 57) {
        return "D+";
    } else if (avgNumber >= 53) {
        return "D";
    } else if (avgNumber >= 50) {         
        return "D-";
    } else {
        return "F";
    }   
}

// Make the grade book
for (let i = 0; i < students.length; i++) {
    const studentName = students[i];
    const grades = courseGrades[i];
    const avgNumber = getAverageGrade(grades);
    const avgLetter = getLetterGrade(avgNumber);

    const tbody = document.getElementById("gradebook-body");
    const row = document.createElement("tr");   

    // Student Name cell
    const nameCell = document.createElement("td");
    const studentLink = getStudentLink(studentName);
    if (studentLink) {
        const link = document.createElement("a");
        link.href = studentLink;
        link.textContent = studentName;
        nameCell.appendChild(link);
    } else {
        nameCell.textContent = studentName;
    }
    row.appendChild(nameCell);
    // Course grade cells
    for (let j = 0; j < 4; j++) {
        const gradeCell = document.createElement("td");
        if (grades[j] === -1) {
            gradeCell.textContent = "N/A";
        } else {
            gradeCell.textContent = grades[j];
        }   
        row.appendChild(gradeCell);
    }   
    // Avg Number cell
    const avgNumberCell = document.createElement("td");
    avgNumberCell.textContent = avgNumber;
    row.appendChild(avgNumberCell); 

    // Avg Letter cell
    const avgLetterCell = document.createElement("td");
    avgLetterCell.textContent = avgLetter;
    row.appendChild(avgLetterCell);
    tbody.appendChild(row);
}

// Loop through and log the students data to the console
for (let i = 0; i < students.length; i++) {
    const studentName = students[i];
    const grades = courseGrades[i];
    const avgNumber = getAverageGrade(grades);
    const avgLetter = getLetterGrade(avgNumber);
    console.log(`Student: ${studentName}`);
    console.log(`Grades: ${grades}`);
    console.log(`Average Number: ${avgNumber}`);
    console.log(`Average Letter: ${avgLetter}`);
    console.log("-------------------------");
}