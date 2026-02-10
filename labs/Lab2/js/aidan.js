const courseNames = ["Course 1", "Course 2", "Course 3", "Course 4"];

const assignments = [
	[85, 90, -1],
	[78, 82, 88],
	[91, 87, 93],
	[70, 76, 80]
];

const quizzes = [
	[80, 85],
	[90, 88],
	[75, 79],
	[88, 90]
];

const exams = [
	[84, 86],
	[92, 89],
	[90, 94],
	[78, 81]
];

const assessmentNames = ["Assignments", "Quizzes", "Exams"];
const assessmentWeights = [0.3, 0.2, 0.5];

function getAverage(gradesArray) {
	const validGrades = gradesArray.filter(grade => grade >= 0);
	if (validGrades.length === 0) {
		return null;
	}
	const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
	return Math.round(sum / validGrades.length);
}

function getWeightedAverage(avg, weight) {
	if (avg === null) {
		return null;
	}
	return Math.round(avg * weight);
}

function formatGrades(gradesArray) {
	return gradesArray.map(grade => (grade < 0 ? "N/A" : grade)).join(", ");
}

const container = document.getElementById("student-details");

for (let i = 0; i < courseNames.length; i++) {
	const section = document.createElement("section");
	const heading = document.createElement("h2");
	heading.textContent = courseNames[i];
	section.appendChild(heading);

	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const headRow = document.createElement("tr");
	const headers = ["Assessment Type", "Grades", "Average", "Weighted Average"];
	for (let h = 0; h < headers.length; h++) {
		const th = document.createElement("th");
		th.textContent = headers[h];
		headRow.appendChild(th);
	}
	thead.appendChild(headRow);
	table.appendChild(thead);

	const tbody = document.createElement("tbody");
	const assessmentGrades = [assignments[i], quizzes[i], exams[i]];

	for (let j = 0; j < assessmentNames.length; j++) {
		const row = document.createElement("tr");

		const typeCell = document.createElement("td");
		typeCell.textContent = assessmentNames[j];
		row.appendChild(typeCell);

		const gradesCell = document.createElement("td");
		gradesCell.textContent = formatGrades(assessmentGrades[j]);
		row.appendChild(gradesCell);

		const avg = getAverage(assessmentGrades[j]);
		const weighted = getWeightedAverage(avg, assessmentWeights[j]);

		const avgCell = document.createElement("td");
		avgCell.textContent = avg === null ? "N/A" : avg;
		row.appendChild(avgCell);

		const weightedCell = document.createElement("td");
		weightedCell.textContent = weighted === null ? "N/A" : weighted;
		row.appendChild(weightedCell);

		tbody.appendChild(row);
	}

	table.appendChild(tbody);
	section.appendChild(table);
	container.appendChild(section);
}
