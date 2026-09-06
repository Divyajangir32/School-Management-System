/**
 * Green Valley Public School, Jalandhar
 * Subject Catalog Controller
 */

const SubjectsModule = {
  subjectsList: [],

  async init() {
    App.init('Subject Management');
    this.bindEvents();
    await this.loadSubjects();
  },

  bindEvents() {
    document.getElementById('open-add-subject-btn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('subject-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('subject-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-category-select').addEventListener('change', () => {
      this.renderTable();
    });
  },

  async loadSubjects() {
    this.subjectsList = await Api.get('subjects');
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('subject-search-input').value.trim().toLowerCase();
    const cat = document.getElementById('filter-category-select').value;
    const tbody = document.getElementById('subjects-table-body');

    const filtered = this.subjectsList.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      const matchCat = !cat || s.category === cat;
      return matchQ && matchCat;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No subjects found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(s => `
      <tr>
        <td><strong>${s.code}</strong></td>
        <td><strong style="font-size: 0.95rem;">${s.name}</strong></td>
        <td><span class="badge badge-info">${s.category}</span></td>
        <td>${s.weeklyPeriods} periods / week</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="SubjectsModule.openEditModal('${s.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="SubjectsModule.deleteSubject('${s.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('subject-modal-title').textContent = 'Add New Subject';
    document.getElementById('subject-form').reset();
    document.getElementById('subject-form-id').value = '';
    Utils.openModal('subject-modal');
  },

  openEditModal(id) {
    const s = this.subjectsList.find(x => x.id === id);
    if (!s) return;

    document.getElementById('subject-modal-title').textContent = `Edit Subject: ${s.name}`;
    document.getElementById('subject-form-id').value = s.id;
    document.getElementById('sub-code').value = s.code;
    document.getElementById('sub-name').value = s.name;
    document.getElementById('sub-category').value = s.category;
    document.getElementById('sub-periods').value = s.weeklyPeriods;

    Utils.openModal('subject-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('subject-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      code: document.getElementById('sub-code').value.trim().toUpperCase(),
      name: document.getElementById('sub-name').value.trim(),
      category: document.getElementById('sub-category').value,
      weeklyPeriods: Number(document.getElementById('sub-periods').value) || 5
    };

    try {
      if (isEdit) {
        await Api.update('subjects', id, payload);
        Utils.showToast(`Updated subject ${payload.name}`, 'success');
      } else {
        payload.id = Utils.generateId('SUB');
        await Api.add('subjects', payload);
        Utils.showToast(`Created subject ${payload.name}`, 'success');
      }
      Utils.closeModal('subject-modal');
      await this.loadSubjects();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async deleteSubject(id) {
    const s = this.subjectsList.find(x => x.id === id);
    if (!s) return;

    if (confirm(`Are you sure you want to remove ${s.name}?`)) {
      await Api.delete('subjects', id);
      Utils.showToast(`Deleted ${s.name}`, 'info');
      await this.loadSubjects();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SubjectsModule.init();
});
