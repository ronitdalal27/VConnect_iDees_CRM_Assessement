document.addEventListener('DOMContentLoaded', () => {
  // Total Users
  fetch('/api/users')
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalUsers').textContent = data.length;
    })
    .catch(err => console.error('Error fetching users:', err));

  // Total Contacts
  fetch('/api/contacts')
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalContacts').textContent = data.length;
    })
    .catch(err => console.error('Error fetching contacts:', err));

  // Newly Added Contacts (last 5)
  fetch('/api/reports/recent-contacts')
    .then(res => res.json())
    .then(data => {
      document.getElementById('recentContacts').textContent = data.length;
    })
    .catch(err => console.error('Error fetching recent contacts:', err));
});
