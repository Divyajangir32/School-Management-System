/**
 * Green Valley Public School, Jalandhar
 * Exam Schedule Controller
 */

const ExamsModule = {
  examsList: [],

  async init() {
    App.init('Examinations & Date Sheets');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadExams();
  },

  async populateDropdowns() {
    const filterType = document.getElementById('filter-exam-type-select');
    const formType = document.getElementById('ex-type');
    APP_CONFIG.EXAM_TYPES.forEach(t => {
      const opt1 = document.createElement('option');
      opt1.value = t;
      opt1.textContent = t;
      filterType.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = t;
      opt2.textContent = t;
      formType.appendChild(opt2);
    });

    const filterClass = document.getElementById('filter-exam-class-select');
    const formClass = document.getElementById('ex-class');
    APP_CONFIG.CLASSES.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c;
      opt1.textContent = c;
      filterClass.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c;
      opt2.textContent = c;
      formClass.appendChild(opt2);
    });

    const formSubject = document.getElementById('ex-subject');
    const subjects = await Api.get('subjects');
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = `${s.name} (${s.code})`;
      formSubject.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('open-add-exam-btn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('exam-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('exam-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-exam-type-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('filter-exam-class-select').addEventListener('change', () => {
      this.renderTable();
    });
  },

  async loadExams() {
    this.examsList = await Api.get('exams');
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('exam-search-input').value.trim().toLowerCase();
    const type = document.getElementById('filter-exam-type-select').value;
    const cls = document.getElementById('filter-exam-class-select').value;
    const tbody = document.getElementById('exams-table-body');

    const filtered = this.examsList.filter(e => {
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) || e.class.toLowerCase().includes(q);
      const matchType = !type || e.examType === type;
      const matchClass = !cls || e.class === cls;
      return matchQ && matchType && matchClass;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No scheduled examinations found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(e => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td><span class="badge badge-info">${e.examType}</span></td>
        <td><span class="badge badge-primary">${e.class} (${e.section})</span></td>
        <td><strong>${e.subject}</strong></td>
        <td>${Utils.formatDate(e.date, 'readable')}</td>
        <td>${e.startTime} - ${e.endTime}</td>
        <td><strong>${e.maxMarks || 100} Marks</strong></td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="ExamsModule.openEditModal('${e.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="ExamsModule.deleteExam('${e.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('exam-modal-title').textContent = 'Schedule New Exam';
    document.getElementById('exam-form').reset();
    document.getElementById('exam-form-id').value = '';
    document.getElementById('ex-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('ex-max-marks').value = 100;
    Utils.openModal('exam-form-modal');
  },

  openEditModal(id) {
    const e = this.examsList.find(x => x.id === id);
    if (!e) return;

    document.getElementById('exam-modal-title').textContent = `Edit Exam: ${e.name}`;
    document.getElementById('exam-form-id').value = e.id;
    document.getElementById('ex-name').value = e.name;
    document.getElementById('ex-type').value = e.examType;
    document.getElementById('ex-subject').value = e.subject;
    document.getElementById('ex-class').value = e.class;
    document.getElementById('ex-section').value = e.section || 'A';
    document.getElementById('ex-date').value = e.date;
    document.getElementById('ex-max-marks').value = e.maxMarks || 100;
    document.getElementById('ex-start-time').value = e.startTime || '09:00';
    document.getElementById('ex-end-time').value = e.endTime || '12:00';

    Utils.openModal('exam-form-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('exam-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      name: document.getElementById('ex-name').value.trim(),
      examType: document.getElementById('ex-type').value,
      subject: document.getElementById('ex-subject').value,
      class: document.getElementById('ex-class').value,
      section: document.getElementById('ex-section').value,
      date: document.getElementById('ex-date').value,
      maxMarks: Number(document.getElementById('ex-max-marks').value) || 100,
      startTime: document.getElementById('ex-start-time').value,
      endTime: document.getElementById('ex-end-time').value
    };

    try {
      if (isEdit) {
        await Api.update('exams', id, payload);
        Utils.showToast(`Updated exam ${payload.name}`, 'success');
      } else {
        payload.id = Utils.generateId('EXM');
        await Api.add('exams', payload);
        Utils.showToast(`Scheduled exam ${payload.name}`, 'success');
      }
      Utils.closeModal('exam-form-modal');
      await this.loadExams();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async deleteExam(id) {
    const e = this.examsList.find(x => x.id === id);
    if (!e) return;

    if (confirm(`Are you sure you want to remove ${e.name} (${e.subject})?`)) {
      await Api.delete('exams', id);
      Utils.showToast(`Removed exam`, 'info');
      await this.loadExams();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ExamsModule.init();
});
