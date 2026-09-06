/**
 * Green Valley Public School, Jalandhar
 * Core Utilities, Helpers, UI Modals, Toast Engine & Calculations
 */

const Utils = {
  // Format Currency to Indian Rupee (₹)
  formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format Date to Indian standard (DD-MM-YYYY or readable)
  formatDate(dateInput, format = 'short') {
    if (!dateInput) return '-';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;

    if (format === 'short') {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } else if (format === 'readable') {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } else if (format === 'input') {
      return d.toISOString().split('T')[0];
    }
    return d.toLocaleDateString('en-IN');
  },

  // Calculate CBSE Grade & Remark from Percentage
  calculateGrade(percentage) {
    const scale = APP_CONFIG.GRADING_SCALE;
    const num = Math.round(Number(percentage));
    for (const tier of scale) {
      if (num >= tier.min && num <= tier.max) {
        return {
          grade: tier.grade,
          points: tier.points,
          remark: tier.remark,
          isPass: tier.grade !== 'E'
        };
      }
    }
    return { grade: 'E', points: 0, remark: 'Fail', isPass: false };
  },

  // Compute Percentage safely
  calculatePercentage(obtained, max) {
    const obt = Number(obtained) || 0;
    const mx = Number(max) || 0;
    if (mx <= 0) return 0;
    return Number(((obt / mx) * 100).toFixed(1));
  },

  // Indian Phone validation
  isValidIndianPhone(phone) {
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(String(phone).trim());
  },

  // PIN Code validation
  isValidPinCode(pin) {
    return /^[1-9][0-9]{5}$/.test(String(pin).trim());
  },

  // Toast Notification System
  showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Modal Dialog Controllers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Export Data to CSV file
  downloadCSV(filename, rows, headers) {
    if (!rows || !rows.length) {
      this.showToast('No records available to export', 'warning');
      return;
    }

    const headerKeys = Object.keys(headers);
    const headerLabels = Object.values(headers);

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    csvContent += headerLabels.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\r\n';

    rows.forEach(row => {
      const rowLine = headerKeys.map(key => {
        let val = row[key];
        if (val === null || val === undefined) val = '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += rowLine + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast(`Exported ${rows.length} rows to ${filename}`, 'success');
  },

  // Print current active report / element
  printElement(elementId) {
    window.print();
  },

  // Generate Unique ID
  generateId(prefix = 'GVPS') {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${Date.now().toString().slice(-4)}${randomNum}`;
  }
};

window.Utils = Utils;
