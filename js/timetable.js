/**
 * Green Valley Public School, Jalandhar
 * Weekly Timetable Matrix Controller
 */

const TimetableModule = {
  timetableList: [],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  periods: [
    '08:00 - 08:50',
    '08:50 - 09:40',
    '09:40 - 10:30',
    '10:50 - 11:40',
    '11:40 - 12:30',
    '12:30 - 01:20'
  ],

  async init() {
    App.init('Weekly Class Timetable');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadTimetable();

    const user = Auth.getCurrentUser();
    if (user && user.role !== 'Admin') {
      const btn = document.getElementById('open-add-slot-btn');
      if (btn) btn.style.display = 'none';
    }
  },

  async populateDropdowns() {
    const classSelect = document.getElementById('tt-class-select');
    classSelect.innerHTML = '';
    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      classSelect.appendChild(opt);
    });
    classSelect.value = 'Class 10';

    const subSelect = document.getElementById('slot-subject');
    const subjects = await Api.get('subjects');
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = s.name;
      subSelect.appendChild(opt);
    });

    const teaSelect = document.getElementById('slot-teacher');
    const teachers = await Api.get('teachers');
    teachers.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = t.name;
      teaSelect.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('tt-class-select').addEventListener('change', () => {
      this.renderMatrix();
    });

    document.getElementById('open-add-slot-btn').addEventListener('click', () => {
      Utils.openModal('timetable-modal');
    });

    document.getElementById('timetable-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveSlot();
    });
  },

  async loadTimetable() {
    this.timetableList = await Api.get('timetable');
    this.renderMatrix();
  },

  renderMatrix() {
    const selectedClass = document.getElementById('tt-class-select').value;
    document.getElementById('tt-header-title').innerHTML = `
      <span>Weekly Routine: <strong>${selectedClass}</strong></span>
    `;

    const tbody = document.getElementById('timetable-matrix-body');
    const classSlots = this.timetableList.filter(t => t.class === selectedClass);

    tbody.innerHTML = this.days.map(day => {
      // Find slots for this day
      const getSlotHtml = (period) => {
        const match = classSlots.find(s => s.day === day && s.period === period);
        if (match) {
          return `
            <div class="timetable-slot">
              ${match.subject}
              <span class="tt-teacher">${match.teacher ? match.teacher.split(' ')[0] : ''} &bull; ${match.room || ''}</span>
            </div>
          `;
        }
        return '<span class="text-muted" style="font-size: 0.78rem;">-</span>';
      };

      return `
        <tr>
          <td style="font-weight: 700; background: var(--bg-subtle); text-align: left;">${day}</td>
          <td>${getSlotHtml('08:00 - 08:50')}</td>
          <td>${getSlotHtml('08:50 - 09:40')}</td>
          <td>${getSlotHtml('09:40 - 10:30')}</td>
          <td style="background: #fffbeb; color: #b45309; font-weight: 600; font-size: 0.75rem;">Recess / Tiffin</td>
          <td>${getSlotHtml('10:50 - 11:40')}</td>
          <td>${getSlotHtml('11:40 - 12:30')}</td>
          <td>${getSlotHtml('12:30 - 01:20')}</td>
        </tr>
      `;
    }).join('');
  },

  async handleSaveSlot() {
    const selectedClass = document.getElementById('tt-class-select').value;
    const day = document.getElementById('slot-day').value;
    const period = document.getElementById('slot-period').value;
    const subject = document.getElementById('slot-subject').value;
    const teacher = document.getElementById('slot-teacher').value;
    const room = document.getElementById('slot-room').value.trim();

    // Remove existing slot on this day and period for this class
    let list = await Api.get('timetable');
    list = list.filter(t => !(t.class === selectedClass && t.day === day && t.period === period));

    const newSlot = {
      day,
      period,
      class: selectedClass,
      subject,
      teacher,
      room
    };

    list.push(newSlot);
    await Api.set('timetable', list);

    Utils.showToast(`Updated ${day} ${period} for ${selectedClass}`, 'success');
    Utils.closeModal('timetable-modal');
    await this.loadTimetable();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  TimetableModule.init();
});
