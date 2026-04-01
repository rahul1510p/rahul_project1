let employeeData = JSON.parse(localStorage.getItem("employees")) || [];

// ADD EMPLOYEE
document.getElementById("employeeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let emp = {
    name: name.value,
    id: empId.value,
    dept: dept.value,
    contact: contact.value,
    basic: +basic.value,
    allow: +allow.value,
    bonus: +bonus.value,
    tax: +tax.value,
    insurance: +insurance.value,
    other: +other.value
  };

  emp.gross = emp.basic + emp.allow + emp.bonus + emp.other;
  emp.taxAmount = (emp.gross * emp.tax) / 100;
  emp.net = emp.gross - emp.taxAmount - emp.insurance;

  employeeData.push(emp);
  saveData();
  displayEmployees();
  updateSummary();

  this.reset();
});

// SAVE
function saveData() {
  localStorage.setItem("employees", JSON.stringify(employeeData));
}

// DISPLAY
function displayEmployees(list = employeeData) {
  let table = document.getElementById("employeeTable");
  table.innerHTML = "";

  list.forEach((emp, index) => {
    table.innerHTML += `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.dept}</td>
        <td>
          <button onclick="viewEmployee(${index})">View</button>
          <button onclick="deleteEmployee(${index})">Delete</button>
          <button onclick="generatePDF(${index})">PDF</button>
        </td>
      </tr>
    `;
  });
}

// DELETE
function deleteEmployee(index) {
  employeeData.splice(index, 1);
  saveData();
  displayEmployees();
}

// SEARCH
document.getElementById("search").addEventListener("input", function() {
  let value = this.value.toLowerCase();

  let filtered = employeeData.filter(emp =>
    emp.name.toLowerCase().includes(value) ||
    emp.dept.toLowerCase().includes(value) ||
    emp.id.toLowerCase().includes(value)
  );

  displayEmployees(filtered);
});

// SUMMARY
function updateSummary() {
  let totalPayroll = 0, totalTax = 0, totalNet = 0;

  employeeData.forEach(emp => {
    totalPayroll += emp.gross;
    totalTax += emp.taxAmount;
    totalNet += emp.net;
  });

  totalPayroll = totalPayroll.toFixed(2);
  totalTax = totalTax.toFixed(2);
  totalNet = totalNet.toFixed(2);

  document.getElementById("totalPayroll").innerText = "Total Payroll: " + totalPayroll;
  document.getElementById("totalTax").innerText = "Total Tax: " + totalTax;
  document.getElementById("totalNet").innerText = "Total Net: " + totalNet;
}

// VIEW
function viewEmployee(index) {
  let emp = employeeData[index];

  document.getElementById("details").innerHTML = `
    <h3>Payslip</h3>
    <p>Name: ${emp.name}</p>
    <p>Gross: ${emp.gross}</p>
    <p>Tax: ${emp.taxAmount}</p>
    <p>Net Salary: ${emp.net}</p>
  `;
}

// PDF
function generatePDF(index) {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let emp = employeeData[index];

  doc.text("Payslip", 20, 20);
  doc.text("Name: " + emp.name, 20, 40);
  doc.text("Gross: " + emp.gross, 20, 60);
  doc.text("Tax: " + emp.taxAmount, 20, 80);
  doc.text("Net: " + emp.net, 20, 100);

  doc.save(emp.name + "_payslip.pdf");
}

// DARK MODE
document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// API FETCH
document.getElementById("loadApi").addEventListener("click", async () => {
  let res = await fetch("https://www.freetestapi.com/api/v1/users");
  let data = await res.json();

  let table = document.getElementById("apiData");
  table.innerHTML = "";

  data.slice(0, 5).forEach(user => {
    table.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
      </tr>
    `;
  });
});

// INITIAL LOAD
displayEmployees();
updateSummary();