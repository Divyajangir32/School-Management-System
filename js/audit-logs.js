/**
 * Green Valley Public School, Jalandhar
 * Security Audit Logs Controller
 */

const AuditLogsModule = {
  allLogs: [],

  async init() {
    App.init('Security Audit Logs');
    this.bindEvents();
    await this.loadLogs();
  },

  bindEvents() {
    document.getElementById('audit-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-audit-role-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('filter-audit-status-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('export-audit-csv-btn').addEventListener('click', () => {
      this.exportCSV();
    });
  },

  async loadLogs() {
    this.allLogs = await Api.get('audit_logs');
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('audit-search-input').value.trim().toLowerCase();
    const roleFilter = document.getElementById('filter-audit-role-select').value;
    const statusFilter = document.getElementById('filter-audit-status-select').value;
    const tbody = document.getElementById('audit-table-body');
    const badge = document.getElementById('audit-count-badge');

    const filtered = this.allLogs.filter(l => {
      const matchQ = !q || l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
      const matchRole = !roleFilter || l.role === roleFilter;
      const matchStatus = !statusFilter || l.status === statusFilter;
      return matchQ && matchRole && matchStatus;
    });

    badge.textContent = `${filtered.length} Events`;

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding: 28px;">No audit events found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(l => `
      <tr>
        <td style="white-space: nowrap; font-size: 0.8rem;">${l.timestamp}</td>
        <td><strong>${l.actor}</strong></td>
        <td><span class="badge badge-info">${l.role}</span></td>
        <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.78rem;">${l.action}</code></td>
        <td><strong>${l.resource}</strong></td>
        <td style="font-size: 0.85rem;">${l.details}</td>
        <td>
          <span class="badge ${l.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}">
            ${l.status}
          </span>
        </td>
      </tr>
    `).join('');
  },

  exportCSV() {
    const headers = {
      timestamp: 'Timestamp (IST)',
      actor: 'Actor / User',
      role: 'Role',
      action: 'Action Type',
      resource: 'Target Resource',
      details: 'Details',
      status: 'Status'
    };
    Utils.downloadCSV('GVPS_Security_Audit_Trail_Jalandhar', this.allLogs, headers);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AuditLogsModule.init();
});
