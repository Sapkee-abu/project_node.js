// app.js
const apiUrl = "http://localhost:3000/student";  // URL ของ API

function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderNames(data))
        .catch(error => console.error('Error fetching data:', error));
}

function renderNames(students) {
    const nameList = document.getElementById("name-list");
    nameList.innerHTML = ""; // Clear list
    students.forEach(student => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${student.studentId} - ${student.name}
      <button onclick="deleteStudent('${student._id}')">Delete</button>
      <button onclick="editStudent('${student._id}', '${student.studentId}', '${student.name}')">Edit</button>
    `;
        nameList.appendChild(li);
    });
}

function deleteStudent(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchData())
        .catch(error => console.error('Error deleting student:', error));
}

function editStudent(id, oldStudentId, oldName) {
    const newName = prompt("Enter new name", oldName);
    if (newName) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        }).then(() => fetchData())
            .catch(error => console.error('Error updating student:', error));
    }
}

function searchStudent() {
    const studentId = document.getElementById("search-id").value;
    fetch(`${apiUrl}/${studentId}`)
        .then(response => response.json())
        .then(data => renderNames([data]))  // We expect only one student
        .catch(error => console.error('Error searching student:', error));
}

document.getElementById("add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    if (studentId && studentName) {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, name: studentName })
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById("student-id").value = "";
                document.getElementById("student-name").value = "";
                fetchData();  // Reload the list after adding
            })
            .catch(error => console.error('Error adding student:', error));
    } else {
        alert("Please enter both Student ID and Name.");
    }
});

fetchData();  // Initial fetch to populate the list
