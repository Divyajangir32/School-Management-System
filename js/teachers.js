/**
 * Green Valley Public School, Jalandhar
 * Teacher / Faculty Controller
 */

const TeachersModule = {
  allTeachers: [],
  filteredTeachers: [],

  async init() {
    App.init('Faculty & Teacher Management');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadTeachers();
  },

  async populateDropdowns() {
    const filterSubject = document.getElementById('filter-subject-select');
    const formSubject = document.getElementById('tea-subject');
    const formClass = document.getElementById('tea-assigned-class');

    const subjects = await Api.get('subjects');
    subjects.forEach(s => {
      const opt1 = document.createElement('option');
      opt1.value = s.name;
      opt1.textContent = s.name;
      filterSubject.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = s.name;
      opt2.textContent = s.name;
      formSubject.appendChild(opt2);
    });

    APP_CONFIG.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `Class Teacher of ${c}`;
      formClass.appendChild(opt);
    });
  },

  bindEvents() {
    const canCreate = Permissions.hasPermission(Permissions.PERMS.TEACHERS_CREATE);
    const addBtn = document.getElementById('open-add-teacher-modal-btn');
    if (addBtn && !canCreate) {
      addBtn.style.display = 'none';
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    document.getElementById('teacher-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('teacher-search-input').addEventListener('input', () => {
      this.applyFilters();
    });

    document.getElementById('filter-subject-select').addEventListener('change', () => {
      this.applyFilters();
    });

    document.getElementById('filter-status-select').addEventListener('change', () => {
      this.applyFilters();
    });

    document.getElementById('reset-filters-btn').addEventListener('click', () => {
      document.getElementById('teacher-search-input').value = '';
      document.getElementById('filter-subject-select').value = '';
      document.getElementById('filter-status-select').value = '';
      this.applyFilters();
    });

    document.getElementById('export-teachers-csv-btn').addEventListener('click', () => {
      this.exportCSV();
    });
  },

  async loadTeachers() {
    try {
      this.allTeachers = await Api.get('teachers');
      this.applyFilters();
    } catch (err) {
      Utils.showToast('Failed to load faculty: ' + err.message, 'error');
    }
  },

  applyFilters() {
    const q = document.getElementById('teacher-search-input').value.trim().toLowerCase();
    const subj = document.getElementById('filter-subject-select').value;
    const stat = document.getElementById('filter-status-select').value;

    this.filteredTeachers = this.allTeachers.filter(t => {
      const matchQ = !q ||
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.employeeId && t.employeeId.toLowerCase().includes(q)) ||
        (t.qualification && t.qualification.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q));

      const matchSubj = !subj || t.subject === subj;
      const matchStat = !stat || t.status === stat;

      return matchQ && matchSubj && matchStat;
    });

    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('teachers-table-body');
    const summary = document.getElementById('teacher-count-summary');

    summary.textContent = `Showing ${this.filteredTeachers.length} of ${this.allTeachers.length} faculty records`;

    if (!this.filteredTeachers.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 30px;">No faculty members found.</td></tr>';
      return;
    }

    const canEdit = Permissions.hasPermission(Permissions.PERMS.TEACHERS_EDIT);
    const canDelete = Permissions.hasPermission(Permissions.PERMS.TEACHERS_DELETE);

    tbody.innerHTML = this.filteredTeachers.map(t => `
      <tr>
        <td><strong>${t.employeeId}</strong></td>
        <td>
          <div style="font-weight: 700;">${t.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${t.email}</div>
        </td>
        <td><span class="badge badge-info">${t.subject}</span></td>
        <td>${t.assignedClass ? `<span class="badge badge-primary">${t.assignedClass}</span>` : '<span class="text-muted">-</span>'}</td>
        <td style="font-size: 0.85rem;">${t.qualification}</td>
        <td>${t.phone}</td>
        <td>${Utils.formatDate(t.joiningDate, 'readable')}</td>
        <td><span class="badge ${t.status === 'Active' ? 'badge-success' : 'badge-danger'}">${t.status}</span></td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="TeachersModule.viewTeacher('${t.id}')" title="View Profile">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            ${canEdit ? `
              <button class="btn btn-outline btn-sm" onclick="TeachersModule.openEditModal('${t.id}')" title="Edit">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
            ` : ''}
            ${canDelete ? `
              <button class="btn btn-danger btn-sm" onclick="TeachersModule.toggleStatus('${t.id}')">
                ${t.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('teacher-modal-title').textContent = 'Add Faculty Member';
    document.getElementById('teacher-form').reset();
    document.getElementById('teacher-form-id').value = '';
    
    const count = this.allTeachers.length + 1;
    document.getElementById('tea-emp-id').value = `GVPS-T${String(count).padStart(2, '0')}`;
    document.getElementById('tea-joining-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('tea-status').value = 'Active';

    Utils.openModal('teacher-form-modal');
  },

  openEditModal(id) {
    const t = this.allTeachers.find(x => x.id === id);
    if (!t) return;

    document.getElementById('teacher-modal-title').textContent = `Edit Faculty: ${t.name}`;
    document.getElementById('teacher-form-id').value = t.id;
    document.getElementById('tea-emp-id').value = t.employeeId || '';
    document.getElementById('tea-name').value = t.name || '';
    document.getElementById('tea-subject').value = t.subject || '';
    document.getElementById('tea-assigned-class').value = t.assignedClass || '';
    document.getElementById('tea-qualification').value = t.qualification || '';
    document.getElementById('tea-phone').value = t.phone || '';
    document.getElementById('tea-email').value = t.email || '';
    document.getElementById('tea-joining-date').value = t.joiningDate || '';
    document.getElementById('tea-status').value = t.status || 'Active';
    document.getElementById('tea-address').value = t.address || '';

    Utils.openModal('teacher-form-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('teacher-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      employeeId: document.getElementById('tea-emp-id').value.trim(),
      name: document.getElementById('tea-name').value.trim(),
      subject: document.getElementById('tea-subject').value,
      assignedClass: document.getElementById('tea-assigned-class').value,
      qualification: document.getElementById('tea-qualification').value.trim(),
      phone: document.getElementById('tea-phone').value.trim(),
      email: document.getElementById('tea-email').value.trim(),
      joiningDate: document.getElementById('tea-joining-date').value,
      status: document.getElementById('tea-status').value,
      address: document.getElementById('tea-address').value.trim()
    };

    try {
      if (isEdit) {
        await Api.update('teachers', id, payload);
        Utils.showToast(`Updated faculty details for ${payload.name}`, 'success');
      } else {
        payload.id = Utils.generateId('TEA');
        await Api.add('teachers', payload);
        Utils.showToast(`Added faculty member ${payload.name}`, 'success');
      }
      Utils.closeModal('teacher-form-modal');
      await this.loadTeachers();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async toggleStatus(id) {
    const t = this.allTeachers.find(x => x.id === id);
    if (!t) return;

    const newStatus = t.status === 'Active' ? 'Inactive' : 'Active';
    if (confirm(`Change status of ${t.name} to ${newStatus}?`)) {
      await Api.update('teachers', id, { status: newStatus });
      Utils.showToast(`${t.name} is now ${newStatus}`, 'info');
      await this.loadTeachers();
    }
  },

  viewTeacher(id) {
    const t = this.allTeachers.find(x => x.id === id);
    if (!t) return;

    const body = document.getElementById('teacher-view-body');
    body.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: #f0f9ff; color: #0284c7; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #bae6fd;">
          ${t.name.charAt(0)}
        </div>
        <div>
          <h3 style="font-size: 1.25rem; margin-bottom: 2px;">${t.name}</h3>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Employee ID: <strong>${t.employeeId}</strong> &bull; <span class="badge ${t.status === 'Active' ? 'badge-success' : 'badge-danger'}">${t.status}</span>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.9rem;">
        <div><strong>Specialization:</strong> ${t.subject}</div>
        <div><strong>Class In-charge:</strong> ${t.assignedClass || 'None'}</div>
        <div><strong>Qualification:</strong> ${t.qualification}</div>
        <div><strong>Joining Date:</strong> ${Utils.formatDate(t.joiningDate, 'readable')}</div>
        <div><strong>Contact Phone:</strong> ${t.phone}</div>
        <div><strong>Official Email:</strong> ${t.email}</div>
      </div>

      <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 0.9rem;">
        <strong>Address:</strong><br>
        ${t.address || 'Urban Estate / Jalandhar, Punjab'}
      </div>
    `;

    Utils.openModal('teacher-view-modal');
  },

  exportCSV() {
    const headers = {
      employeeId: 'Employee ID',
      name: 'Faculty Name',
      subject: 'Subject',
      assignedClass: 'Class Teacher',
      qualification: 'Qualification',
      phone: 'Phone',
      email: 'Email',
      joiningDate: 'Joining Date',
      address: 'Address',
      status: 'Status'
    };
    Utils.downloadCSV('GVPS_Faculty_Directory_Jalandhar', this.filteredTeachers, headers);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  TeachersModule.init();
});
