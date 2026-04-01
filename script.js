let data = JSON.parse(localStorage.getItem("emp")) || [];

// ADD EMPLOYEE
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();

  let emp = {
    name: name.value,
    id: id.value,
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

  data.push(emp);
  save();
  show();
  summary();
  e.target.reset();
});

// SAVE
function save() {
  localStorage.setItem("emp", JSON.stringify(data));
}

// SHOW LIST
function show(arr = data) {
  list.innerHTML = "";

  arr.forEach((e, i) => {
    list.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.dept}</td>
        <td>
          <button onclick="view(${i})">View</button>
          <button onclick="del(${i})">Delete</button>
          <button onclick="pdf(${i})">PDF</button>
        </td>
      </tr>
    `;
  });
}

// DELETE
function del(i) {
  data.splice(i, 1);
  save();
  show();
}

// SEARCH
search.addEventListener("input", () => {
  let v = search.value.toLowerCase();
  let f = data.filter(e =>
    e.name.toLowerCase().includes(v) ||
    e.dept.toLowerCase().includes(v) ||
    e.id.toLowerCase().includes(v)
  );
  show(f);
});

// SUMMARY
function summary() {
  let p = 0, t = 0, n = 0;

  data.forEach(e => {
    p += e.gross;
    t += e.taxAmount;
    n += e.net;
  });

  payroll.innerText = "Total Payroll: " + p.toFixed(2);
  taxTotal.innerText = "Total Tax: " + t.toFixed(2);
  netTotal.innerText = "Total Net Salary: " + n.toFixed(2);
}

// VIEW DETAILS
function view(i) {
  let e = data[i];

  details.innerHTML = `
    <div class="card">
      <h4>Payslip</h4>
      <p><b>Name:</b> ${e.name}</p>
      <p><b>ID:</b> ${e.id}</p>
      <p><b>Basic:</b> ${e.basic}</p>
      <p><b>Gross:</b> ${e.gross}</p>
      <p><b>Tax:</b> ${e.taxAmount}</p>
      <p><b>Net Salary:</b> ${e.net}</p>
      <button onclick="pdf(${i})">Download Payslip</button>
    </div>
  `;
}

// PDF
function pdf(i) {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();
  let e = data[i];

  doc.text("Payslip", 20, 20);
  doc.text("Name: " + e.name, 20, 40);
  doc.text("Gross: " + e.gross, 20, 60);
  doc.text("Tax: " + e.taxAmount, 20, 80);
  doc.text("Net: " + e.net, 20, 100);

  doc.save(e.name + ".pdf");
}

// DARK MODE
const darkBtn = document.getElementById("darkBtn");

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // CHANGE BUTTON TEXT + ICON
  if (document.body.classList.contains("dark")) {
    darkBtn.innerHTML = "☀️ Dark Mode";
  } else {
    darkBtn.innerHTML = "🌙 Dark Mode";
  }
});

// API FETCH
apiBtn.onclick = async () => {
  let res = await fetch("https://www.freetestapi.com/api/v1/users");
  let users = await res.json();

  api.innerHTML = "";

  users.slice(0, 10).forEach(u => {
    api.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.age}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.address}</td>
        <td>${u.phone}</td>
        <td>${u.website}</td>
        <td>${u.occupation}</td>
        <td>${u.hobbies?.join(", ")}</td>
      </tr>
    `;
  });
};

// INIT
show();
summary();
