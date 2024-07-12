document.addEventListener('DOMContentLoaded', () => {
    const addEventBtn = document.getElementById('add-event-btn');
    const modal = document.getElementById('add-event-modal');
    const closeBtn = document.getElementsByClassName('close-btn')[0];
    const eventForm = document.getElementById('event-form');
    const eventList = document.getElementById('event-list');
  
    let events = [];
  
    addEventBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });
  
    eventForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const eventName = document.getElementById('event-name').value;
      const eventDate = document.getElementById('event-date').value;
      addEvent(eventName, new Date(eventDate));
      eventForm.reset();
      modal.style.display = 'none';
    });
  
    function addEvent(name, date) {
      events.push({ name, date });
      renderEventList();
    }
  
    function renderEventList() {
      eventList.innerHTML = '';
      events.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
          <p>${event.name} - ${event.date.toLocaleString()}</p>
          <button onclick="removeEvent(${index})">Remove</button>
        `;
        eventList.appendChild(eventItem);
      });
      startCountdown();
    }
  
    function startCountdown() {
      if (events.length > 0) {
        const nextEvent = events[0];
        const timer = document.getElementById('timer');
        const updateTimer = () => {
          const now = new Date();
          const timeDiff = nextEvent.date - now;
          if (timeDiff <= 0) {
            timer.innerHTML = 'Event is happening now!';
            clearInterval(interval);
          } else {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            timer.innerHTML = `${days} days and ${hours} hours left`;
          }
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
      }
    }
  
    window.removeEvent = (index) => {
      events.splice(index, 1);
      renderEventList();
    };
  });
  