const form = document.getElementById('event-form');
const eventsDiv = document.getElementById('events');
let allEvents = JSON.parse(localStorage.getItem('clubEvents')) || [];
let registrations = JSON.parse(localStorage.getItem('clubRegistrations')) || {};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const image = document.getElementById('image').value || 'https://via.placeholder.com/250x150';
  const desc = document.getElementById('desc').value;

  const datetime = `${date}T${time}`;
  const newEvent = { title, date, time, image, desc, datetime };
  allEvents.push(newEvent);
  localStorage.setItem('clubEvents', JSON.stringify(allEvents));
  form.reset();
  displayEvents(allEvents);
});

function displayEvents(events) {
  eventsDiv.innerHTML = "";
  events.forEach((event, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    const countdownId = `countdown-${index}`;
    eventCard.innerHTML = `
      <img src="${event.image}" alt="${event.title}">
      <h3>${event.title}</h3>
      <small>${event.date} at ${event.time}</small>
      <p>${event.desc}</p>
      <p id="${countdownId}" class="countdown">Loading countdown...</p>
      <button class="delete-btn" onclick="deleteEvent(${index})">X</button>
      <form class="register-form" onsubmit="registerUser(event, ${index})">
        <input type="text" placeholder="Email or Phone" required id="reg-${index}">
        <button type="submit">Register</button>
      </form>
    `;
    eventsDiv.appendChild(eventCard);
    startCountdown(event.datetime, countdownId);
  });
}

function startCountdown(datetimeStr, elementId) {
  const countdownElement = document.getElementById(elementId);
  const target = new Date(datetimeStr).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      countdownElement.textContent = "⏰ Event started!";
      clearInterval(interval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.textContent = `Starts in: ${d}d ${h}h ${m}m ${s}s`;
  }, 1000);
}

function deleteEvent(index) {
  allEvents.splice(index, 1);
  localStorage.setItem('clubEvents', JSON.stringify(allEvents));
  displayEvents(allEvents);
}

function filterEvents(type) {
  const now = new Date().getTime();
  if (type === 'all') {
    displayEvents(allEvents);
  } else if (type === 'upcoming') {
    displayEvents(allEvents.filter(ev => new Date(ev.datetime).getTime() >= now));
  } else {
    displayEvents(allEvents.filter(ev => new Date(ev.datetime).getTime() < now));
  }
}

function registerUser(e, index) {
  e.preventDefault();
  const input = document.getElementById(`reg-${index}`);
  const contact = input.value;
  if (!registrations[index]) {
    registrations[index] = [];
  }
  registrations[index].push(contact);
  localStorage.setItem('clubRegistrations', JSON.stringify(registrations));
  input.value = "";
  alert("Thanks for registering!");
}

displayEvents(allEvents);
