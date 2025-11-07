async function login(e) {
  e.preventDefault(); // prevent form reload

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  // Clear previous messages and classes
  message.textContent = "";
  message.className = "";

  // Optional basic validation
  if (!username || !password) {
    message.classList.add("text-danger");
    message.textContent = "Please fill in both fields.";
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.status === "success") {
      message.classList.remove("text-danger");
      message.classList.add("text-success");
      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.classList.remove("text-success");
      message.classList.add("text-danger");
      message.textContent = data.message || "Invalid credentials!";
    }

  } catch (error) {
    console.error("Error during login:", error);
    message.classList.remove("text-success");
    message.classList.add("text-danger");
    message.textContent = "Server error. Please try again later.";
  }
}
