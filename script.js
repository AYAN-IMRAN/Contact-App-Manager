const form = document.getElementById("addContactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const contactsContainer = document.getElementById("contactsContainer");
const searchInput = document.getElementById("searchInput");
const formError = document.getElementById("formError");
const themeToggle = document.getElementById("themeToggle");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function validatePhone(phone) {
  const regex = /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/;
  return regex.test(phone);
}

function renderContacts(filteredContacts = contacts) {
  contactsContainer.innerHTML = "";
  filteredContacts.forEach((contact, index) => {
    const card = document.createElement("div");
    card.className = "col-md-6";

    card.innerHTML = `
      <div class="contact-card">
        <div class="contact-details">
          <strong>👤 ${contact.name}</strong>
          <span>📞 ${contact.phone}</span>
        </div>
        <button class="delete-btn" onclick="deleteContact(${index})">🗑️ Delete</button>
      </div>
    `;
    contactsContainer.appendChild(card);
  });
}

function deleteContact(index) {
  contacts.splice(index, 1);
  saveContacts();
  renderContacts();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !validatePhone(phone)) {
    formError.textContent = "❌ Please enter a valid name and phone (e.g. 123-456-7890).";
    return;
  }

  contacts.push({ name, phone });
  saveContacts();
  renderContacts();
  form.reset();
  formError.textContent = "";
});

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
  );
  renderContacts(filtered);
});

// Dark/light mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load theme from storage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

renderContacts();
