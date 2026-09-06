/**
 * Green Valley Public School, Jalandhar
 * Attendance Controller
 */

const AttendanceModule = {
  allAttendance: [],
  allStudents: [],
  currentRoster: [],
  markedStatusMap: {}, // studentId -> 'Present' | 'Absent' | 'Late' | 'Leave'

  async init() {
    App.init('Student Attendance');
    this.initControls();
    this.bindEvents();
    await this.loadInitialData();
  },

  initControls() {
    const datePicker = document.getElementById('att-date-picker');
    datePicker.value = new Date().toISOString().split('T')[0];

    const classSelect = document.getElementById('att-class-select');
    classSelect.innerHTML = '';
    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      classSelect.appendChild(opt);
    });

    // Default to Class 10
    classSelect.value = 'Class 10';
  },

  bindEvents() {
    document.getElementById('load-roster-btn').addEventListener('click', () => {
      this.loadRoster();
    });

    document.getElementById('att-class-select').addEventListener('change', () => {
      this.loadRoster();
    });
    document.getElementById('att-section-select').addEventListener('change', () => {
      this.loadRoster();
    });
    document.getElementById('att-date-picker').addEventListener('change', () => {
      this.loadRoster();
    });

    const canMark = Permissions.hasPermission(Permissions.PERMS.ATTENDANCE_MARK);
    const markAllBtn = document.getElementById('mark-all-present-btn');
    const saveBtn = document.getElementById('save-attendance-btn');
    const saveBtnBtm = document.getElementById('save-attendance-btn-bottom');

    if (!canMark) {
      if (markAllBtn) markAllBtn.style.display = 'none';
      if (saveBtn) saveBtn.style.display = 'none';
      if (saveBtnBtm) saveBtnBtm.style.display = 'none';
    }

    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        this.currentRoster.forEach(s => {
          this.markedStatusMap[s.id] = 'Present';
        });
        this.renderTable();
        this.updateStats();
        Utils.showToast('Marked all students Present', 'info');
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveAttendance();
      });
    }
    if (saveBtnBtm) {
      saveBtnBtm.addEventListener('click', () => {
        this.saveAttendance();
      });
    }
  },

  async loadInitialData() {
    this.allStudents = await Api.get('students');
    this.allAttendance = await Api.get('attendance');
    await this.loadRoster();
  },

  async loadRoster() {
    const selectedClass = document.getElementById('att-class-select').value;
    const selectedSection = document.getElementById('att-section-select').value;
    const selectedDate = document.getElementById('att-date-picker').value;

    document.getElementById('roster-header-title').innerHTML = `
      <span>Attendance Sheet: <strong>${selectedClass} (${selectedSection})</strong></span>
    `;
    document.getElementById('roster-date-badge').textContent = Utils.formatDate(selectedDate, 'readable');

    // Filter students belonging to this class & section
    this.currentRoster = this.allStudents.filter(s => 
      s.class === selectedClass && 
      s.section === selectedSection &&
      s.status === 'Active'
    );

    // Refresh existing attendance for this date & class
    this.allAttendance = await Api.get('attendance');
    const existing = this.allAttendance.filter(a => 
      a.date === selectedDate && 
      a.class === selectedClass && 
      a.section === selectedSection
    );

    this.markedStatusMap = {};
    this.currentRoster.forEach(s => {
      const match = existing.find(e => e.studentId === s.id);
      this.markedStatusMap[s.id] = match ? match.status : 'Present';
    });

    this.renderTable();
    this.updateStats();
  },

  renderTable() {
    const tbody = document.getElementById('attendance-table-body');
    if (!this.currentRoster.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted" style="padding: 30px;">
            No active students found enrolled in this class and section.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.currentRoster.map(s => {
      const currentStatus = this.markedStatusMap[s.id] || 'Present';
      const studentHistory = this.allAttendance.filter(a => a.studentId === s.id);
      const studentPresents = studentHistory.filter(a => a.status === 'Present' || a.status === 'Late').length;
      const historyPercent = studentHistory.length ? Math.round((studentPresents / studentHistory.length) * 100) : 100;

      return `
        <tr>
          <td><strong>#${s.rollNo || '-'}</strong></td>
          <td>
            <div style="font-weight: 700;">${s.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${s.parentName} (${s.parentPhone})</div>
          </td>
          <td>${s.admissionNo}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge ${historyPercent >= 75 ? 'badge-success' : 'badge-danger'}">${historyPercent}%</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">CBSE min 75%</span>
            </div>
          </td>
          <td style="text-align: center;">
            <div class="att-btn-group">
              <button type="button" class="att-opt-btn present ${currentStatus === 'Present' ? 'active' : ''}" ${!canMark ? 'disabled' : ''} onclick="AttendanceModule.setStatus('${s.id}', 'Present')">Present</button>
              <button type="button" class="att-opt-btn absent ${currentStatus === 'Absent' ? 'active' : ''}" ${!canMark ? 'disabled' : ''} onclick="AttendanceModule.setStatus('${s.id}', 'Absent')">Absent</button>
              <button type="button" class="att-opt-btn late ${currentStatus === 'Late' ? 'active' : ''}" ${!canMark ? 'disabled' : ''} onclick="AttendanceModule.setStatus('${s.id}', 'Late')">Late</button>
              <button type="button" class="att-opt-btn leave ${currentStatus === 'Leave' ? 'active' : ''}" ${!canMark ? 'disabled' : ''} onclick="AttendanceModule.setStatus('${s.id}', 'Leave')">Leave</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  setStatus(studentId, status) {
    this.markedStatusMap[studentId] = status;
    this.renderTable();
    this.updateStats();
  },

  updateStats() {
    const statsEl = document.getElementById('attendance-stats-cards');
    const total = this.currentRoster.length;
    let present = 0, absent = 0, late = 0, leave = 0;

    Object.values(this.markedStatusMap).forEach(st => {
      if (st === 'Present') present++;
      else if (st === 'Absent') absent++;
      else if (st === 'Late') late++;
      else if (st === 'Leave') leave++;
    });

    const classPercentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    statsEl.innerHTML = `
      <div class="metric-card emerald">
        <div class="metric-data">
          <h3>${present}</h3>
          <p>Present Today</p>
          <div class="metric-sub text-success">${classPercentage}% Attendance</div>
        </div>
      </div>
      <div class="metric-card rose">
        <div class="metric-data">
          <h3>${absent}</h3>
          <p>Absent</p>
          <div class="metric-sub text-danger">${total ? Math.round((absent/total)*100) : 0}% of class</div>
        </div>
      </div>
      <div class="metric-card amber">
        <div class="metric-data">
          <h3>${late}</h3>
          <p>Late Arrival</p>
          <div class="metric-sub text-warning">Marked in Gate Entry</div>
        </div>
      </div>
      <div class="metric-card blue">
        <div class="metric-data">
          <h3>${leave}</h3>
          <p>Approved Leave</p>
          <div class="metric-sub text-muted">Medical / Family</div>
        </div>
      </div>
    `;
  },

  async saveAttendance() {
    const selectedClass = document.getElementById('att-class-select').value;
    const selectedSection = document.getElementById('att-section-select').value;
    const selectedDate = document.getElementById('att-date-picker').value;

    if (!this.currentRoster.length) {
      Utils.showToast('No students to record attendance for.', 'warning');
      return;
    }

    try {
      // Remove any existing records for this specific class, section, date
      let existingList = await Api.get('attendance');
      existingList = existingList.filter(a => !(a.date === selectedDate && a.class === selectedClass && a.section === selectedSection));

      // Build new entries
      const newEntries = this.currentRoster.map(s => ({
        id: Utils.generateId('ATT'),
        date: selectedDate,
        class: selectedClass,
        section: selectedSection,
        studentId: s.id,
        status: this.markedStatusMap[s.id] || 'Present'
      }));

      const merged = [...existingList, ...newEntries];
      await Api.set('attendance', merged);

      Utils.showToast(`Attendance saved successfully for ${selectedClass} (${selectedSection}) on ${selectedDate}`, 'success');
      await this.loadRoster();
    } catch (err) {
      Utils.showToast('Error saving attendance: ' + err.message, 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AttendanceModule.init();
});
