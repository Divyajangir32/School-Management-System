/**
 * Green Valley Public School, Jalandhar
 * Student Management Controller
 */

const StudentsModule = {
  allStudents: [],
  filteredStudents: [],

  async init() {
    App.init('Student Management');
    this.populateClassDropdowns();
    this.bindEvents();
    await this.loadStudents();
  },

  populateClassDropdowns() {
    const filterSelect = document.getElementById('filter-class-select');
    const formSelect = document.getElementById('stu-class');
    
    APP_CONFIG.CLASSES.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c;
      opt1.textContent = c;
      filterSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c;
      opt2.textContent = c;
      formSelect.appendChild(opt2);
    });
  },

  bindEvents() {
    // Check create permission for add button
    const canCreate = Permissions.hasPermission(Permissions.PERMS.STUDENTS_CREATE);
    const addBtn = document.getElementById('open-add-student-modal-btn');
    if (addBtn && !canCreate) {
      addBtn.style.display = 'none';
    }

    // Open Add Modal
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    // Form Submit
    document.getElementById('student-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Search input
    document.getElementById('student-search-input').addEventListener('input', () => {
      this.applyFilters();
    });

    // Filters
    document.getElementById('filter-class-select').addEventListener('change', () => {
      this.applyFilters();
    });
    document.getElementById('filter-status-select').addEventListener('change', () => {
      this.applyFilters();
    });

    // Reset filters
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
      document.getElementById('student-search-input').value = '';
      document.getElementById('filter-class-select').value = '';
      document.getElementById('filter-status-select').value = '';
      this.applyFilters();
    });

    // Export CSV
    document.getElementById('export-students-csv-btn').addEventListener('click', () => {
      this.exportCSV();
    });
  },

  async loadStudents() {
    try {
      this.allStudents = await Api.get('students');
      this.applyFilters();
    } catch (err) {
      Utils.showToast('Failed to load students: ' + err.message, 'error');
    }
  },

  applyFilters() {
    const query = document.getElementById('student-search-input').value.trim().toLowerCase();
    const classFilter = document.getElementById('filter-class-select').value;
    const statusFilter = document.getElementById('filter-status-select').value;

    this.filteredStudents = this.allStudents.filter(s => {
      const matchQuery = !query || 
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.admissionNo && s.admissionNo.toLowerCase().includes(query)) ||
        (s.parentName && s.parentName.toLowerCase().includes(query)) ||
        (String(s.rollNo).includes(query)) ||
        (s.phone && s.phone.includes(query));

      const matchClass = !classFilter || s.class === classFilter;
      const matchStatus = !statusFilter || s.status === statusFilter;

      return matchQuery && matchClass && matchStatus;
    });

    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('students-table-body');
    const summary = document.getElementById('student-count-summary');

    summary.textContent = `Showing ${this.filteredStudents.length} of ${this.allStudents.length} student records`;

    if (!this.filteredStudents.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted" style="padding: 30px;">
            No students found matching current filters.
          </td>
        </tr>
      `;
      return;
    }

    const canEdit = Permissions.hasPermission(Permissions.PERMS.STUDENTS_EDIT);
    const canDelete = Permissions.hasPermission(Permissions.PERMS.STUDENTS_DELETE);

    tbody.innerHTML = this.filteredStudents.map(s => `
      <tr>
        <td><strong>${s.admissionNo}</strong></td>
        <td>
          <div style="font-weight: 700;">${s.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${s.gender} &bull; DOB: ${Utils.formatDate(s.dob)}</div>
        </td>
        <td><span class="badge badge-primary">${s.class} (${s.section})</span></td>
        <td>#${s.rollNo || '-'}</td>
        <td>
          <div>${s.parentName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Ph: ${s.parentPhone || '-'}</div>
        </td>
        <td>${s.phone || '-'}</td>
        <td>${s.city || 'Jalandhar'}</td>
        <td>
          <span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
        </td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="StudentsModule.viewStudent('${s.id}')" title="View Profile">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            ${canEdit ? `
              <button class="btn btn-outline btn-sm" onclick="StudentsModule.openEditModal('${s.id}')" title="Edit Student">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
            ` : ''}
            ${canDelete ? `
              <button class="btn btn-danger btn-sm" onclick="StudentsModule.toggleStatus('${s.id}')" title="${s.status === 'Active' ? 'Deactivate' : 'Activate'}">
                ${s.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('student-modal-title').textContent = 'New Student Admission';
    document.getElementById('student-form').reset();
    document.getElementById('student-form-id').value = '';
    
    // Auto generate admission number & dates
    const year = new Date().getFullYear();
    const count = this.allStudents.length + 101;
    document.getElementById('stu-adm-no').value = `GVPS/${year}/${count}`;
    document.getElementById('stu-admission-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('stu-city').value = 'Jalandhar';
    document.getElementById('stu-state').value = 'Punjab';
    document.getElementById('stu-pincode').value = '144022';
    document.getElementById('stu-status').value = 'Active';

    Utils.openModal('student-form-modal');
  },

  openEditModal(id) {
    const s = this.allStudents.find(item => item.id === id);
    if (!s) return;

    document.getElementById('student-modal-title').textContent = `Edit Student: ${s.name}`;
    document.getElementById('student-form-id').value = s.id;
    document.getElementById('stu-adm-no').value = s.admissionNo || '';
    document.getElementById('stu-name').value = s.name || '';
    document.getElementById('stu-dob').value = s.dob || '';
    document.getElementById('stu-gender').value = s.gender || 'Male';
    document.getElementById('stu-phone').value = s.phone || '';
    document.getElementById('stu-email').value = s.email || '';
    document.getElementById('stu-address').value = s.address || '';
    document.getElementById('stu-city').value = s.city || 'Jalandhar';
    document.getElementById('stu-state').value = s.state || 'Punjab';
    document.getElementById('stu-pincode').value = s.pincode || '144022';
    document.getElementById('stu-class').value = s.class || '';
    document.getElementById('stu-section').value = s.section || 'A';
    document.getElementById('stu-roll').value = s.rollNo || 1;
    document.getElementById('stu-parent-name').value = s.parentName || '';
    document.getElementById('stu-parent-phone').value = s.parentPhone || '';
    document.getElementById('stu-admission-date').value = s.admissionDate || '';
    document.getElementById('stu-status').value = s.status || 'Active';

    Utils.openModal('student-form-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('student-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      admissionNo: document.getElementById('stu-adm-no').value.trim(),
      name: document.getElementById('stu-name').value.trim(),
      dob: document.getElementById('stu-dob').value,
      gender: document.getElementById('stu-gender').value,
      phone: document.getElementById('stu-phone').value.trim(),
      email: document.getElementById('stu-email').value.trim(),
      address: document.getElementById('stu-address').value.trim(),
      city: document.getElementById('stu-city').value.trim(),
      state: document.getElementById('stu-state').value.trim(),
      pincode: document.getElementById('stu-pincode').value.trim(),
      class: document.getElementById('stu-class').value,
      section: document.getElementById('stu-section').value,
      rollNo: Number(document.getElementById('stu-roll').value),
      parentName: document.getElementById('stu-parent-name').value.trim(),
      parentPhone: document.getElementById('stu-parent-phone').value.trim(),
      admissionDate: document.getElementById('stu-admission-date').value,
      status: document.getElementById('stu-status').value
    };

    try {
      if (isEdit) {
        await Api.update('students', id, payload);
        Utils.showToast(`Updated student ${payload.name} successfully`, 'success');
      } else {
        payload.id = Utils.generateId('STU');
        await Api.add('students', payload);
        Utils.showToast(`Enrolled student ${payload.name} successfully`, 'success');
      }

      Utils.closeModal('student-form-modal');
      await this.loadStudents();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async toggleStatus(id) {
    const s = this.allStudents.find(item => item.id === id);
    if (!s) return;

    const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
    const action = newStatus === 'Active' ? 'activate' : 'deactivate';

    if (confirm(`Are you sure you want to ${action} ${s.name}?`)) {
      try {
        await Api.update('students', id, { status: newStatus });
        Utils.showToast(`Student ${s.name} marked as ${newStatus}`, 'info');
        await this.loadStudents();
      } catch (err) {
        Utils.showToast('Status update failed: ' + err.message, 'error');
      }
    }
  },

  viewStudent(id) {
    const s = this.allStudents.find(item => item.id === id);
    if (!s) return;

    const body = document.getElementById('student-view-body');
    body.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: #ecfdf5; color: #047857; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #a7f3d0;">
          ${s.name.charAt(0)}
        </div>
        <div>
          <h3 style="font-size: 1.25rem; margin-bottom: 2px;">${s.name}</h3>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Admission No: <strong>${s.admissionNo}</strong> &bull; <span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.9rem;">
        <div><strong>Class & Section:</strong> ${s.class} (${s.section})</div>
        <div><strong>Roll Number:</strong> ${s.rollNo}</div>
        <div><strong>Date of Birth:</strong> ${Utils.formatDate(s.dob, 'readable')}</div>
        <div><strong>Gender:</strong> ${s.gender}</div>
        <div><strong>Admission Date:</strong> ${Utils.formatDate(s.admissionDate, 'readable')}</div>
        <div><strong>Student Mobile:</strong> ${s.phone || 'N/A'}</div>
        <div><strong>Email ID:</strong> ${s.email || 'N/A'}</div>
        <div><strong>Parent / Guardian:</strong> ${s.parentName}</div>
        <div><strong>Parent Contact:</strong> ${s.parentPhone}</div>
      </div>

      <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 0.9rem;">
        <strong>Address (Jalandhar, Punjab):</strong><br>
        ${s.address}, ${s.city}, ${s.state} - ${s.pincode}
      </div>
    `;

    Utils.openModal('student-view-modal');
  },

  exportCSV() {
    const headers = {
      admissionNo: 'Admission No',
      name: 'Full Name',
      class: 'Class',
      section: 'Section',
      rollNo: 'Roll No',
      gender: 'Gender',
      dob: 'Date of Birth',
      parentName: 'Parent Name',
      parentPhone: 'Parent Phone',
      phone: 'Student Phone',
      email: 'Email',
      address: 'Address',
      city: 'City',
      state: 'State',
      pincode: 'PIN Code',
      status: 'Status'
    };

    Utils.downloadCSV('GVPS_Students_Directory_Jalandhar', this.filteredStudents, headers);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  StudentsModule.init();
});
