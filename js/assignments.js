/**
 * Green Valley Public School, Jalandhar
 * Assignments Controller
 */

const AssignmentsModule = {
  assignmentsList: [],

  async init() {
    App.init('Assignments & Homework');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadAssignments();

    // Hide create button for students & parents
    const user = Auth.getCurrentUser();
    if (user && (user.role === 'Student' || user.role === 'Parent')) {
      const btn = document.getElementById('open-add-assignment-btn');
      if (btn) btn.style.display = 'none';
    }
  },

  async populateDropdowns() {
    const filterClass = document.getElementById('filter-assignment-class-select');
    const formClass = document.getElementById('asn-class');
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

    const formSubject = document.getElementById('asn-subject');
    const subjects = await Api.get('subjects');
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = `${s.name} (${s.code})`;
      formSubject.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('open-add-assignment-btn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('assignment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('assignment-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-assignment-class-select').addEventListener('change', () => {
      this.renderTable();
    });
  },

  async loadAssignments() {
    this.assignmentsList = await Api.get('assignments');
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('assignment-search-input').value.trim().toLowerCase();
    const cls = document.getElementById('filter-assignment-class-select').value;
    const tbody = document.getElementById('assignments-table-body');
    const user = Auth.getCurrentUser();

    const filtered = this.assignmentsList.filter(a => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q);
      const matchCls = !cls || a.class === cls;
      return matchQ && matchCls;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No assignments listed.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td>
          <div style="font-weight: 700;">${a.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.description ? a.description.slice(0, 75) + '...' : ''}</div>
        </td>
        <td><span class="badge badge-info">${a.subject}</span></td>
        <td><span class="badge badge-primary">${a.class}</span></td>
        <td>${a.assignedBy || 'Faculty'}</td>
        <td><strong>${Utils.formatDate(a.dueDate, 'readable')}</strong></td>
        <td><span class="badge ${a.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${a.status}</span></td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            ${user.role === 'Admin' || user.role === 'Teacher' ? `
              <button class="btn btn-outline btn-sm" onclick="AssignmentsModule.openEditModal('${a.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="AssignmentsModule.deleteAssignment('${a.id}')">Delete</button>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="alert('Submission received for ${a.title}')">Submit Task</button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('assignment-modal-title').textContent = 'Create Assignment';
    document.getElementById('assignment-form').reset();
    document.getElementById('assignment-form-id').value = '';
    
    // Default due date: 7 days ahead
    const d = new Date();
    d.setDate(d.getDate() + 7);
    document.getElementById('asn-due-date').value = d.toISOString().split('T')[0];
    document.getElementById('asn-status').value = 'Active';

    Utils.openModal('assignment-modal');
  },

  openEditModal(id) {
    const a = this.assignmentsList.find(x => x.id === id);
    if (!a) return;

    document.getElementById('assignment-modal-title').textContent = `Edit Assignment: ${a.title}`;
    document.getElementById('assignment-form-id').value = a.id;
    document.getElementById('asn-title').value = a.title;
    document.getElementById('asn-subject').value = a.subject;
    document.getElementById('asn-class').value = a.class;
    document.getElementById('asn-due-date').value = a.dueDate;
    document.getElementById('asn-status').value = a.status || 'Active';
    document.getElementById('asn-desc').value = a.description || '';

    Utils.openModal('assignment-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('assignment-form-id').value;
    const isEdit = Boolean(id);
    const user = Auth.getCurrentUser();

    const payload = {
      title: document.getElementById('asn-title').value.trim(),
      subject: document.getElementById('asn-subject').value,
      class: document.getElementById('asn-class').value,
      dueDate: document.getElementById('asn-due-date').value,
      status: document.getElementById('asn-status').value,
      description: document.getElementById('asn-desc').value.trim(),
      assignedBy: user ? user.name : 'Faculty'
    };

    try {
      if (isEdit) {
        await Api.update('assignments', id, payload);
        Utils.showToast(`Updated assignment ${payload.title}`, 'success');
      } else {
        payload.id = Utils.generateId('ASN');
        await Api.add('assignments', payload);
        Utils.showToast(`Published assignment ${payload.title}`, 'success');
      }
      Utils.closeModal('assignment-modal');
      await this.loadAssignments();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async deleteAssignment(id) {
    const a = this.assignmentsList.find(x => x.id === id);
    if (!a) return;

    if (confirm(`Are you sure you want to delete ${a.title}?`)) {
      await Api.delete('assignments', id);
      Utils.showToast(`Deleted assignment`, 'info');
      await this.loadAssignments();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AssignmentsModule.init();
});
