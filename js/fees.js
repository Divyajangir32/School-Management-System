/**
 * Green Valley Public School, Jalandhar
 * Fee Management & Instant Receipts Controller
 */

const FeesModule = {
  feesList: [],
  allStudents: [],

  async init() {
    App.init('Student Fee Management');
    await this.populateDropdowns();
    this.bindEvents();
    await this.loadFees();

    const user = Auth.getCurrentUser();
    if (user && user.role === 'Student') {
      const btn = document.getElementById('open-add-fee-btn');
      if (btn) btn.style.display = 'none';
    }
  },

  async populateDropdowns() {
    this.allStudents = await Api.get('students');
    const stuSelect = document.getElementById('f-student-select');
    stuSelect.innerHTML = '';
    this.allStudents.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.class}-${s.section}, Adm: ${s.admissionNo})`;
      stuSelect.appendChild(opt);
    });

    const filterType = document.getElementById('filter-fee-type-select');
    const formType = document.getElementById('f-fee-type');
    APP_CONFIG.FEE_TYPES.forEach(t => {
      const opt1 = document.createElement('option');
      opt1.value = t;
      opt1.textContent = t;
      filterType.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = t;
      opt2.textContent = t;
      formType.appendChild(opt2);
    });
  },

  bindEvents() {
    const canCollect = Permissions.hasPermission(Permissions.PERMS.FEES_COLLECT);
    const addBtn = document.getElementById('open-add-fee-btn');
    if (addBtn && !canCollect) {
      addBtn.style.display = 'none';
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.openAddModal();
      });
    }

    document.getElementById('fee-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    document.getElementById('fee-search-input').addEventListener('input', () => {
      this.renderTable();
    });

    document.getElementById('filter-fee-type-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('filter-fee-status-select').addEventListener('change', () => {
      this.renderTable();
    });

    document.getElementById('export-fees-csv-btn').addEventListener('click', () => {
      this.exportCSV();
    });
  },

  async loadFees() {
    this.feesList = await Api.get('fees');
    this.renderSummary();
    this.renderTable();
  },

  renderSummary() {
    const container = document.getElementById('fee-summary-cards');
    let totalDemand = 0;
    let totalCollected = 0;
    let totalPending = 0;

    this.feesList.forEach(f => {
      totalDemand += Number(f.amount) || 0;
      totalCollected += Number(f.paidAmount) || 0;
      totalPending += Number(f.pendingAmount) || 0;
    });

    container.innerHTML = `
      <div class="metric-card blue">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="metric-data">
          <h3>${Utils.formatCurrency(totalDemand)}</h3>
          <p>Total Fee Demanded</p>
          <div class="metric-sub text-muted">Across all quarters</div>
        </div>
      </div>

      <div class="metric-card emerald">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="metric-data">
          <h3>${Utils.formatCurrency(totalCollected)}</h3>
          <p>Fees Collected (INR)</p>
          <div class="metric-sub text-success">Deposited in Bank</div>
        </div>
      </div>

      <div class="metric-card rose">
        <div class="metric-icon-box">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div class="metric-data">
          <h3>${Utils.formatCurrency(totalPending)}</h3>
          <p>Pending Dues (INR)</p>
          <div class="metric-sub text-danger">To be recovered</div>
        </div>
      </div>
    `;
  },

  renderTable() {
    const q = document.getElementById('fee-search-input').value.trim().toLowerCase();
    const type = document.getElementById('filter-fee-type-select').value;
    const stat = document.getElementById('filter-fee-status-select').value;
    const tbody = document.getElementById('fees-table-body');
    const user = Auth.getCurrentUser();

    // If logged in as student or parent, show only relevant student's records
    let list = this.feesList;
    if (user && user.studentId) {
      list = list.filter(f => f.studentId === user.studentId);
    }

    const filtered = list.filter(f => {
      const matchQ = !q || (f.studentName && f.studentName.toLowerCase().includes(q)) || (f.receiptNo && f.receiptNo.toLowerCase().includes(q));
      const matchType = !type || f.feeType.includes(type);
      const matchStat = !stat || f.status === stat;
      return matchQ && matchType && matchStat;
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No fee records found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(f => `
      <tr>
        <td><strong>${f.receiptNo}</strong></td>
        <td><strong>${f.studentName}</strong></td>
        <td><span class="badge badge-primary">${f.class}</span></td>
        <td>${f.feeType}</td>
        <td><strong>${Utils.formatCurrency(f.amount)}</strong></td>
        <td class="text-success font-bold">${Utils.formatCurrency(f.paidAmount)}</td>
        <td class="${f.pendingAmount > 0 ? 'text-danger font-bold' : 'text-muted'}">${Utils.formatCurrency(f.pendingAmount)}</td>
        <td>${f.paymentDate ? Utils.formatDate(f.paymentDate, 'readable') : '<span class="text-muted">-</span>'}</td>
        <td>
          <span class="badge ${f.status === 'Paid' ? 'badge-success' : (f.status === 'Partial' ? 'badge-warning' : 'badge-danger')}">
            ${f.status}
          </span>
        </td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="FeesModule.viewReceipt('${f.id}')" title="Print / View Receipt">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Receipt
            </button>
            ${Permissions.hasPermission(Permissions.PERMS.FEES_MANAGE) ? `
              <button class="btn btn-outline btn-sm" onclick="FeesModule.openEditModal('${f.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="FeesModule.deleteFee('${f.id}')">Delete</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddModal() {
    document.getElementById('fee-form-title').textContent = 'Create Fee Demand';
    document.getElementById('fee-form').reset();
    document.getElementById('fee-form-id').value = '';
    document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('f-amount').value = '4500';
    document.getElementById('f-paid').value = '4500';

    Utils.openModal('fee-form-modal');
  },

  openEditModal(id) {
    const f = this.feesList.find(x => x.id === id);
    if (!f) return;

    document.getElementById('fee-form-title').textContent = `Update Fee: ${f.receiptNo}`;
    document.getElementById('fee-form-id').value = f.id;
    document.getElementById('f-student-select').value = f.studentId;
    document.getElementById('f-fee-type').value = f.feeType.split(' ')[0] || 'Tuition Fee';
    document.getElementById('f-amount').value = f.amount;
    document.getElementById('f-paid').value = f.paidAmount;
    document.getElementById('f-date').value = f.paymentDate || new Date().toISOString().split('T')[0];
    document.getElementById('f-method').value = f.paymentMethod || 'UPI / Online Transfer';

    Utils.openModal('fee-form-modal');
  },

  async handleFormSubmit() {
    const id = document.getElementById('fee-form-id').value;
    const isEdit = Boolean(id);

    const studentId = document.getElementById('f-student-select').value;
    const student = this.allStudents.find(s => s.id === studentId);

    const amount = Number(document.getElementById('f-amount').value) || 0;
    const paid = Number(document.getElementById('f-paid').value) || 0;
    const pending = Math.max(amount - paid, 0);

    let status = 'Pending';
    if (paid >= amount) status = 'Paid';
    else if (paid > 0) status = 'Partial';

    const payload = {
      studentId: studentId,
      studentName: student ? student.name : 'Student',
      class: student ? student.class : 'Class 10',
      feeType: document.getElementById('f-fee-type').value,
      amount: amount,
      paidAmount: paid,
      pendingAmount: pending,
      paymentDate: document.getElementById('f-date').value,
      paymentMethod: document.getElementById('f-method').value,
      status: status
    };

    try {
      if (isEdit) {
        await Api.update('fees', id, payload);
        Utils.showToast(`Updated fee record ${id}`, 'success');
      } else {
        payload.id = Utils.generateId('FEE');
        const count = this.feesList.length + 1001;
        payload.receiptNo = `GVPS-RCP-2025-${count}`;
        await Api.add('fees', payload);
        Utils.showToast(`Generated receipt ${payload.receiptNo}`, 'success');
      }
      Utils.closeModal('fee-form-modal');
      await this.loadFees();
    } catch (err) {
      Utils.showToast('Save failed: ' + err.message, 'error');
    }
  },

  viewReceipt(id) {
    const f = this.feesList.find(x => x.id === id);
    if (!f) return;

    const student = this.allStudents.find(s => s.id === f.studentId);

    document.getElementById('rcp-no').textContent = f.receiptNo;
    document.getElementById('rcp-date').textContent = `Date: ${f.paymentDate ? Utils.formatDate(f.paymentDate, 'readable') : Utils.formatDate(new Date(), 'readable')}`;
    document.getElementById('rcp-student-name').textContent = f.studentName;
    document.getElementById('rcp-adm-no').textContent = student ? student.admissionNo : 'GVPS-2025';
    document.getElementById('rcp-class').textContent = f.class;
    document.getElementById('rcp-payment-mode').textContent = f.paymentMethod || 'UPI / Cash';

    document.getElementById('rcp-fee-type').textContent = f.feeType;
    document.getElementById('rcp-amount').textContent = Utils.formatCurrency(f.amount);
    document.getElementById('rcp-paid').textContent = Utils.formatCurrency(f.paidAmount);
    document.getElementById('rcp-pending').textContent = Utils.formatCurrency(f.pendingAmount);

    Utils.openModal('fee-receipt-modal');
  },

  async deleteFee(id) {
    if (confirm('Delete this fee record?')) {
      await Api.delete('fees', id);
      Utils.showToast('Fee record removed', 'info');
      await this.loadFees();
    }
  },

  exportCSV() {
    const headers = {
      receiptNo: 'Receipt No',
      studentName: 'Student Name',
      class: 'Class',
      feeType: 'Fee Particulars',
      amount: 'Total Demand (INR)',
      paidAmount: 'Paid Amount (INR)',
      pendingAmount: 'Pending Balance (INR)',
      paymentDate: 'Payment Date',
      paymentMethod: 'Payment Mode',
      status: 'Status'
    };
    Utils.downloadCSV('GVPS_Fee_Ledger_Jalandhar', this.feesList, headers);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  FeesModule.init();
});
