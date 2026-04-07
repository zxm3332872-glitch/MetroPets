const form = document.getElementById('volunteerForm');
const message = document.getElementById('message');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value.trim();
  const availability = document.getElementById('availability').value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  message.textContent = '';
  message.className = 'form-message';

  if (!name || !email || !role || !availability) {
    message.textContent = 'Please complete all fields before submitting.';
    message.classList.add('error');
    return;
  }

  if (!emailPattern.test(email)) {
    message.textContent = 'Please enter a valid email address.';
    message.classList.add('error');
    return;
  }

  message.textContent = 'Application submitted successfully!';
  message.classList.add('success');
  form.reset();
});
