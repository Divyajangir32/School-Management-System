/**
 * Green Valley Public School, Jalandhar
 * Results & Report Card Controller
 */

const ResultsModule = {
  allStudents: [],
  allExams: [],
  allMarks: [],
  allSubjects: [],

  async init() {
    App.init('Results & Report Cards');
    await this.loadInitialData();
    this.bindEvents();
    this.renderCard();
  },

  async loadInitialData() {
    this.allStudents = await Api.get('students');
    this.allExams = await Api.get('exams');
    this.allMarks = await Api.get('marks');
    this.allSubjects = await Api.get('subjects');

    this.populateDropdowns();
  },

  populateDropdowns() {
    const classSelect = document.getElementById('res-class-select');
    classSelect.innerHTML = '';
    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      classSelect.appendChild(opt);
    });
    classSelect.value = 'Class 10';

    const examSelect = document.getElementById('res-exam-select');
    examSelect.innerHTML = '';
    this.allExams.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.name;
      examSelect.appendChild(opt);
    });

    this.updateStudentDropdown();
  },

  updateStudentDropdown() {
    const selectedClass = document.getElementById('res-class-select').value;
    const studentSelect = document.getElementById('res-student-select');
    studentSelect.innerHTML = '';

    const matching = this.allStudents.filter(s => s.class === selectedClass);
    matching.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (Roll #${s.rollNo} - ${s.admissionNo})`;
      studentSelect.appendChild(opt);
    });

    // If logged in as student or parent, preselect student
    const currentUser = Auth.getCurrentUser();
    if (currentUser && currentUser.studentId) {
      studentSelect.value = currentUser.studentId;
    }
  },

  bindEvents() {
    document.getElementById('res-class-select').addEventListener('change', () => {
      this.updateStudentDropdown();
      this.renderCard();
    });

    document.getElementById('res-exam-select').addEventListener('change', () => {
      this.renderCard();
    });

    document.getElementById('res-student-select').addEventListener('change', () => {
      this.renderCard();
    });

    document.getElementById('view-report-card-btn').addEventListener('click', () => {
      this.renderCard();
    });
  },

  async renderCard() {
    const studentId = document.getElementById('res-student-select').value;
    const examId = document.getElementById('res-exam-select').value;

    const student = this.allStudents.find(s => s.id === studentId);
    const exam = this.allExams.find(e => e.id === examId);

    if (!student) {
      document.getElementById('card-student-name').textContent = 'No student selected';
      return;
    }

    // Header info
    document.getElementById('card-student-name').textContent = student.name;
    document.getElementById('card-adm-no').textContent = student.admissionNo;
    document.getElementById('card-class-section').textContent = `${student.class} (${student.section})`;
    document.getElementById('card-roll-no').textContent = `#${student.rollNo || '-'}`;
    document.getElementById('card-parent-name').textContent = student.parentName;
    document.getElementById('card-exam-name').textContent = exam ? exam.name : 'Half-Yearly Examination';

    // Refresh marks
    this.allMarks = await Api.get('marks');

    // Find all marks for this student
    let marksList = this.allMarks.filter(m => m.studentId === student.id);
    if (examId) {
      const specific = marksList.filter(m => m.examId === examId);
      if (specific.length) marksList = specific;
    }

    const tbody = document.getElementById('card-marks-tbody');
    if (!marksList.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted" style="border: 1px solid #0f172a; padding: 24px;">
            No marks records have been submitted for ${student.name} in this examination yet.
          </td>
        </tr>
      `;
      document.getElementById('card-total-max').textContent = '-';
      document.getElementById('card-total-obtained').textContent = '-';
      document.getElementById('card-total-pct').textContent = '-';
      document.getElementById('card-final-grade').textContent = '-';
      document.getElementById('card-overall-result').textContent = 'EVALUATION PENDING';
      document.getElementById('card-aggregate-pct').textContent = '0%';
      return;
    }

    let totalMax = 0;
    let totalObtained = 0;

    tbody.innerHTML = marksList.map(m => {
      const max = Number(m.maxMarks) || 100;
      const obt = Number(m.obtainedMarks) || 0;
      totalMax += max;
      totalObtained += obt;

      const subObj = this.allSubjects.find(s => s.name === m.subject);
      const code = subObj ? subObj.code : 'CBSE';

      return `
        <tr>
          <td style="border: 1px solid #0f172a; font-weight: 600;">${code}</td>
          <td style="border: 1px solid #0f172a; font-weight: 700;">${m.subject}</td>
          <td style="border: 1px solid #0f172a; text-align: center;">${max}</td>
          <td style="border: 1px solid #0f172a; text-align: center; font-weight: 700;">${obt}</td>
          <td style="border: 1px solid #0f172a; text-align: center;">${m.percentage}%</td>
          <td style="border: 1px solid #0f172a; text-align: center;"><span class="badge ${m.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}">${m.grade}</span></td>
        </tr>
      `;
    }).join('');

    const aggregatePct = Utils.calculatePercentage(totalObtained, totalMax);
    const finalGradeObj = Utils.calculateGrade(aggregatePct);

    document.getElementById('card-total-max').textContent = totalMax;
    document.getElementById('card-total-obtained').textContent = totalObtained;
    document.getElementById('card-total-pct').textContent = `${aggregatePct}%`;
    document.getElementById('card-final-grade').textContent = finalGradeObj.grade;
    document.getElementById('card-aggregate-pct').textContent = `${aggregatePct}%`;
    document.getElementById('card-overall-result').textContent = finalGradeObj.isPass ? `PASSED (${finalGradeObj.remark.toUpperCase()})` : 'FAILED / COMPARTMENT';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ResultsModule.init();
});
