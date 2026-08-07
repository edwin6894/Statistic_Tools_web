// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Close dropdown
    document.getElementById('optionsContent')?.classList.remove('show');

    // Reset previous calculator when switching
    resetPreviousCalculator();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TOGGLE SIDEBAR GROUP =====
function toggleGroup(groupId) {
    const group = document.getElementById(groupId);
    const arrow = group?.parentElement?.querySelector('.group-arrow');
    if (group) {
        group.classList.toggle('open');
        if (arrow) arrow.classList.toggle('rotated');
    }
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== RESET PREVIOUS CALCULATOR =====
let currentSection = 'home';

function resetPreviousCalculator() {
    // Clear all result boxes and inputs
    document.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.error-box').forEach(el => el.style.display = 'none');
}

// ===== RESET SPECIFIC CALCULATOR =====
function resetCalculator(section) {
    const container = document.getElementById('section-' + section);
    if (!container) return;

    // Clear all inputs in this section
    container.querySelectorAll('.glass-input').forEach(input => input.value = '');

    // Hide results and errors
    container.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    container.querySelectorAll('.error-box').forEach(el => el.style.display = 'none');
}

// ===== OPTIONS DROPDOWN =====
document.addEventListener('DOMContentLoaded', function() {
    const optionsBtn = document.getElementById('optionsBtn');
    const optionsContent = document.getElementById('optionsContent');

    if (optionsBtn && optionsContent) {
        optionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            optionsContent.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            optionsContent.classList.remove('show');
        });
    }

    // ===== SIDEBAR BUTTONS =====
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) showSection(section);
        });
    });

    // ===== ENTER KEY SUPPORT =====
    document.querySelectorAll('.glass-input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const section = this.closest('.section')?.id?.replace('section-', '');
                if (section) {
                    const calcMap = {
                        'mean': calculateMean,
                        'geometric': calculateGeometric,
                        'harmonic': calculateHarmonic,
                        'weighted': calculateWeighted,
                        'median': calculateMedian,
                        'mediandiscrete': calculateMedianDiscrete,
                        'mediangrouped': calculateMedianGrouped,
                        'mode': calculateMode,
                        'modediscrete': calculateModeDiscrete,
                        'modegrouped': calculateModeGrouped,
                        'meanfd': calculateMeanFD,
                        'geometricfd': calculateGeometricFD,
                        'harmonicfd': calculateHarmonicFD,
                        'weightedfd': calculateWeightedFD
                    };
                    if (calcMap[section]) calcMap[section]();
                }
            }
        });
    });
});

// ===== UTILITY FUNCTIONS =====
function parseInput(inputId) {
    const value = document.getElementById(inputId).value;
    return value.split(/[ ,]+/).filter(n => n !== '').map(Number);
}

function showResult(resultId, outputId, metaId, value, meta) {
    document.getElementById(outputId).textContent = value;
    if (meta && metaId) document.getElementById(metaId).textContent = meta;
    document.getElementById(resultId).style.display = 'block';
    document.getElementById(resultId.replace('Result', 'Error')).style.display = 'none';
}

function showError(errorId, message) {
    const el = document.getElementById(errorId);
    el.textContent = '⚠️ ' + message;
    el.style.display = 'block';
    document.getElementById(errorId.replace('Error', 'Result')).style.display = 'none';
}

function hideErrors() {
    document.querySelectorAll('.error-box').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.result-box').forEach(e => e.style.display = 'none');
}

// ===== MEAN =====
function calculateMean() {
    hideErrors();
    const numbers = parseInput('meanInput');
    if (numbers.length === 0) return showError('meanError', 'Please enter some numbers!');
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    showResult('meanResult', 'meanOutput', 'meanMeta', mean.toFixed(4), `Based on ${numbers.length} values`);
}

// ===== GEOMETRIC =====
function calculateGeometric() {
    hideErrors();
    const numbers = parseInput('geometricInput');
    if (numbers.length === 0) return showError('geometricError', 'Please enter some numbers!');
    if (numbers.some(n => n <= 0)) return showError('geometricError', 'All values must be positive!');
    const product = numbers.reduce((a, b) => a * b, 1);
    const gm = Math.pow(product, 1 / numbers.length);
    showResult('geometricResult', 'geometricOutput', 'geometricMeta', gm.toFixed(4), `Based on ${numbers.length} values`);
}

// ===== HARMONIC =====
function calculateHarmonic() {
    hideErrors();
    const numbers = parseInput('harmonicInput');
    if (numbers.length === 0) return showError('harmonicError', 'Please enter some numbers!');
    if (numbers.some(n => n <= 0)) return showError('harmonicError', 'All values must be positive!');
    const sumReciprocal = numbers.reduce((a, b) => a + 1 / b, 0);
    const hm = numbers.length / sumReciprocal;
    showResult('harmonicResult', 'harmonicOutput', 'harmonicMeta', hm.toFixed(4), `Based on ${numbers.length} values`);
}

// ===== WEIGHTED =====
function calculateWeighted() {
    hideErrors();
    const values = parseInput('weightedValuesInput');
    const weights = parseInput('weightedWeightsInput');
    if (values.length === 0 || weights.length === 0) return showError('weightedError', 'Please enter both values and weights!');
    if (values.length !== weights.length) return showError('weightedError', 'Values and weights must have same count!');
    if (weights.some(w => w < 0)) return showError('weightedError', 'Weights cannot be negative!');
    const sumWX = values.reduce((s, v, i) => s + v * weights[i], 0);
    const sumW = weights.reduce((a, b) => a + b, 0);
    if (sumW === 0) return showError('weightedError', 'Total weight cannot be zero!');
    const wm = sumWX / sumW;
    showResult('weightedResult', 'weightedOutput', 'weightedMeta', wm.toFixed(4), `ΣW = ${sumW}`);
}

// ===== MEDIAN =====
function calculateMedian() {
    hideErrors();
    const numbers = parseInput('medianInput');
    if (numbers.length === 0) return showError('medianError', 'Please enter some numbers!');
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;
    let median;
    if (n % 2 === 1) median = sorted[Math.floor(n / 2)];
    else median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    showResult('medianResult', 'medianOutput', 'medianMeta', median.toFixed(4), `Sorted: ${sorted.join(', ')}`);
}

// ===== MEDIAN DISCRETE =====
function calculateMedianDiscrete() {
    hideErrors();
    const values = parseInput('mediandiscreteValuesInput');
    const freqs = parseInput('mediandiscreteFreqInput');
    if (values.length === 0 || freqs.length === 0) return showError('mediandiscreteError', 'Please enter both values and frequencies!');
    if (values.length !== freqs.length) return showError('mediandiscreteError', 'Values and frequencies must have same count!');
    if (freqs.some(f => f <= 0)) return showError('mediandiscreteError', 'Frequencies must be positive!');

    let totalFreq = freqs.reduce((a, b) => a + b, 0);
    let half = totalFreq / 2;
    let cumulative = 0;
    let median = null;

    for (let i = 0; i < values.length; i++) {
        cumulative += freqs[i];
        if (cumulative >= half) {
            median = values[i];
            break;
        }
    }

    showResult('mediandiscreteResult', 'mediandiscreteOutput', 'mediandiscreteMeta', median, `Total N = ${totalFreq}`);
}

// ===== MEDIAN GROUPED =====
function calculateMedianGrouped() {
    hideErrors();
    const limits = parseInput('mediangroupedLimitsInput');
    const freqs = parseInput('mediangroupedFreqInput');
    const width = parseFloat(document.getElementById('mediangroupedWidthInput').value);

    if (limits.length === 0 || freqs.length === 0) return showError('mediangroupedError', 'Please enter all fields!');
    if (limits.length !== freqs.length) return showError('mediangroupedError', 'Limits and frequencies must have same count!');
    if (isNaN(width) || width <= 0) return showError('mediangroupedError', 'Please enter a valid class width!');

    let totalFreq = freqs.reduce((a, b) => a + b, 0);
    let half = totalFreq / 2;
    let cumulative = 0;
    let medianIndex = -1;

    for (let i = 0; i < limits.length; i++) {
        cumulative += freqs[i];
        if (cumulative >= half) {
            medianIndex = i;
            break;
        }
    }

    if (medianIndex === -1) return showError('mediangroupedError', 'Median class not found!');

    let L = limits[medianIndex];
    let cf = cumulative - freqs[medianIndex];
    let f = freqs[medianIndex];
    let median = L + ((half - cf) / f) * width;

    showResult('mediangroupedResult', 'mediangroupedOutput', 'mediangroupedMeta', median.toFixed(4), `Modal class: ${L} (f=${f})`);
}

// ===== MODE =====
function calculateMode() {
    hideErrors();
    const numbers = parseInput('modeInput');
    if (numbers.length === 0) return showError('modeError', 'Please enter some numbers!');
    const freq = {};
    numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    if (modes.length === numbers.length) {
        showResult('modeResult', 'modeOutput', 'modeMeta', 'No Mode', 'All values are unique');
    } else {
        showResult('modeResult', 'modeOutput', 'modeMeta', modes.join(', '), `Frequency: ${maxFreq}`);
    }
}

// ===== MODE DISCRETE =====
function calculateModeDiscrete() {
    hideErrors();
    const values = parseInput('modediscreteValuesInput');
    const freqs = parseInput('modediscreteFreqInput');
    if (values.length === 0 || freqs.length === 0) return showError('modediscreteError', 'Please enter both values and frequencies!');
    if (values.length !== freqs.length) return showError('modediscreteError', 'Values and frequencies must have same count!');
    if (freqs.some(f => f <= 0)) return showError('modediscreteError', 'Frequencies must be positive!');

    let maxFreq = Math.max(...freqs);
    let modes = values.filter((_, i) => freqs[i] === maxFreq);

    showResult('modediscreteResult', 'modediscreteOutput', 'modediscreteMeta', modes.join(', '), `Highest frequency: ${maxFreq}`);
}

// ===== MODE GROUPED =====
function calculateModeGrouped() {
    hideErrors();
    const limits = parseInput('modegroupedLimitsInput');
    const freqs = parseInput('modegroupedFreqInput');
    const width = parseFloat(document.getElementById('modegroupedWidthInput').value);

    if (limits.length === 0 || freqs.length === 0) return showError('modegroupedError', 'Please enter all fields!');
    if (limits.length !== freqs.length) return showError('modegroupedError', 'Limits and frequencies must have same count!');
    if (isNaN(width) || width <= 0) return showError('modegroupedError', 'Please enter a valid class width!');

    let maxFreq = Math.max(...freqs);
    let modalIndex = freqs.indexOf(maxFreq);

    if (modalIndex === -1) return showError('modegroupedError', 'Modal class not found!');

    let L = limits[modalIndex];
    let f1 = freqs[modalIndex];
    let f0 = modalIndex > 0 ? freqs[modalIndex - 1] : 0;
    let f2 = modalIndex < freqs.length - 1 ? freqs[modalIndex + 1] : 0;

    let mode = L + ((f1 - f0) / (2 * f1 - f0 - f2)) * width;

    showResult('modegroupedResult', 'modegroupedOutput', 'modegroupedMeta', mode.toFixed(4), `Modal class: ${L} (f=${f1})`);
}

// ===== MEAN FD =====
function calculateMeanFD() {
    hideErrors();
    const midpoints = parseInput('meanfdMidpointsInput');
    const frequencies = parseInput('meanfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('meanfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('meanfdError', 'Midpoints and frequencies must have same count!');
    const sumFx = midpoints.reduce((s, x, i) => s + x * frequencies[i], 0);
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    if (sumF === 0) return showError('meanfdError', 'Total frequency cannot be zero!');
    const mean = sumFx / sumF;
    showResult('meanfdResult', 'meanfdOutput', 'meanfdMeta', mean.toFixed(4), `Σf = ${sumF}`);
}

// ===== GEOMETRIC FD =====
function calculateGeometricFD() {
    hideErrors();
    const midpoints = parseInput('geometricfdMidpointsInput');
    const frequencies = parseInput('geometricfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('geometricfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('geometricfdError', 'Midpoints and frequencies must have same count!');
    if (midpoints.some(x => x <= 0)) return showError('geometricfdError', 'All midpoints must be positive!');
    const sumFLogX = midpoints.reduce((s, x, i) => s + frequencies[i] * Math.log10(x), 0);
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    if (sumF === 0) return showError('geometricfdError', 'Total frequency cannot be zero!');
    const gm = Math.pow(10, sumFLogX / sumF);
    showResult('geometricfdResult', 'geometricfdOutput', 'geometricfdMeta', gm.toFixed(4), `Σf = ${sumF}`);
}

// ===== HARMONIC FD =====
function calculateHarmonicFD() {
    hideErrors();
    const midpoints = parseInput('harmonicfdMidpointsInput');
    const frequencies = parseInput('harmonicfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('harmonicfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('harmonicfdError', 'Midpoints and frequencies must have same count!');
    if (midpoints.some(x => x <= 0)) return showError('harmonicfdError', 'All midpoints must be positive!');
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    const sumFOverX = midpoints.reduce((s, x, i) => s + frequencies[i] / x, 0);
    if (sumFOverX === 0) return showError('harmonicfdError', 'Calculation error!');
    const hm = sumF / sumFOverX;
    showResult('harmonicfdResult', 'harmonicfdOutput', 'harmonicfdMeta', hm.toFixed(4), `Σf = ${sumF}`);
}

// ===== WEIGHTED FD =====
function calculateWeightedFD() {
    hideErrors();
    const midpoints = parseInput('weightedfdMidpointsInput');
    const weights = parseInput('weightedfdWeightsInput');
    if (midpoints.length === 0 || weights.length === 0) return showError('weightedfdError', 'Please enter both midpoints and weights!');
    if (midpoints.length !== weights.length) return showError('weightedfdError', 'Midpoints and weights must have same count!');
    if (weights.some(w => w < 0)) return showError('weightedfdError', 'Weights cannot be negative!');
    const sumWX = midpoints.reduce((s, x, i) => s + x * weights[i], 0);
    const sumW = weights.reduce((a, b) => a + b, 0);
    if (sumW === 0) return showError('weightedfdError', 'Total weight cannot be zero!');
    const wm = sumWX / sumW;
    showResult('weightedfdResult', 'weightedfdOutput', 'weightedfdMeta', wm.toFixed(4), `ΣW = ${sumW}`);
}

// ===== REVIEW SYSTEM =====
let currentRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = parseInt(this.dataset.value);
            updateStars(currentRating);
        });
        star.addEventListener('mouseenter', function() {
            const val = parseInt(this.dataset.value);
            stars.forEach((s, idx) => {
                s.className = idx < val ? 'fas fa-star hover' : 'far fa-star';
            });
        });
        star.addEventListener('mouseleave', function() {
            updateStars(currentRating);
        });
    });
});

function updateStars(rating) {
    document.querySelectorAll('#starRating i').forEach((star, idx) => {
        star.className = idx < rating ? 'fas fa-star active' : 'far fa-star';
    });
}

async function submitReview() {
    const name = document.getElementById('reviewName').value.trim();
    const email = document.getElementById('reviewEmail').value.trim();
    const review = document.getElementById('reviewText').value.trim();

    if (!name || !email || !review) {
        alert('Please fill all fields before submitting.');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        alert('Please enter a valid email address.');
        return;
    }

    const ratingText = currentRating > 0 ? `${currentRating} star${currentRating !== 1 ? 's' : ''}` : 'No rating';

    const btn = document.querySelector('.btn-submit-review');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('rating', ratingText);
        formData.append('message', review);
        formData.append('_subject', `Statistic_Tools Feedback from ${name}`);
        formData.append('_template', 'table');

        const response = await fetch('https://formsubmit.co/ajax/edwinchulliyil6894@gmail.com', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('✅ Review submitted! Thank you for your feedback!');
            document.getElementById('reviewName').value = '';
            document.getElementById('reviewEmail').value = '';
            document.getElementById('reviewText').value = '';
            currentRating = 0;
            updateStars(0);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        alert('⚠️ Unable to send feedback at the moment. Please try again later.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    }
}
// ===== GO TO HOME =====
function goHome() {
    showSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// ===== EXCEL EXPORT FUNCTION (Proper .xlsx) =====
function exportToExcel(section) {
    const container = document.getElementById('section-' + section);
    if (!container) return;

    // Find all input fields in this section
    const inputs = container.querySelectorAll('.glass-input');
    const inputData = [];
    let hasData = false;

    inputs.forEach(input => {
        const values = input.value.split(/[ ,]+/).filter(n => n !== '').map(Number);
        if (values.length > 0) {
            // Get label from the label element above the input
            const labelEl = input.closest('.form-group')?.querySelector('label');
            const label = labelEl ? labelEl.textContent.trim().replace(/[^a-zA-Z0-9 ]/g, '') : 'Data';
            inputData.push({
                label: label,
                values: values
            });
            hasData = true;
        }
    });

    if (!hasData) {
        alert('📊 Please enter some data first!');
        return;
    }

    // Prepare data for Excel
    const wbData = [];

    // Title row
    const sectionTitle = container.querySelector('.calc-title')?.textContent || 'Statistic Tools Data';
    wbData.push([sectionTitle]);
    wbData.push([]); // Empty row

    // Headers
    const headers = inputData.map(d => d.label);
    wbData.push(headers);

    // Rows
    const maxLen = Math.max(...inputData.map(d => d.values.length));
    for (let i = 0; i < maxLen; i++) {
        const row = inputData.map(d => d.values[i] !== undefined ? d.values[i] : '');
        wbData.push(row);
    }

    // Add result if available
    const resultBox = container.querySelector('.result-box');
    if (resultBox && resultBox.style.display !== 'none') {
        const resultText = resultBox.querySelector('.result-value')?.textContent || '';
        if (resultText) {
            wbData.push([]);
            wbData.push(['Result']);
            wbData.push([resultText]);
        }
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wbData);

    // Auto column widths
    const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Statistics');

    // Generate file name
    const fileName = `${section}_data_${new Date().toISOString().slice(0,10)}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);

    // Show success message
    showToast('✅ Excel file saved successfully!', 'success');
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 28px;
        background: rgba(10, 18, 22, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid ${colors[type] || colors.info}44;
        border-radius: 16px;
        color: #eef5ff;
        font-size: 0.95rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 15px 40px rgba(0,0,0,0.5);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 200px;
    `;
    toast.innerHTML = `<span style="color:${colors[type] || colors.info}">${message}</span>`;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        icon.style.color = '#f0c060';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '';
    }
}

// ===== LOAD SAVED THEME =====
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const toggleIcon = document.querySelector('#themeToggle i');
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('light-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-moon';
    }
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    // ... rest of your existing DOMContentLoaded code ...
});
// ===== GRAPH STATE =====
let currentChartType = 'bar';
let graphChartInstance = null;

// ===== SELECT CHART TYPE =====
function selectChartType(type) {
    currentChartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    // Show/hide double bar inputs
    const doubleBarRow = document.getElementById('doubleBarRow');
    if (type === 'doublebar') {
        doubleBarRow.style.display = 'grid';
        doubleBarRow.classList.add('show');
    } else {
        doubleBarRow.style.display = 'none';
        doubleBarRow.classList.remove('show');
    }

    // Reset graph display when switching types
    document.getElementById('graphDisplay').style.display = 'none';
    document.getElementById('graphError').style.display = 'none';
}

// ===== GENERATE GRAPH =====
function generateGraph() {
    const labelsInput = document.getElementById('graphLabels').value.trim();
    const valuesInput = document.getElementById('graphValues').value.trim();
    const values2Input = document.getElementById('graphValues2')?.value.trim() || '';

    // Hide previous error
    document.getElementById('graphError').style.display = 'none';
    document.getElementById('graphDisplay').style.display = 'none';

    // Validate inputs
    if (!labelsInput || !valuesInput) {
        showGraphError('Please enter both labels and values!');
        return;
    }

    const labels = labelsInput.split(',').map(s => s.trim()).filter(s => s !== '');
    let values = valuesInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    let values2 = [];

    // Handle double bar
    if (currentChartType === 'doublebar') {
        if (!values2Input) {
            showGraphError('Please enter Dataset 2 for double bar chart!');
            return;
        }
        values2 = values2Input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (values.length !== values2.length) {
            showGraphError(`Dataset 1 (${values.length}) and Dataset 2 (${values2.length}) must match!`);
            return;
        }
        if (labels.length !== values.length) {
            showGraphError(`Labels (${labels.length}) and values (${values.length}) must match!`);
            return;
        }
    } else {
        if (labels.length !== values.length) {
            showGraphError(`Labels (${labels.length}) and values (${values.length}) must match!`);
            return;
        }
    }

    // Show graph display
    const display = document.getElementById('graphDisplay');
    display.style.display = 'block';

    // Destroy previous chart
    if (graphChartInstance) {
        graphChartInstance.destroy();
        graphChartInstance = null;
    }

    // Create chart
    const ctx = document.getElementById('graphCanvas');
    const isDark = document.body.classList.contains('light-mode') ? false : true;

    const colors = [
        'rgba(180, 255, 100, 0.8)',
        'rgba(100, 200, 255, 0.8)',
        'rgba(255, 200, 100, 0.8)',
        'rgba(255, 100, 150, 0.8)',
        'rgba(150, 100, 255, 0.8)',
        'rgba(100, 255, 200, 0.8)',
        'rgba(255, 150, 50, 0.8)',
        'rgba(50, 200, 100, 0.8)'
    ];

    const borderColors = colors.map(c => c.replace('0.8', '1'));

    // === DOUBLE BAR CHART ===
    if (currentChartType === 'doublebar') {
        const label2 = document.getElementById('graphLabel2')?.value || 'Dataset 2';
        graphChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: values,
                        backgroundColor: 'rgba(180, 255, 100, 0.8)',
                        borderColor: 'rgba(180, 255, 100, 1)',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: label2,
                        data: values2,
                        backgroundColor: 'rgba(100, 200, 255, 0.8)',
                        borderColor: 'rgba(100, 200, 255, 1)',
                        borderWidth: 2,
                        borderRadius: 4
                    }
                ]
            },
            options: getChartOptions(isDark, true)
        });

        // Stats for double bar
        const total = values.reduce((a, b) => a + b, 0);
        const total2 = values2.reduce((a, b) => a + b, 0);
        const avg = (total / values.length).toFixed(2);
        const avg2 = (total2 / values2.length).toFixed(2);

        document.getElementById('graphStats').innerHTML = `
            <div class="stat-item"><span>📊 Dataset 1 Total</span> <strong>${total.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📈 Dataset 1 Avg</span> <strong>${avg}</strong></div>
            <div class="stat-item"><span>📊 Dataset 2 Total</span> <strong>${total2.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📈 Dataset 2 Avg</span> <strong>${avg2}</strong></div>
        `;

        showToast('✅ Double bar chart generated!', 'success');
        return;
    }

    // === BOX PLOT ===
    if (currentChartType === 'boxplot') {
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        const min = sorted[0];
        const max = sorted[n - 1];
        const q1 = sorted[Math.floor(n * 0.25)];
        const median = sorted[Math.floor(n * 0.5)];
        const q3 = sorted[Math.floor(n * 0.75)];

        graphChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
                datasets: [{
                    label: 'Box Plot Statistics',
                    data: [min, q1, median, q3, max],
                    backgroundColor: [
                        'rgba(255, 100, 100, 0.6)',
                        'rgba(180, 255, 100, 0.6)',
                        'rgba(100, 200, 255, 0.8)',
                        'rgba(180, 255, 100, 0.6)',
                        'rgba(255, 100, 100, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 100, 100, 1)',
                        'rgba(180, 255, 100, 1)',
                        'rgba(100, 200, 255, 1)',
                        'rgba(180, 255, 100, 1)',
                        'rgba(255, 100, 100, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: isDark ? '#eef5ff' : '#1a2a1a',
                            font: { size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(10,18,22,0.9)' : 'rgba(255,255,255,0.9)',
                        titleColor: isDark ? '#eef5ff' : '#1a2a1a',
                        bodyColor: isDark ? '#bde5a0' : '#2a4a2a',
                        borderColor: 'rgba(180,255,100,0.3)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataIndex === 0 ? 'Minimum' :
                                             context.dataIndex === 1 ? 'Q1 (25th percentile)' :
                                             context.dataIndex === 2 ? 'Median (Q2)' :
                                             context.dataIndex === 3 ? 'Q3 (75th percentile)' :
                                             'Maximum';
                                return `${label}: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' },
                        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' },
                        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                    }
                }
            }
        });

        document.getElementById('graphStats').innerHTML = `
            <div class="stat-item"><span>📊 Min</span> <strong>${min.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📈 Q1</span> <strong>${q1.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📊 Median</span> <strong>${median.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📈 Q3</span> <strong>${q3.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📊 Max</span> <strong>${max.toFixed(2)}</strong></div>
            <div class="stat-item"><span>📐 IQR</span> <strong>${(q3 - q1).toFixed(2)}</strong></div>
        `;

        showToast('✅ Box plot generated!', 'success');
        return;
    }

    // === STANDARD CHARTS (Bar, Pie, Line, Polar) ===
    const chartConfig = {
        type: currentChartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: values,
                backgroundColor: colors.slice(0, values.length),
                borderColor: borderColors.slice(0, values.length),
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: getChartOptions(isDark, false)
    };

    // For pie/doughnut/polar, remove scales
    if (['pie', 'polarArea'].includes(currentChartType)) {
        delete chartConfig.options.scales;
    }

    graphChartInstance = new Chart(ctx, chartConfig);

    // Stats for standard charts
    const total = values.reduce((a, b) => a + b, 0);
    const avg = (total / values.length).toFixed(2);
    const max = Math.max(...values);
    const min = Math.min(...values);

    document.getElementById('graphStats').innerHTML = `
        <div class="stat-item"><span>📊 Total</span> <strong>${total.toFixed(2)}</strong></div>
        <div class="stat-item"><span>📈 Average</span> <strong>${avg}</strong></div>
        <div class="stat-item"><span>⬆ Max</span> <strong>${max.toFixed(2)}</strong></div>
        <div class="stat-item"><span>⬇ Min</span> <strong>${min.toFixed(2)}</strong></div>
    `;

    showToast('✅ Graph generated successfully!', 'success');
}

// ===== GET CHART OPTIONS =====
function getChartOptions(isDark, isDoubleBar) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? '#eef5ff' : '#1a2a1a',
                    font: { size: 12, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(10,18,22,0.9)' : 'rgba(255,255,255,0.9)',
                titleColor: isDark ? '#eef5ff' : '#1a2a1a',
                bodyColor: isDark ? '#bde5a0' : '#2a4a2a',
                borderColor: 'rgba(180,255,100,0.3)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' },
                grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
            },
            x: {
                ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' },
                grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
            }
        }
    };
}

// ===== SHOW GRAPH ERROR =====
function showGraphError(message) {
    const error = document.getElementById('graphError');
    error.textContent = '⚠️ ' + message;
    error.style.display = 'block';
    document.getElementById('graphDisplay').style.display = 'none';
}

// ===== EXPORT GRAPH =====
function exportGraph() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) {
        showToast('⚠️ No graph to export!', 'error');
        return;
    }
    const link = document.createElement('a');
    link.download = `graph_${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✅ Graph saved as image!', 'success');
}

// ===== RESET GRAPH =====
function resetGraph() {
    document.getElementById('graphLabels').value = '';
    document.getElementById('graphValues').value = '';
    document.getElementById('graphValues2').value = '';
    document.getElementById('graphLabel2').value = 'Dataset 2';
    document.getElementById('graphDisplay').style.display = 'none';
    document.getElementById('graphError').style.display = 'none';

    // Reset chart type to bar
    currentChartType = 'bar';
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'bar');
    });
    document.getElementById('doubleBarRow').style.display = 'none';
    document.getElementById('doubleBarRow').classList.remove('show');

    if (graphChartInstance) {
        graphChartInstance.destroy();
        graphChartInstance = null;
    }

    showToast('🔄 Graph reset!', 'info');
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 28px;
        background: rgba(10, 18, 22, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid ${colors[type] || colors.info}44;
        border-radius: 16px;
        color: #eef5ff;
        font-size: 0.95rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 15px 40px rgba(0,0,0,0.5);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 200px;
    `;
    toast.innerHTML = `<span style="color:${colors[type] || colors.info}">${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
