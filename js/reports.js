/**
 * Green Valley Public School, Jalandhar
 * Reports & Data Exporter Controller
 */

const ReportsModule = {
  currentType: 'students',
  currentData: [],

  async init() {
    App.init('Reports & Analytics');
    this.bindEvents();
    await this.loadReport('students');
  },

  bindEvents() {
    document.getElementById('report-type-select').addEventListener('change', (e) => {
      this.loadReport(e.target.value);
    });

    document.getElementById('refresh-report-btn').addEventListener('click', () => {
      const val = document.getElementById('report-type-select').value;
      this.loadReport(val);
    });

    document.getElementById('export-active-report-btn').addEventListener('click', () => {
      this.exportCurrent();
    });
  },

  async loadReport(type) {
    this.currentType = type;
    this.currentData = await Api.get(type);

    const thead = document.getElementById('report-table-head');
    const tbody = document.getElementById('report-table-body');
    const titleEl = document.getElementById('report-header-title');
    const printTitle = document.getElementById('print-report-title');
    const countEl = document.getElementById('report-records-count');

    countEl.textContent = `${this.currentData.length} Records`;

    if (type === 'students') {
      titleEl.innerHTML = '<span>Student Master Enrollment Report</span>';
      printTitle.textContent = 'STUDENT MASTER ENROLLMENT REPORT - SESSION 2025-2026';
      thead.innerHTML = `
        <tr>
          <th>Admission No</th>
          <th>Student Name</th>
          <th>Class / Sec</th>
          <th>Roll No</th>
          <th>Parent Name</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Status</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(s => `
        <tr>
          <td><strong>${s.admissionNo}</strong></td>
          <td>${s.name}</td>
          <td>${s.class} (${s.section})</td>
          <td>#${s.rollNo || '-'}</td>
          <td>${s.parentName}</td>
          <td>${s.phone || s.parentPhone}</td>
          <td>${s.address}, ${s.city}</td>
          <td><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'teachers') {
      titleEl.innerHTML = '<span>Faculty Directory & Staff Allocation Report</span>';
      printTitle.textContent = 'FACULTY DIRECTORY REPORT';
      thead.innerHTML = `
        <tr>
          <th>Emp ID</th>
          <th>Teacher Name</th>
          <th>Subject</th>
          <th>Class Teacher</th>
          <th>Qualification</th>
          <th>Phone</th>
          <th>Joining Date</th>
          <th>Status</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(t => `
        <tr>
          <td><strong>${t.employeeId}</strong></td>
          <td>${t.name}</td>
          <td>${t.subject}</td>
          <td>${t.assignedClass || '-'}</td>
          <td>${t.qualification}</td>
          <td>${t.phone}</td>
          <td>${Utils.formatDate(t.joiningDate, 'readable')}</td>
          <td><span class="badge badge-success">${t.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'attendance') {
      titleEl.innerHTML = '<span>Attendance Roll Registry Report</span>';
      printTitle.textContent = 'DAILY ATTENDANCE ROLL REPORT';
      thead.innerHTML = `
        <tr>
          <th>Date</th>
          <th>Class</th>
          <th>Section</th>
          <th>Student ID</th>
          <th>Status</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(a => `
        <tr>
          <td>${Utils.formatDate(a.date, 'readable')}</td>
          <td>${a.class}</td>
          <td>${a.section}</td>
          <td>${a.studentId}</td>
          <td><span class="badge ${a.status === 'Present' ? 'badge-success' : (a.status === 'Absent' ? 'badge-danger' : 'badge-warning')}">${a.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'marks') {
      titleEl.innerHTML = '<span>Academic Marks & Examination Ledger</span>';
      printTitle.textContent = 'EXAMINATION MARKS LEDGER REPORT';
      thead.innerHTML = `
        <tr>
          <th>Exam</th>
          <th>Student Name</th>
          <th>Class</th>
          <th>Subject</th>
          <th>Obtained / Max</th>
          <th>Percentage</th>
          <th>Grade</th>
          <th>Result</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(m => `
        <tr>
          <td>${m.examName || 'Exam'}</td>
          <td><strong>${m.studentName}</strong></td>
          <td>${m.class} (${m.section})</td>
          <td>${m.subject}</td>
          <td><strong>${m.obtainedMarks} / ${m.maxMarks}</strong></td>
          <td>${m.percentage}%</td>
          <td><span class="badge ${m.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}">${m.grade}</span></td>
          <td><span class="badge ${m.result === 'Pass' ? 'badge-success' : 'badge-danger'}">${m.result}</span></td>
        </tr>
      `).join('');
    } else if (type === 'fees') {
      titleEl.innerHTML = '<span>Fee Collection & Outstanding Balances Report</span>';
      printTitle.textContent = 'FEE COLLECTION & DUES REPORT (INR)';
      thead.innerHTML = `
        <tr>
          <th>Receipt No</th>
          <th>Student Name</th>
          <th>Class</th>
          <th>Particulars</th>
          <th>Total Demanded</th>
          <th>Amount Paid</th>
          <th>Pending Due</th>
          <th>Status</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(f => `
        <tr>
          <td><strong>${f.receiptNo}</strong></td>
          <td>${f.studentName}</td>
          <td>${f.class}</td>
          <td>${f.feeType}</td>
          <td>${Utils.formatCurrency(f.amount)}</td>
          <td class="text-success font-bold">${Utils.formatCurrency(f.paidAmount)}</td>
          <td class="${f.pendingAmount > 0 ? 'text-danger font-bold' : ''}">${Utils.formatCurrency(f.pendingAmount)}</td>
          <td><span class="badge ${f.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${f.status}</span></td>
        </tr>
      `).join('');
    } else if (type === 'classes') {
      titleEl.innerHTML = '<span>Classroom Roster & Capacity Report</span>';
      printTitle.textContent = 'CLASS & DESK CAPACITY REPORT';
      thead.innerHTML = `
        <tr>
          <th>Class Name</th>
          <th>Section</th>
          <th>Class Teacher</th>
          <th>Room / Hall</th>
          <th>Capacity</th>
        </tr>
      `;
      tbody.innerHTML = this.currentData.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>Section ${c.section}</td>
          <td>${c.classTeacher || 'Unassigned'}</td>
          <td>${c.roomNo || '-'}</td>
          <td>${c.capacity || 40} students</td>
        </tr>
      `).join('');
    }
  },

  exportCurrent() {
    if (!this.currentData || !this.currentData.length) {
      Utils.showToast('No data to export', 'warning');
      return;
    }
    const filename = `GVPS_${this.currentType.toUpperCase()}_REPORT_Jalandhar`;

    let headers = {};
    if (this.currentType === 'students') {
      headers = { admissionNo: 'Adm No', name: 'Name', class: 'Class', section: 'Section', rollNo: 'Roll No', parentName: 'Parent', phone: 'Phone', status: 'Status' };
    } else if (this.currentType === 'teachers') {
      headers = { employeeId: 'Emp ID', name: 'Name', subject: 'Subject', assignedClass: 'Class Teacher', phone: 'Phone', qualification: 'Qualification' };
    } else if (this.currentType === 'attendance') {
      headers = { date: 'Date', class: 'Class', section: 'Section', studentId: 'Student ID', status: 'Status' };
    } else if (this.currentType === 'marks') {
      headers = { examName: 'Exam', studentName: 'Student', class: 'Class', subject: 'Subject', obtainedMarks: 'Marks', percentage: 'Pct', grade: 'Grade', result: 'Result' };
    } else if (this.currentType === 'fees') {
      headers = { receiptNo: 'Receipt No', studentName: 'Student', class: 'Class', feeType: 'Fee', amount: 'Total', paidAmount: 'Paid', pendingAmount: 'Pending', status: 'Status' };
    } else {
      headers = { name: 'Class', section: 'Section', classTeacher: 'Class Teacher', roomNo: 'Room', capacity: 'Capacity' };
    }

    Utils.downloadCSV(filename, this.currentData, headers);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ReportsModule.init();
});
