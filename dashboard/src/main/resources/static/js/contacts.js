const contactForm = document.getElementById("contactForm");
const contactTableBody = document.getElementById("contactTableBody");
const searchBox = document.getElementById("searchBox");

contactForm.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById("contactId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const userId = document.getElementById("userId").value;

  const contact = {
    name,
    email,
    phone,
    user: { id: userId }
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/contacts/${id}` : "/api/contacts";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact)
  });

  contactForm.reset();
  loadContacts();
};

async function loadContacts() {
  const res = await fetch("/api/contacts");
  const contacts = await res.json();
  contactTableBody.innerHTML = "";
  contacts.forEach((c) => {
    contactTableBody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.user?.id}</td>
        <td>
          <button onclick='editContact(${JSON.stringify(c)})' class='btn btn-sm btn-warning'>Edit</button>
          <button onclick='deleteContact(${c.id})' class='btn btn-sm btn-danger'>Delete</button>
        </td>
      </tr>`;
  });
}

function editContact(c) {
  document.getElementById("contactId").value = c.id;
  document.getElementById("name").value = c.name;
  document.getElementById("email").value = c.email;
  document.getElementById("phone").value = c.phone;
  document.getElementById("userId").value = c.user?.id || '';
}

async function deleteContact(id) {
  await fetch(`/api/contacts/${id}`, { method: "DELETE" });
  loadContacts();
}

async function searchContacts() {
  const query = searchBox.value;
  const res = await fetch(`/api/contacts/search?query=${query}`);
  const contacts = await res.json();
  contactTableBody.innerHTML = "";
  contacts.forEach((c) => {
    contactTableBody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.user?.id}</td>
        <td>
          <button onclick='editContact(${JSON.stringify(c)})' class='btn btn-sm btn-warning'>Edit</button>
          <button onclick='deleteContact(${c.id})' class='btn btn-sm btn-danger'>Delete</button>
        </td>
      </tr>`;
  });
}

loadContacts();
