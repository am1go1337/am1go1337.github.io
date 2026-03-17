/* =============================================
   T.V.A. Website – script.js
   Navigation switching + Budget Planner logic
   ============================================= */

// ─────────────────────────────────────────────
// 1. NAVIGATION
// ─────────────────────────────────────────────
const SECTION_MAP = {
  home:        'section-home',
  introducere: 'section-introducere',
  notiuni:     'section-notiuni',
  exemple:     'section-exemple',
  budget:      'section-budget'
};

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function showSection(pageId) {
  sections.forEach(sec => sec.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));

  const targetSection = document.getElementById(SECTION_MAP[pageId]);
  if (targetSection) targetSection.classList.add('active');

  navLinks.forEach(link => {
    if (link.dataset.section === pageId) link.classList.add('active');
  });

  // If switching to budget, ensure Chart.js resizes correctly
  if (pageId === 'budget' && myPieChart) {
    setTimeout(() => myPieChart.resize(), 50);
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

// ─────────────────────────────────────────────
// 2. ADD ROW
// ─────────────────────────────────────────────
function addRow(tableId) {
  const tableBody = document.getElementById(tableId).querySelector('.data-body');
  const newRow = tableBody.insertRow();
  newRow.innerHTML = `
    <td contenteditable="true">New Item</td>
    <td class="val-cell" contenteditable="true">0</td>
  `;
  newRow.cells[0].focus();
}

// ─────────────────────────────────────────────
// 3. CALCULATION ENGINE
// ─────────────────────────────────────────────
function runCalculations() {
  let income = 0, expenses = 0;
  let chartLabels = [], chartData = [];

  document.querySelectorAll('#incomeTable .val-cell').forEach(cell => {
    income += parseFloat(cell.innerText) || 0;
  });

  document.querySelectorAll('#expenseTable tr').forEach(row => {
    if (!row.cells[0] || !row.cells[1]) return;
    const name = row.cells[0].innerText.trim();
    const val  = parseFloat(row.cells[1].innerText) || 0;
    expenses += val;
    if (val > 0) { chartLabels.push(name); chartData.push(val); }
  });

  document.getElementById('statIncome').innerText    = income.toFixed(2) + ' MDL';
  document.getElementById('statSpent').innerText     = expenses.toFixed(2) + ' MDL';
  document.getElementById('statRemaining').innerText = (income - expenses).toFixed(2) + ' MDL';

  if (myPieChart) {
    myPieChart.data.labels            = chartLabels;
    myPieChart.data.datasets[0].data  = chartData;
    myPieChart.update();
  }
}

// ─────────────────────────────────────────────
// 4. CHART.JS INIT
// ─────────────────────────────────────────────
let myPieChart = null;

function initChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#3be48e','#14b8a6','#0ea5e9','#6366f1','#f43f5e','#eab308'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#ffffff', padding: 20 } }
      }
    }
  });
}

// ─────────────────────────────────────────────
// 5. EVENTS & INIT
// ─────────────────────────────────────────────
document.addEventListener('input', e => {
  if (e.target.tagName === 'TD') runCalculations();
});

window.onload = () => {
  showSection('home');
  initChart();
  runCalculations();
};

// ─────────────────────────────────────────────
// 6. SAVINGS CALCULATOR
// ─────────────────────────────────────────────

/**
 * Read the three calculator inputs, compute monthly savings
 * and months needed to reach the target, then show the results panel.
 */
function calculeaza() {
  const v = parseFloat(document.getElementById('venit').value);
  const s = parseFloat(document.getElementById('suma').value);
  const p = parseFloat(document.getElementById('procent').value);

  if (v > 0 && s > 0 && p > 0) {
    const lunar = (v * p) / 100;
    const luni  = Math.ceil(s / lunar);
    document.getElementById('val-lunar').innerText = lunar.toFixed(2) + ' Lei';
    document.getElementById('val-timp').innerText  = luni;
    document.getElementById('rezultate').style.display = 'block';
  } else {
    alert('Introdu valori corecte în toate câmpurile!');
  }
}
