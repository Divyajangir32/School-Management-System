/**
 * Green Valley Public School, Jalandhar
 * Marks Entry & CBSE Grading Controller
 */

const MarksModule = {
  allStudents: [],
  allExams: [],
  allSubjects: [],
  allMarks: [],
  currentRoster: [],
  marksState: {}, // studentId -> { obtainedMarks, maxMarks, percentage, grade, result }

  async init() {
    App.init('Academic Marks Entry');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadInitialData();
  },

  async populateDropdowns() {
    this.allExams = await Api.get('exams');
    const examSelect = document.getElementById('mrk-exam-select');
    examSelect.innerHTML = '';
    this.allExams.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = `${e.name} (${e.subject} - ${e.class})`;
      examSelect.appendChild(opt);
    });

    const classSelect = document.getElementById('mrk-class-select');
    classSelect.innerHTML = '';
    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      classSelect.appendChild(opt);
    });
    classSelect.value = 'Class 10';

    this.allSubjects = await Api.get('subjects');
    const subSelect = document.getElementById('mrk-subject-select');
    subSelect.innerHTML = '';
    this.allSubjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = `${s.name} (${s.code})`;
      subSelect.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('load-marks-grid-btn').addEventListener('click', () => {
      this.loadMarksGrid();
    });

    document.getElementById('mrk-class-select').addEventListener('change', () => {
      this.loadMarksGrid();
    });

    document.getElementById('mrk-section-select').addEventListener('change', () => {
      this.loadMarksGrid();
    });

    document.getElementById('mrk-subject-select').addEventListener('change', () => {
      this.loadMarksGrid();
    });

    document.getElementById('mrk-exam-select').addEventListener('change', (e) => {
      const selected = this.allExams.find(x => x.id === e.target.value);
      if (selected) {
        if (selected.class) document.getElementById('mrk-class-select').value = selected.class;
        if (selected.subject) document.getElementById('mrk-subject-select').value = selected.subject;
        if (selected.maxMarks) document.getElementById('mrk-max-marks').value = selected.maxMarks;
      }
      this.loadMarksGrid();
    });

    const canEditMarks = Permissions.hasPermission(Permissions.PERMS.MARKS_CREATE) || Permissions.hasPermission(Permissions.PERMS.MARKS_EDIT);
    const saveBtn = document.getElementById('save-marks-batch-btn');
    const saveBtnBtm = document.getElementById('save-marks-batch-btn-bottom');
    if (!canEditMarks) {
      if (saveBtn) saveBtn.style.display = 'none';
      if (saveBtnBtm) saveBtnBtm.style.display = 'none';
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveMarks();
      });
    }
    if (saveBtnBtm) {
      saveBtnBtm.addEventListener('click', () => {
        this.saveMarks();
      });
    }
  },

  async loadInitialData() {
    this.allStudents = await Api.get('students');
    this.allMarks = await Api.get('marks');
    await this.loadMarksGrid();
  },

  async loadMarksGrid() {
    const examId = document.getElementById('mrk-exam-select').value;
    const selectedClass = document.getElementById('mrk-class-select').value;
    const selectedSection = document.getElementById('mrk-section-select').value;
    const selectedSubject = document.getElementById('mrk-subject-select').value;
    const maxMarks = Number(document.getElementById('mrk-max-marks').value) || 100;

    document.getElementById('marks-header-title').innerHTML = `
      <span>Marks Sheet: <strong>${selectedSubject}</strong> &bull; ${selectedClass} (${selectedSection})</span>
    `;

    this.currentRoster = this.allStudents.filter(s =>
      s.class === selectedClass &&
      s.section === selectedSection &&
      s.status === 'Active'
    );

    this.allMarks = await Api.get('marks');
    const existing = this.allMarks.filter(m =>
      m.examId === examId &&
      m.class === selectedClass &&
      m.section === selectedSection &&
      m.subject === selectedSubject
    );

    this.marksState = {};
    this.currentRoster.forEach(s => {
      const match = existing.find(e => e.studentId === s.id);
      const obtained = match ? Number(match.obtainedMarks) : 0;
      const pct = Utils.calculatePercentage(obtained, maxMarks);
      const gradeObj = Utils.calculateGrade(pct);

      this.marksState[s.id] = {
        obtainedMarks: obtained,
        maxMarks: maxMarks,
        percentage: pct,
        grade: gradeObj.grade,
        result: gradeObj.isPass ? 'Pass' : 'Fail'
      };
    });

    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('marks-table-body');
    const maxMarks = Number(document.getElementById('mrk-max-marks').value) || 100;

    if (!this.currentRoster.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding: 30px;">No students enrolled in this class and section.</td></tr>';
      return;
    }

    const canEditMarks = Permissions.hasPermission(Permissions.PERMS.MARKS_CREATE) || Permissions.hasPermission(Permissions.PERMS.MARKS_EDIT);

    tbody.innerHTML = this.currentRoster.map(s => {
      const state = this.marksState[s.id] || { obtainedMarks: 0, percentage: 0, grade: 'E', result: 'Fail' };
      return `
        <tr>
          <td><strong>#${s.rollNo || '-'}</strong></td>
          <td><strong style="font-size: 0.95rem;">${s.name}</strong></td>
          <td>${s.admissionNo}</td>
          <td>
            <input type="number" 
                   class="form-control" 
                   style="width: 100px; font-weight: 700; text-align: center;" 
                   min="0" 
                   max="${maxMarks}" 
                   value="${state.obtainedMarks}" 
                   ${!canEditMarks ? 'disabled readonly' : ''}
                   oninput="MarksModule.onMarksChanged('${s.id}', this.value)">
          </td>
          <td><strong>${maxMarks}</strong></td>
          <td><span id="pct-${s.id}" style="font-weight: 700;">${state.percentage}%</span></td>
          <td><span id="grd-${s.id}" class="badge ${state.grade.startsWith('A') ? 'badge-success' : (state.grade.startsWith('B') ? 'badge-primary' : (state.grade.startsWith('C') ? 'badge-warning' : 'badge-danger'))}">${state.grade}</span></td>
          <td><span id="res-${s.id}" class="badge ${state.result === 'Pass' ? 'badge-success' : 'badge-danger'}">${state.result}</span></td>
        </tr>
      `;
    }).join('');
  },

  onMarksChanged(studentId, val) {
    const maxMarks = Number(document.getElementById('mrk-max-marks').value) || 100;
    const obtained = Math.min(Math.max(Number(val) || 0, 0), maxMarks);
    const pct = Utils.calculatePercentage(obtained, maxMarks);
    const gradeObj = Utils.calculateGrade(pct);

    this.marksState[studentId] = {
      obtainedMarks: obtained,
      maxMarks: maxMarks,
      percentage: pct,
      grade: gradeObj.grade,
      result: gradeObj.isPass ? 'Pass' : 'Fail'
    };

    // Update DOM cells instantly
    const pctEl = document.getElementById(`pct-${studentId}`);
    const grdEl = document.getElementById(`grd-${studentId}`);
    const resEl = document.getElementById(`res-${studentId}`);

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (grdEl) {
      grdEl.textContent = gradeObj.grade;
      grdEl.className = `badge ${gradeObj.grade.startsWith('A') ? 'badge-success' : (gradeObj.grade.startsWith('B') ? 'badge-primary' : (gradeObj.grade.startsWith('C') ? 'badge-warning' : 'badge-danger'))}`;
    }
    if (resEl) {
      resEl.textContent = gradeObj.isPass ? 'Pass' : 'Fail';
      resEl.className = `badge ${gradeObj.isPass ? 'badge-success' : 'badge-danger'}`;
    }
  },

  async saveMarks() {
    const examId = document.getElementById('mrk-exam-select').value;
    const selectedClass = document.getElementById('mrk-class-select').value;
    const selectedSection = document.getElementById('mrk-section-select').value;
    const selectedSubject = document.getElementById('mrk-subject-select').value;
    const examObj = this.allExams.find(x => x.id === examId);
    const examName = examObj ? examObj.name : 'Periodic Assessment';

    if (!this.currentRoster.length) {
      Utils.showToast('No student records to save.', 'warning');
      return;
    }

    try {
      let existingList = await Api.get('marks');
      // Remove previous marks for this exam, class, section, subject
      existingList = existingList.filter(m => !(m.examId === examId && m.class === selectedClass && m.section === selectedSection && m.subject === selectedSubject));

      const newEntries = this.currentRoster.map(s => {
        const state = this.marksState[s.id] || { obtainedMarks: 0, maxMarks: 100, percentage: 0, grade: 'E', result: 'Fail' };
        return {
          id: Utils.generateId('MRK'),
          examId: examId,
          examName: examName,
          studentId: s.id,
          studentName: s.name,
          class: selectedClass,
          section: selectedSection,
          subject: selectedSubject,
          maxMarks: state.maxMarks,
          obtainedMarks: state.obtainedMarks,
          percentage: state.percentage,
          grade: state.grade,
          result: state.result
        };
      });

      await Api.set('marks', [...existingList, ...newEntries]);
      Utils.showToast(`Saved marks successfully for ${this.currentRoster.length} students`, 'success');
      await this.loadMarksGrid();
    } catch (err) {
      Utils.showToast('Error saving marks: ' + err.message, 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MarksModule.init();
});
