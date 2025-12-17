const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");

userForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = { name, email, password };
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/users/${id}` : "/api/users";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  userForm.reset();
  loadUsers();
};

async function loadUsers() {
  const res = await fetch("/api/users");
  const users = await res.json();
  userTableBody.innerHTML = "";
  users.forEach((u) => {
    userTableBody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <button onclick='editUser(${JSON.stringify(u)})' class='btn btn-sm btn-warning'>Edit</button>
          <button onclick='deleteUser(${u.id})' class='btn btn-sm btn-danger'>Delete</button>
        </td>
      </tr>`;
  });
}

function editUser(u) {
  document.getElementById("userId").value = u.id;
  document.getElementById("name").value = u.name;
  document.getElementById("email").value = u.email;
  document.getElementById("password").value = u.password;
}

async function deleteUser(id) {
  await fetch(`/api/users/${id}`, { method: "DELETE" });
  loadUsers();
}

loadUsers();
