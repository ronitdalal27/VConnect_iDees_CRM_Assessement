async function loadReports() {
  const countRes = await fetch("/api/reports/contact-count");
  const countData = await countRes.json();
  const list = document.getElementById("contactCountList");
  list.innerHTML = "";
  Object.entries(countData).forEach(([user, count]) => {
    list.innerHTML += `<li class="list-group-item">${user}: ${count} contact(s)</li>`;
  });

  const recentRes = await fetch("/api/reports/recent-contacts");
  const recentContacts = await recentRes.json();
  const recentList = document.getElementById("recentContactsList");
  recentList.innerHTML = "";
  recentContacts.forEach(c => {
    recentList.innerHTML += `<li class="list-group-item">${c.name} (${c.email})</li>`;
  });
}

loadReports();
