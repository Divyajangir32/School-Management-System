/**
 * Green Valley Public School, Jalandhar
 * User Management & RBAC Controller
 */

const UsersModule = {
  usersList: [],

  async init() {
    App.init('User Accounts & RBAC');
    this.bindEvents();
    await this.loadUsers();
  },

  bindEvents() {
    document.getElementById('user-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-user-role-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('open-add-user-btn').addEventListener('click', () => {
      Utils.openModal('create-user-modal');
    });

    document.getElementById('create-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreateUser();
    });

    document.getElementById('change-role-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleChangeRoleSubmit();
    });
  },

  async loadUsers() {
    this.usersList = Auth.getUsersList();
    this.renderTable();
  },

  renderTable() {
    const q = document.getElementById('user-search-input').value.trim().toLowerCase();
    const roleFilter = document.getElementById('filter-user-role-select').value;
    const tbody = document.getElementById('users-table-body');
    const currentUser = Auth.getCurrentUser();

    const filtered = this.usersList.filter(u => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.designation && u.designation.toLowerCase().includes(q));
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchQ && matchRole;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding: 28px;">No user accounts found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(u => {
      const isSuper = u.role === 'Super Admin';
      const isSelf = currentUser && currentUser.id === u.id;
      // Admin cannot modify Super Admin
      const canModify = currentUser.role === 'Super Admin' || (!isSuper && currentUser.role === 'Admin');

      return `
        <tr>
          <td>
            <div style="font-weight: 700;">${u.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${u.email}</div>
          </td>
          <td>
            <span class="badge ${u.role === 'Super Admin' ? 'badge-danger' : (u.role === 'Admin' ? 'badge-warning' : (u.role === 'Principal' ? 'badge-primary' : 'badge-info'))}">
              ${u.role}
            </span>
          </td>
          <td style="font-size: 0.85rem;">${u.designation || '-'}</td>
          <td>${u.phone || '-'}</td>
          <td style="font-size: 0.78rem; color: var(--text-muted);">${u.lastLogin || 'Never'}</td>
          <td>
            <span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}">
              ${u.status || 'Active'}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              ${canModify ? `
                <button class="btn btn-outline btn-sm" onclick="UsersModule.openChangeRoleModal('${u.id}')" title="Change Role">
                  Change Role
                </button>
                ${!isSelf ? `
                  <button class="btn ${u.status === 'Active' ? 'btn-danger' : 'btn-success'} btn-sm" onclick="UsersModule.toggleUserStatus('${u.id}')">
                    ${u.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
                ` : ''}
              ` : `
                <span class="text-muted" style="font-size: 0.75rem;">Protected</span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openChangeRoleModal(userId) {
    const user = this.usersList.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('cr-user-id').value = user.id;
    document.getElementById('cr-user-name').value = `${user.name} (${user.email})`;
    document.getElementById('cr-role-select').value = user.role;

    Utils.openModal('change-role-modal');
  },

  async handleChangeRoleSubmit() {
    const userId = document.getElementById('cr-user-id').value;
    const newRole = document.getElementById('cr-role-select').value;
    const currentUser = Auth.getCurrentUser();

    const user = this.usersList.find(u => u.id === userId);
    if (!user) return;

    if (user.role === newRole) {
      Utils.closeModal('change-role-modal');
      return;
    }

    if (confirm(`Are you sure you want to change ${user.name}'s role from '${user.role}' to '${newRole}'? This changes their system permissions immediately.`)) {
      const oldRole = user.role;
      user.role = newRole;
      Auth.saveUsersList(this.usersList);

      // Log to audit log
      await Api.logAudit(currentUser, 'ROLE_CHANGE', 'User Account', `Changed role for ${user.name} from '${oldRole}' to '${newRole}'`);

      Utils.showToast(`Updated role for ${user.name} to ${newRole}`, 'success');
      Utils.closeModal('change-role-modal');
      await this.loadUsers();
    }
  },

  async toggleUserStatus(userId) {
    const user = this.usersList.find(u => u.id === userId);
    if (!user) return;
    const currentUser = Auth.getCurrentUser();

    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    if (confirm(`Are you sure you want to set ${user.name}'s account status to '${newStatus}'?`)) {
      user.status = newStatus;
      Auth.saveUsersList(this.usersList);

      await Api.logAudit(currentUser, 'STATUS_CHANGE', 'User Account', `Changed account status for ${user.name} to '${newStatus}'`);

      Utils.showToast(`Account for ${user.name} is now ${newStatus}`, 'info');
      await this.loadUsers();
    }
  },

  async handleCreateUser() {
    const currentUser = Auth.getCurrentUser();
    const newUser = {
      id: Utils.generateId('USR'),
      name: document.getElementById('cu-name').value.trim(),
      email: document.getElementById('cu-email').value.trim().toLowerCase(),
      role: document.getElementById('cu-role').value,
      phone: document.getElementById('cu-phone').value.trim(),
      designation: document.getElementById('cu-designation').value.trim(),
      status: 'Active',
      lastLogin: 'Never'
    };

    if (this.usersList.some(u => u.email === newUser.email)) {
      Utils.showToast('A user with this email already exists.', 'error');
      return;
    }

    this.usersList.push(newUser);
    Auth.saveUsersList(this.usersList);

    await Api.logAudit(currentUser, 'USER_CREATE', 'User Account', `Created user ${newUser.name} with role '${newUser.role}'`);

    Utils.showToast(`Created user account for ${newUser.name}`, 'success');
    Utils.closeModal('create-user-modal');
    document.getElementById('create-user-form').reset();
    await this.loadUsers();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UsersModule.init();
});
