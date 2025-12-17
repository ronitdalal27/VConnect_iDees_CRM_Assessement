const contactForm = document.getElementById("contactForm");
const contactTableBody = document.getElementById("contactTableBody");
const searchBox = document.getElementById("searchBox");

// Validation function
function validateContact(name, email, phone) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(name)) {
        alert("Name should contain only letters and spaces.");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (!phoneRegex.test(phone)) {
        alert("Phone number should be exactly 10 digits.");
        return false;
    }
    return true;
}

contactForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const userId = document.getElementById("userId").value;

    if (!validateContact(name, email, phone)) return;

    const contact = {
        name,
        email,
        phone,
        user: { id: userId }
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/contacts/${id}` : "/api/contacts";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });

        // NEW PART — show error if userId does not exist
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message); // show backend message
            return;
        }

        // Success
        contactForm.reset();
        document.getElementById("contactId").value = "";
        loadContacts();

    } catch (err) {
        alert("Server error while creating contact.");
        console.error(err);
    }
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
