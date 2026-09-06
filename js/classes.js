/**
 * Green Valley Public School, Jalandhar
 * Class & Section Controller
 */

const ClassesModule = {
  classesList: [],
  studentsList: [],
  teachersList: [],

  async init() {
    App.init('Classes & Sections');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadData();
  },

  async populateDropdowns() {
    const clsSelect = document.getElementById('cls-name');
    clsSelect.innerHTML = '';
    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      clsSelect.appendChild(opt);
    });

    const teacherSelect = document.getElementById('cls-teacher');
    teacherSelect.innerHTML = '<option value="">-- Select Class Teacher --</option>';
    this.teachersList = await Api.get('teachers');
    this.teachersList.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.textContent = `${t.name} (${t.subject})`;
      teacherSelect.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('open-add-class-btn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('class-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  },

  async loadData() {
    this.classesList = await Api.get('classes');
    this.studentsList = await Api.get('students');
    this.renderSummary();
    this.renderTable();
  },

  renderSummary() {
    const container = document.getElementById('class-summary-cards');
    const totalCapacity = this.classesList.reduce((acc, c) => acc + (Number(c.capacity) || 40), 0);
    const totalEnrolled = this.studentsList.length;

    container.innerHTML = `
      <div class="metric-card emerald">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
        <div class="metric-data">
          <h3>${this.classesList.length}</h3>
          <p>Active Class Divisions</p>
          <div class="metric-sub text-success">Junior, Middle & Senior</div>
        </div>
      </div>

      <div class="metric-card blue">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>
        <div class="metric-data">
          <h3>${totalEnrolled}</h3>
          <p>Total Enrolled</p>
          <div class="metric-sub text-muted">Across all sections</div>
        </div>
      </div>

      <div class="metric-card amber">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"/></svg>
        </div>
        <div class="metric-data">
          <h3>${totalCapacity}</h3>
          <p>Total Desk Capacity</p>
          <div class="metric-sub text-muted">${totalCapacity - totalEnrolled} seats available</div>
        </div>
      </div>
    `;
  },

  renderTable() {
    const tbody = document.getElementById('classes-table-body');
    if (!this.classesList.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No classes configured.</td></tr>';
      return;
    }

    tbody.innerHTML = this.classesList.map(c => {
      const studentCount = this.studentsList.filter(s => s.class === c.name && s.section === c.section).length;
      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td><span class="badge badge-info">Section ${c.section}</span></td>
          <td>${c.classTeacher ? `<strong>${c.classTeacher}</strong>` : '<span class="text-muted">Unassigned</span>'}</td>
          <td>${c.roomNo || '-'}</td>
          <td>
            <strong>${studentCount}</strong> <span class="text-muted">students</span>
          </td>
          <td>${c.capacity || 40} seats</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-outline btn-sm" onclick="ClassesModule.openEditModal('${c.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="ClassesModule.deleteClass('${c.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openAddModal() {
    document.getElementById('class-modal-title').textContent = 'Create Class & Section';
    document.getElementById('class-form').reset();
    document.getElementById('class-form-id').value = '';
    Utils.openModal('class-modal');
  },

  openEditModal(id) {
    const c = this.classesList.find(item => item.id === id);
    if (!c) return;

    document.getElementById('class-modal-title').textContent = `Edit Class: ${c.name} (${c.section})`;
    document.getElementById('class-form-id').value = c.id;
    document.getElementById('cls-name').value = c.name;
    document.getElementById('cls-section').value = c.section;
    document.getElementById('cls-room').value = c.roomNo || '';
    document.getElementById('cls-teacher').value = c.classTeacher || '';
    document.getElementById('cls-capacity').value = c.capacity || 40;

    Utils.openModal('class-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('class-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      name: document.getElementById('cls-name').value,
      section: document.getElementById('cls-section').value,
      roomNo: document.getElementById('cls-room').value.trim(),
      classTeacher: document.getElementById('cls-teacher').value,
      capacity: Number(document.getElementById('cls-capacity').value) || 40
    };

    try {
      if (isEdit) {
        await Api.update('classes', id, payload);
        Utils.showToast(`Updated ${payload.name} (${payload.section})`, 'success');
      } else {
        payload.id = Utils.generateId('CLS');
        await Api.add('classes', payload);
        Utils.showToast(`Created class ${payload.name} (${payload.section})`, 'success');
      }
      Utils.closeModal('class-modal');
      await this.loadData();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async deleteClass(id) {
    const c = this.classesList.find(item => item.id === id);
    if (!c) return;

    if (confirm(`Are you sure you want to delete ${c.name} (${c.section})?`)) {
      await Api.delete('classes', id);
      Utils.showToast(`Deleted ${c.name}`, 'info');
      await this.loadData();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ClassesModule.init();
});
