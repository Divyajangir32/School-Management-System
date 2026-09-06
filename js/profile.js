/**
 * Green Valley Public School, Jalandhar
 * User Profile Controller
 */

const ProfileModule = {
  currentUser: null,

  init() {
    App.init('My Profile');
    this.currentUser = Auth.getCurrentUser();
    if (!this.currentUser) return;

    this.renderProfile();
    this.bindEvents();
  },

  renderProfile() {
    const u = this.currentUser;

    document.getElementById('prof-avatar').textContent = u.name.charAt(0);
    document.getElementById('prof-name').textContent = u.name;
    document.getElementById('prof-designation').textContent = u.designation || u.role;
    document.getElementById('prof-role-badge').textContent = u.role;
    document.getElementById('prof-role-badge').className = `badge ${u.role === 'Super Admin' ? 'badge-danger' : (u.role === 'Admin' ? 'badge-warning' : (u.role === 'Principal' ? 'badge-primary' : 'badge-info'))}`;
    document.getElementById('prof-email').textContent = u.email;
    document.getElementById('prof-phone').textContent = u.phone || '+91 98765...';
    document.getElementById('edit-phone').value = u.phone || '';
    document.getElementById('view-role').value = u.role;

    // Role specific extras
    const extraEl = document.getElementById('prof-extra-details');
    if (u.role === 'Teacher') {
      extraEl.innerHTML = `
        <div><strong>Assigned Class:</strong> ${u.assignedClass || 'Class 10'}</div>
        <div><strong>Assigned Subject:</strong> ${u.assignedSubject || 'Mathematics'}</div>
      `;
    } else if (u.role === 'Student') {
      extraEl.innerHTML = `
        <div><strong>Admission No:</strong> ${u.studentId || 'GVPS/2025/101'}</div>
        <div><strong>Class &amp; Section:</strong> ${u.class || 'Class 10'} (${u.section || 'A'})</div>
        <div><strong>Roll Number:</strong> #${u.rollNo || 1}</div>
      `;
    } else if (u.role === 'Parent') {
      extraEl.innerHTML = `
        <div><strong>Linked Children:</strong> ${u.childIds ? u.childIds.length : 1} student(s) enrolled</div>
        <div><strong>Current Ward:</strong> ${u.activeChildId || 'STU-2025-001'}</div>
      `;
    }

    // Render granted permissions
    const permsContainer = document.getElementById('permissions-tags-container');
    const badgeCount = document.getElementById('perm-count-badge');
    const rolePermissions = Permissions.ROLE_PERMISSIONS[u.role] || [];

    if (rolePermissions.includes('*')) {
      badgeCount.textContent = 'All Permissions Granted';
      permsContainer.innerHTML = '<span class="badge badge-danger" style="font-size: 0.85rem; padding: 6px 14px;">Full System Authority (*)</span>';
    } else {
      badgeCount.textContent = `${rolePermissions.length} Active Permissions`;
      permsContainer.innerHTML = rolePermissions.map(p => `
        <span class="badge badge-primary" style="font-size: 0.78rem; text-transform: none; letter-spacing: normal; padding: 5px 10px;">
          ✓ ${p}
        </span>
      `).join('');
    }
  },

  bindEvents() {
    document.getElementById('profile-contact-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPhone = document.getElementById('edit-phone').value.trim();
      this.currentUser.phone = newPhone;

      // Update in stored users
      const allUsers = Auth.getUsersList();
      const match = allUsers.find(u => u.id === this.currentUser.id);
      if (match) {
        match.phone = newPhone;
        Auth.saveUsersList(allUsers);
      }

      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(this.currentUser));
      Utils.showToast('Profile contact information updated', 'success');
      this.renderProfile();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProfileModule.init();
});
