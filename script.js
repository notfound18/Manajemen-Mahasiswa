/**
 * NEXUS EDU PREMIUM LOGIC
 * OOP, File I/O (Simulated), Manual Bubble Sort, Manual Linear Search
 */

// 1. DATA MODEL (OOP)
class Student {
  constructor(nim, nama, email) {
    this.nim = nim;
    this.nama = nama;
    this.email = email;
  }
}

// 2. CONTROLLER (The Logic Engine)
class NexusSystem {
  constructor() {
    this.DB_NAME = 'NEXUS_PREMIUM_DB';
    this.data = this.loadData();
  }

  loadData() {
    const raw = localStorage.getItem(this.DB_NAME);
    return raw ? JSON.parse(raw) : [];
  }

  saveData() {
    localStorage.setItem(this.DB_NAME, JSON.stringify(this.data));
  }

  // REGEX VALIDATION
  validate(nim, email) {
    const nimRegex = /^[0-9]{8,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nimRegex.test(nim)) throw 'NIM harus berupa 8-15 digit angka!';
    if (!emailRegex.test(email)) throw 'Alamat email tidak valid!';
    return true;
  }

  // ALGORITMA: BUBBLE SORT (O(n^2)) - Urutkan Nama
  bubbleSort() {
    let n = this.data.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (this.data[j].nama.toLowerCase() > this.data[j + 1].nama.toLowerCase()) {
          let temp = this.data[j];
          this.data[j] = this.data[j + 1];
          this.data[j + 1] = temp;
        }
      }
    }
    this.saveData();
  }

  // ALGORITMA: SELECTION SORT (O(n^2)) - Urutkan NIM
  selectionSort() {
    let n = this.data.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        if (this.data[j].nim < this.data[min].nim) min = j;
      }
      [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
    }
    this.saveData();
  }

  // ALGORITMA: LINEAR SEARCH (O(n))
  search(query) {
    const q = query.toLowerCase();
    const results = [];
    for (let i = 0; i < this.data.length; i++) {
      const m = this.data[i];
      // Mengecek apakah query ada di Nama atau NIM
      if (m.nama.toLowerCase().includes(q) || m.nim.includes(q)) {
        results.push(m);
      }
    }
    return results;
  }
}

// 3. UI SYNCING
const nexus = new NexusSystem();
const form = document.getElementById('studentForm');

function render(customData = null) {
  const list = customData || nexus.data;
  const tableBody = document.getElementById('studentList');
  document.getElementById('count').innerText = list.length;
  tableBody.innerHTML = '';

  list.forEach((s, idx) => {
    tableBody.innerHTML += `
            <tr class="group hover:bg-indigo-50/50 transition-all duration-300">
                <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                            ${s.nama.charAt(0)}
                        </div>
                        <div>
                            <p class="text-sm font-extrabold text-slate-800">${s.nama}</p>
                            <p class="text-[11px] font-mono text-indigo-400 font-bold tracking-tighter">${s.nim}</p>
                        </div>
                    </div>
                </td>
                <td class="px-8 py-5 text-sm text-slate-500 font-medium">${s.email}</td>
                <td class="px-8 py-5 text-right">
                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editMode(${idx})" class="p-2.5 text-indigo-600 bg-white border border-slate-100 rounded-xl hover:shadow-md transition shadow-sm"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="deleteEntry(${idx})" class="p-2.5 text-red-500 bg-white border border-slate-100 rounded-xl hover:shadow-md transition shadow-sm"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </td>
            </tr>
        `;
  });
  lucide.createIcons();
}

// FORM HANDLER
form.onsubmit = (e) => {
  e.preventDefault();
  try {
    const nim = document.getElementById('nim').value;
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const editIdx = parseInt(document.getElementById('editIndex').value);

    nexus.validate(nim, email);
    const newStudent = new Student(nim, nama, email);

    if (editIdx === -1) {
      nexus.data.push(newStudent);
    } else {
      nexus.data[editIdx] = newStudent;
      exitEditMode();
    }

    nexus.saveData();
    form.reset();
    render();
  } catch (err) {
    alert('⚠️ Validasi Gagal: ' + err);
  }
};

// SEARCH HANDLER (Linear Search)
document.getElementById('searchInput').oninput = (e) => {
  const results = nexus.search(e.target.value);
  render(results);
};

// SORT HANDLER
window.runSort = (type) => {
  if (type === 'nama') nexus.bubbleSort();
  else nexus.selectionSort();
  render();
};

// DELETE & EDIT
window.deleteEntry = (idx) => {
  if (confirm('Hapus data ini dari sistem?')) {
    nexus.data.splice(idx, 1);
    nexus.saveData();
    render();
  }
};

window.editMode = (idx) => {
  const s = nexus.data[idx];
  document.getElementById('nim').value = s.nim;
  document.getElementById('nama').value = s.nama;
  document.getElementById('email').value = s.email;
  document.getElementById('editIndex').value = idx;

  document.getElementById('formTitle').innerText = 'Update Mahasiswa';
  document.getElementById('cancelBtn').classList.remove('hidden');
  document.getElementById('submitBtn').innerHTML = `<i data-lucide="refresh-cw" class="w-5 h-5"></i> Perbarui Data`;
  lucide.createIcons();
};

function exitEditMode() {
  document.getElementById('editIndex').value = '-1';
  document.getElementById('formTitle').innerText = 'Tambah Mahasiswa';
  document.getElementById('cancelBtn').classList.add('hidden');
  document.getElementById('submitBtn').innerHTML = `<i data-lucide="send" class="w-5 h-5"></i> Simpan Data`;
  lucide.createIcons();
}

document.getElementById('cancelBtn').onclick = () => {
  form.reset();
  exitEditMode();
};

// INITIAL START
render();
