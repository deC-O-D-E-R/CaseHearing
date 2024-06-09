function showCalendar() {
    const yearInput = document.getElementById('yearInput');
    const year = parseInt(yearInput.value);
    
    if (isNaN(year) || year < 2000 || year > 2024) {
      alert('Please enter a valid year between 2000 and 2024.');
      return;
    }
  
    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = ''; // Clear previous calendar if any
  
    const daysInMonth = Array.from({ length: 12 }, (_, month) =>
      new Date(year, month + 1, 0).getDate()
    );
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    months.forEach((month, index) => {
      const days = Array.from({ length: daysInMonth[index] }, (_, day) => day + 1);
      const monthContainer = document.createElement('div');
      monthContainer.className = 'calendar';
      monthContainer.innerHTML = `<h3>${month} ${year}</h3>`;
      days.forEach(day => {
        monthContainer.innerHTML += `<div>${day}</div>`;
      });
      calendarContainer.appendChild(monthContainer);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('yearInput');
    yearInput.addEventListener('input', () => {
      if (yearInput.value.length === 4) {
        showCalendar();
      }
    });
  });
  