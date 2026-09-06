/**
 * Green Valley Public School, Jalandhar
 * Library Management Controller
 */

const LibraryModule = {
  books: [],
  issues: [],
  allStudents: [],

  async init() {
    App.init('Library Management');
    await this.loadData();
    this.bindEvents();
    this.checkPermissions();
  },

  checkPermissions() {
    const user = Auth.getCurrentUser();
    // Only Librarian, Super Admin and Admin can issue or add books
    if (user && !['Librarian', 'Super Admin', 'Admin'].includes(user.role)) {
      const actions = document.getElementById('lib-actions-container');
      if (actions) actions.style.display = 'none';
    }
  },

  async loadData() {
    this.books = await Api.get('library_books');
    this.issues = await Api.get('library_issues');
    this.allStudents = await Api.get('students');

    this.renderBooks();
    this.renderIssues();
    this.populateDropdowns();
  },

  populateDropdowns() {
    const bSelect = document.getElementById('iss-book-select');
    bSelect.innerHTML = '';
    this.books.filter(b => b.availableCopies > 0).forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = `${b.title} (Available: ${b.availableCopies})`;
      bSelect.appendChild(opt);
    });

    const sSelect = document.getElementById('iss-student-select');
    sSelect.innerHTML = '';
    this.allStudents.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.class}-${s.section})`;
      sSelect.appendChild(opt);
    });
  },

  bindEvents() {
    document.getElementById('open-add-book-btn').addEventListener('click', () => {
      Utils.openModal('book-modal');
    });

    document.getElementById('open-issue-book-btn').addEventListener('click', () => {
      document.getElementById('iss-date').value = new Date().toISOString().split('T')[0];
      const d = new Date();
      d.setDate(d.getDate() + 14);
      document.getElementById('iss-due').value = d.toISOString().split('T')[0];
      Utils.openModal('issue-modal');
    });

    document.getElementById('book-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddBook();
    });

    document.getElementById('issue-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleIssueBook();
    });

    document.getElementById('book-search-input').addEventListener('input', () => {
      this.renderBooks();
    });
  },

  switchTab(tab) {
    document.getElementById('tab-books-btn').classList.toggle('active', tab === 'books');
    document.getElementById('tab-issues-btn').classList.toggle('active', tab === 'issues');
    document.getElementById('books-section').style.display = tab === 'books' ? 'block' : 'none';
    document.getElementById('issues-section').style.display = tab === 'issues' ? 'block' : 'none';
  },

  renderBooks() {
    const q = document.getElementById('book-search-input').value.trim().toLowerCase();
    const tbody = document.getElementById('books-table-body');
    const user = Auth.getCurrentUser();

    const filtered = this.books.filter(b => {
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || (b.isbn && b.isbn.includes(q));
    });

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding: 24px;">No books matching catalog search.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td><code>${b.isbn || 'N/A'}</code></td>
        <td><strong>${b.title}</strong></td>
        <td>${b.author}</td>
        <td><span class="badge badge-info">${b.category}</span></td>
        <td>${b.location || 'Main Section'}</td>
        <td>${b.totalCopies}</td>
        <td><strong class="${b.availableCopies > 0 ? 'text-success' : 'text-danger'}">${b.availableCopies} available</strong></td>
        <td style="text-align: right;">
          ${['Librarian', 'Super Admin', 'Admin'].includes(user.role) ? `
            <button class="btn btn-outline btn-sm" onclick="LibraryModule.deleteBook('${b.id}')">Remove</button>
          ` : `
            <button class="btn btn-secondary btn-sm" onclick="alert('Borrow request submitted for ${b.title}')">Borrow</button>
          `}
        </td>
      </tr>
    `).join('');
  },

  renderIssues() {
    const tbody = document.getElementById('issues-table-body');
    const user = Auth.getCurrentUser();

    let list = this.issues;
    if (user.role === 'Student') {
      list = list.filter(i => i.studentId === user.studentId);
    } else if (user.role === 'Parent') {
      const allowed = user.childIds || [user.studentId];
      list = list.filter(i => allowed.includes(i.studentId));
    }

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No active borrowings recorded.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(i => `
      <tr>
        <td><strong>${i.id}</strong></td>
        <td>${i.bookTitle}</td>
        <td><strong>${i.studentName}</strong></td>
        <td><span class="badge badge-primary">${i.class}</span></td>
        <td>${Utils.formatDate(i.issueDate, 'readable')}</td>
        <td>${Utils.formatDate(i.dueDate, 'readable')}</td>
        <td class="${i.fine > 0 ? 'text-danger font-bold' : ''}">₹${i.fine || 0}</td>
        <td>
          <span class="badge ${i.status === 'Issued' ? 'badge-primary' : (i.status === 'Overdue' ? 'badge-danger' : 'badge-success')}">
            ${i.status}
          </span>
        </td>
        <td style="text-align: right;">
          ${['Librarian', 'Super Admin', 'Admin'].includes(user.role) && i.status !== 'Returned' ? `
            <button class="btn btn-success btn-sm" onclick="LibraryModule.returnBook('${i.id}')">Return Book</button>
          ` : '-'}
        </td>
      </tr>
    `).join('');
  },

  async handleAddBook() {
    const newBook = {
      id: Utils.generateId('BK'),
      title: document.getElementById('bk-title').value.trim(),
      author: document.getElementById('bk-author').value.trim(),
      category: document.getElementById('bk-category').value.trim(),
      isbn: document.getElementById('bk-isbn').value.trim(),
      totalCopies: Number(document.getElementById('bk-copies').value) || 5,
      availableCopies: Number(document.getElementById('bk-copies').value) || 5,
      location: document.getElementById('bk-location').value.trim() || 'General Shelf'
    };

    this.books.unshift(newBook);
    await Api.set('library_books', this.books);
    await Api.logAudit(Auth.getCurrentUser(), 'ADD_BOOK', 'Library', `Added book "${newBook.title}"`);

    Utils.showToast(`Added book ${newBook.title}`, 'success');
    Utils.closeModal('book-modal');
    document.getElementById('book-form').reset();
    await this.loadData();
  },

  async handleIssueBook() {
    const bookId = document.getElementById('iss-book-select').value;
    const studentId = document.getElementById('iss-student-select').value;
    const issueDate = document.getElementById('iss-date').value;
    const dueDate = document.getElementById('iss-due').value;

    const book = this.books.find(b => b.id === bookId);
    const student = this.allStudents.find(s => s.id === studentId);

    if (!book || book.availableCopies <= 0) {
      Utils.showToast('Book is currently out of stock.', 'error');
      return;
    }

    const newIssue = {
      id: Utils.generateId('ISS'),
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      class: `${student.class}-${student.section}`,
      issueDate: issueDate,
      dueDate: dueDate,
      returnDate: '',
      status: 'Issued',
      fine: 0
    };

    // Deduct available copy
    book.availableCopies = Math.max(0, book.availableCopies - 1);
    await Api.set('library_books', this.books);

    this.issues.unshift(newIssue);
    await Api.set('library_issues', this.issues);

    await Api.logAudit(Auth.getCurrentUser(), 'ISSUE_BOOK', 'Library', `Issued "${book.title}" to ${student.name}`);

    Utils.showToast(`Issued book to ${student.name}`, 'success');
    Utils.closeModal('issue-modal');
    await this.loadData();
  },

  async returnBook(issueId) {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return;

    const book = this.books.find(b => b.id === issue.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      await Api.set('library_books', this.books);
    }

    issue.status = 'Returned';
    issue.returnDate = new Date().toISOString().split('T')[0];
    await Api.set('library_issues', this.issues);

    await Api.logAudit(Auth.getCurrentUser(), 'RETURN_BOOK', 'Library', `Returned book "${issue.bookTitle}" by ${issue.studentName}`);

    Utils.showToast(`Book returned successfully`, 'success');
    await this.loadData();
  },

  async deleteBook(bookId) {
    if (confirm('Are you sure you want to remove this book from catalog?')) {
      this.books = this.books.filter(b => b.id !== bookId);
      await Api.set('library_books', this.books);
      Utils.showToast('Book removed', 'info');
      await this.loadData();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LibraryModule.init();
});
