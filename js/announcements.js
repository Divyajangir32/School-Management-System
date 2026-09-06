/**
 * Green Valley Public School, Jalandhar
 * Announcements & Circulars Controller
 */

const AnnouncementsModule = {
  announcementsList: [],

  async init() {
    App.init('School Notices & Circulars');
    this.bindEvents();
    await this.loadAnnouncements();

    const user = Auth.getCurrentUser();
    if (user && (user.role === 'Student' || user.role === 'Parent')) {
      const btn = document.getElementById('open-add-announcement-btn');
      if (btn) btn.style.display = 'none';
    }
  },

  bindEvents() {
    document.getElementById('open-add-announcement-btn').addEventListener('click', () => {
      this.openAddModal();
    });

    document.getElementById('announcement-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('announcement-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-audience-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('filter-priority-select').addEventListener('change', () => {
      this.renderTable();
    });
  },

  async loadAnnouncements() {
    this.announcementsList = await Api.get('announcements');
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('announcement-search-input').value.trim().toLowerCase();
    const aud = document.getElementById('filter-audience-select').value;
    const prio = document.getElementById('filter-priority-select').value;
    const tbody = document.getElementById('announcements-table-body');
    const user = Auth.getCurrentUser();

    const filtered = this.announcementsList.filter(a => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      const matchAud = !aud || a.audience === aud;
      const matchPrio = !prio || a.priority === prio;
      return matchQ && matchAud && matchPrio;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No notices found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td><strong>${Utils.formatDate(a.date, 'readable')}</strong></td>
        <td>
          <div style="font-weight: 700;">${a.title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${a.description ? a.description.slice(0, 90) + '...' : ''}</div>
        </td>
        <td><span class="badge badge-info">${a.audience}</span></td>
        <td><span class="badge ${a.priority === 'High' ? 'badge-danger' : (a.priority === 'Medium' ? 'badge-primary' : 'badge-neutral')}">${a.priority}</span></td>
        <td>${a.author || 'School Office'}</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            ${user.role === 'Admin' ? `
              <button class="btn btn-outline btn-sm" onclick="AnnouncementsModule.openEditModal('${a.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="AnnouncementsModule.deleteAnnouncement('${a.id}')">Delete</button>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="alert('${a.description.replace(/'/g, "\\'")}')">View</button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('announcement-modal-title').textContent = 'Publish Notice / Circular';
    document.getElementById('announcement-form').reset();
    document.getElementById('announcement-form-id').value = '';
    document.getElementById('anc-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('anc-priority').value = 'Medium';
    document.getElementById('anc-author').value = 'Principal Office';

    Utils.openModal('announcement-modal');
  },

  openEditModal(id) {
    const a = this.announcementsList.find(x => x.id === id);
    if (!a) return;

    document.getElementById('announcement-modal-title').textContent = `Edit Notice: ${a.title}`;
    document.getElementById('announcement-form-id').value = a.id;
    document.getElementById('anc-title').value = a.title;
    document.getElementById('anc-audience').value = a.audience;
    document.getElementById('anc-priority').value = a.priority;
    document.getElementById('anc-date').value = a.date;
    document.getElementById('anc-author').value = a.author;
    document.getElementById('anc-desc').value = a.description;

    Utils.openModal('announcement-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('announcement-form-id').value;
    const isEdit = Boolean(id);

    const payload = {
      title: document.getElementById('anc-title').value.trim(),
      audience: document.getElementById('anc-audience').value,
      priority: document.getElementById('anc-priority').value,
      date: document.getElementById('anc-date').value,
      author: document.getElementById('anc-author').value.trim(),
      description: document.getElementById('anc-desc').value.trim()
    };

    try {
      if (isEdit) {
        await Api.update('announcements', id, payload);
        Utils.showToast(`Updated notice ${payload.title}`, 'success');
      } else {
        payload.id = Utils.generateId('ANC');
        await Api.add('announcements', payload);
        Utils.showToast(`Published notice successfully`, 'success');
      }
      Utils.closeModal('announcement-modal');
      await this.loadAnnouncements();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  async deleteAnnouncement(id) {
    const a = this.announcementsList.find(x => x.id === id);
    if (!a) return;

    if (confirm(`Delete circular "${a.title}"?`)) {
      await Api.delete('announcements', id);
      Utils.showToast('Notice deleted', 'info');
      await this.loadAnnouncements();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AnnouncementsModule.init();
});
