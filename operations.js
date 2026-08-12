// ===== UTILITY FUNCTIONS =====

function parseInput(inputId) {
    const value = document.getElementById(inputId).value;
    return value.split(/[ ,]+/).filter(n => n !== '').map(Number);
}

function showResult(resultId, outputId, metaId, value, meta) {
    const resultEl = document.getElementById(resultId);
    const outputEl = document.getElementById(outputId);
    const metaEl = document.getElementById(metaId);
    if (resultEl) resultEl.style.display = 'block';
    if (outputEl) outputEl.textContent = value;
    if (metaEl && meta) metaEl.textContent = meta;
    const errorEl = document.getElementById(resultId.replace('Result', 'Error'));
    if (errorEl) errorEl.style.display = 'none';
}

function showError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = '⚠️ ' + message;
        errorEl.style.display = 'block';
    }
    const resultEl = document.getElementById(errorId.replace('Error', 'Result'));
    if (resultEl) resultEl.style.display = 'none';
}

function hideErrors() {
    document.querySelectorAll('.error-box').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.result-box').forEach(e => e.style.display = 'none');
}

function goHome() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';
    showSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TOGGLE SIDEBAR GROUP DROPDOWN =====
function toggleGroup(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
        group.classList.toggle('open');
        const arrow = group.parentElement?.querySelector('.group-arrow');
        if (arrow) arrow.classList.toggle('rotated');
    }
}

// ===== SECTION NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById('section-' + sectionId);
    if (target) {
        target.classList.add('active');
    } else {
        alert('Section not found: section-' + sectionId);
        return;
    }
    
    const sidebar = document.getElementById('sidebar');
    if (sectionId !== 'home' && sidebar) sidebar.style.display = 'block';
    
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });
    
    // Auto-Close all open dropdowns after selection (Mobile UX)
    document.querySelectorAll('.sidebar-group-items').forEach(group => group.classList.remove('open'));
    document.querySelectorAll('.group-arrow').forEach(arrow => arrow.classList.remove('rotated'));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetCalculator(section) {
    const container = document.getElementById('section-' + section);
    if (!container) return;
    container.querySelectorAll('.glass-input').forEach(input => input.value = '');
    container.querySelectorAll('.result-box').forEach(el => el.style.display = 'none');
    container.querySelectorAll('.error-box').forEach(el => el.style.display = 'none');
    container.querySelectorAll('.graph-display').forEach(el => el.style.display = 'none');
}

// ===== SIDEBAR BUTTON CLICK HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) showSection(section);
        });
    });
});

// ===== MEAN FUNCTIONS =====

function calculateMean() {
    hideErrors();
    const numbers = parseInput('meanInput');
    if (numbers.length === 0) return showError('meanError', 'Please enter some numbers!');
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    showResult('meanResult', 'meanOutput', 'meanMeta', mean.toFixed(4), `Based on ${numbers.length} values`);
}

function calculateGeometric() {
    hideErrors();
    const numbers = parseInput('geometricInput');
    if (numbers.length === 0) return showError('geometricError', 'Please enter some numbers!');
    if (numbers.some(n => n <= 0)) return showError('geometricError', 'All values must be positive!');
    
    // UPGRADED: Logarithmic sum prevents "Infinity" crashes with large datasets
    const sumLog = numbers.reduce((s, n) => s + Math.log(n), 0);
    const gm = Math.exp(sumLog / numbers.length);
    
    showResult('geometricResult', 'geometricOutput', 'geometricMeta', gm.toFixed(4), `Based on ${numbers.length} values`);
}

function calculateHarmonic() {
    hideErrors();
    const numbers = parseInput('harmonicInput');
    if (numbers.length === 0) return showError('harmonicError', 'Please enter some numbers!');
    if (numbers.some(n => n <= 0)) return showError('harmonicError', 'All values must be positive!');
    const hm = numbers.length / numbers.reduce((s, n) => s + 1 / n, 0);
    showResult('harmonicResult', 'harmonicOutput', 'harmonicMeta', hm.toFixed(4), `Based on ${numbers.length} values`);
}

function calculateWeighted() {
    hideErrors();
    const values = parseInput('weightedValuesInput');
    const weights = parseInput('weightedWeightsInput');
    if (values.length === 0 || weights.length === 0) return showError('weightedError', 'Please enter both values and weights!');
    if (values.length !== weights.length) return showError('weightedError', 'Values and weights must match!');
    if (weights.some(w => w < 0)) return showError('weightedError', 'Weights cannot be negative!');
    const wm = values.reduce((s, v, i) => s + v * weights[i], 0) / weights.reduce((a, b) => a + b, 0);
    showResult('weightedResult', 'weightedOutput', 'weightedMeta', wm.toFixed(4), `ΣW = ${weights.reduce((a, b) => a + b, 0)}`);
}

function calculateMeanFD() {
    hideErrors();
    const midpoints = parseInput('meanfdMidpointsInput');
    const frequencies = parseInput('meanfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('meanfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('meanfdError', 'Midpoints and frequencies must match!');
    const sumFx = midpoints.reduce((s, x, i) => s + x * frequencies[i], 0);
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    if (sumF === 0) return showError('meanfdError', 'Total frequency cannot be zero!');
    showResult('meanfdResult', 'meanfdOutput', 'meanfdMeta', (sumFx / sumF).toFixed(4), `Σf = ${sumF}`);
}

function calculateGeometricFD() {
    hideErrors();
    const midpoints = parseInput('geometricfdMidpointsInput');
    const frequencies = parseInput('geometricfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('geometricfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('geometricfdError', 'Midpoints and frequencies must match!');
    if (midpoints.some(x => x <= 0)) return showError('geometricfdError', 'All midpoints must be positive!');
    const sumFLogX = midpoints.reduce((s, x, i) => s + frequencies[i] * Math.log(x), 0);
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    if (sumF === 0) return showError('geometricfdError', 'Total frequency cannot be zero!');
    showResult('geometricfdResult', 'geometricfdOutput', 'geometricfdMeta', Math.exp(sumFLogX / sumF).toFixed(4), `Σf = ${sumF}`);
}

function calculateHarmonicFD() {
    hideErrors();
    const midpoints = parseInput('harmonicfdMidpointsInput');
    const frequencies = parseInput('harmonicfdFrequenciesInput');
    if (midpoints.length === 0 || frequencies.length === 0) return showError('harmonicfdError', 'Please enter both midpoints and frequencies!');
    if (midpoints.length !== frequencies.length) return showError('harmonicfdError', 'Midpoints and frequencies must match!');
    if (midpoints.some(x => x <= 0)) return showError('harmonicfdError', 'All midpoints must be positive!');
    const sumF = frequencies.reduce((a, b) => a + b, 0);
    const sumFOverX = midpoints.reduce((s, x, i) => s + frequencies[i] / x, 0);
    if (sumFOverX === 0) return showError('harmonicfdError', 'Calculation error!');
    showResult('harmonicfdResult', 'harmonicfdOutput', 'harmonicfdMeta', (sumF / sumFOverX).toFixed(4), `Σf = ${sumF}`);
}

function calculateWeightedFD() {
    hideErrors();
    const midpoints = parseInput('weightedfdMidpointsInput');
    const weights = parseInput('weightedfdWeightsInput');
    if (midpoints.length === 0 || weights.length === 0) return showError('weightedfdError', 'Please enter both midpoints and weights!');
    if (midpoints.length !== weights.length) return showError('weightedfdError', 'Midpoints and weights must match!');
    if (weights.some(w => w < 0)) return showError('weightedfdError', 'Weights cannot be negative!');
    const sumWX = midpoints.reduce((s, x, i) => s + x * weights[i], 0);
    const sumW = weights.reduce((a, b) => a + b, 0);
    if (sumW === 0) return showError('weightedfdError', 'Total weight cannot be zero!');
    showResult('weightedfdResult', 'weightedfdOutput', 'weightedfdMeta', (sumWX / sumW).toFixed(4), `ΣW = ${sumW}`);
}

// ===== MEDIAN FUNCTIONS =====

function calculateMedian() {
    hideErrors();
    const numbers = parseInput('medianInput');
    if (numbers.length === 0) return showError('medianError', 'Please enter some numbers!');
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;
    const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    showResult('medianResult', 'medianOutput', 'medianMeta', median.toFixed(4), `Sorted: ${sorted.join(', ')}`);
}

function calculateMedianDiscrete() {
    hideErrors();
    const values = parseInput('mediandiscreteValuesInput');
    const freqs = parseInput('mediandiscreteFreqInput');
    if (values.length === 0 || freqs.length === 0) return showError('mediandiscreteError', 'Please enter both values and frequencies!');
    if (values.length !== freqs.length) return showError('mediandiscreteError', 'Values and frequencies must match!');
    if (freqs.some(f => f < 0)) return showError('mediandiscreteError', 'Frequencies cannot be negative!');
    
    // UPGRADED: Accurate handling of Even/Odd discrete median bounds
    const pairs = values.map((v, i) => ({v, f: freqs[i]})).sort((a, b) => a.v - b.v);
    const total = pairs.reduce((sum, p) => sum + p.f, 0);
    let median = null;

    if (total % 2 !== 0) {
        let target = total / 2;
        let cum = 0;
        for (let i = 0; i < pairs.length; i++) {
            cum += pairs[i].f;
            if (cum > target) { median = pairs[i].v; break; }
        }
    } else {
        let target1 = total / 2;
        let target2 = (total / 2) + 1;
        let val1 = null, val2 = null, cum = 0;
        for (let i = 0; i < pairs.length; i++) {
            cum += pairs[i].f;
            if (val1 === null && cum >= target1) val1 = pairs[i].v;
            if (val2 === null && cum >= target2) val2 = pairs[i].v;
            if (val1 !== null && val2 !== null) break;
        }
        median = (val1 + val2) / 2;
    }
    showResult('mediandiscreteResult', 'mediandiscreteOutput', 'mediandiscreteMeta', median.toFixed(4), `Total N = ${total}`);
}

function calculateMedianGrouped() {
    hideErrors();
    const limits = parseInput('mediangroupedLimitsInput');
    const freqs = parseInput('mediangroupedFreqInput');
    const width = parseFloat(document.getElementById('mediangroupedWidthInput').value);
    if (limits.length === 0 || freqs.length === 0) return showError('mediangroupedError', 'Please enter all fields!');
    if (limits.length !== freqs.length) return showError('mediangroupedError', 'Limits and frequencies must match!');
    if (isNaN(width) || width <= 0) return showError('mediangroupedError', 'Please enter a valid class width!');
    
    const total = freqs.reduce((a, b) => a + b, 0);
    const half = total / 2;
    let cum = 0, idx = -1;
    for (let i = 0; i < limits.length; i++) {
        cum += freqs[i];
        if (cum >= half) { idx = i; break; }
    }
    if (idx === -1) return showError('mediangroupedError', 'Median class not found!');
    
    const L = limits[idx];
    const cf = cum - freqs[idx];
    const f = freqs[idx];
    const median = L + ((half - cf) / f) * width;
    showResult('mediangroupedResult', 'mediangroupedOutput', 'mediangroupedMeta', median.toFixed(4), `Median class: ${L} (f=${f})`);
}

// ===== MODE FUNCTIONS =====

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
        showResult('modeResult', 'modeOutput', 'modeMeta', modes.join(', '), `Highest Frequency: ${maxFreq}`);
    }
}

function calculateModeDiscrete() {
    hideErrors();
    const values = parseInput('modediscreteValuesInput');
    const freqs = parseInput('modediscreteFreqInput');
    if (values.length === 0 || freqs.length === 0) return showError('modediscreteError', 'Please enter both values and frequencies!');
    if (values.length !== freqs.length) return showError('modediscreteError', 'Values and frequencies must match!');
    const maxFreq = Math.max(...freqs);
    const modes = values.filter((_, i) => freqs[i] === maxFreq);
    showResult('modediscreteResult', 'modediscreteOutput', 'modediscreteMeta', modes.join(', '), `Highest frequency: ${maxFreq}`);
}

function calculateModeGrouped() {
    hideErrors();
    const limits = parseInput('modegroupedLimitsInput');
    const freqs = parseInput('modegroupedFreqInput');
    const width = parseFloat(document.getElementById('modegroupedWidthInput').value);
    if (limits.length === 0 || freqs.length === 0) return showError('modegroupedError', 'Please enter all fields!');
    if (limits.length !== freqs.length) return showError('modegroupedError', 'Limits and frequencies must match!');
    if (isNaN(width) || width <= 0) return showError('modegroupedError', 'Please enter a valid class width!');
    const maxFreq = Math.max(...freqs);
    const idx = freqs.indexOf(maxFreq);
    if (idx === -1) return showError('modegroupedError', 'Modal class not found!');
    const L = limits[idx];
    const f1 = freqs[idx];
    const f0 = idx > 0 ? freqs[idx - 1] : 0;
    const f2 = idx < freqs.length - 1 ? freqs[idx + 1] : 0;
    const mode = L + ((f1 - f0) / (2 * f1 - f0 - f2)) * width;
    showResult('modegroupedResult', 'modegroupedOutput', 'modegroupedMeta', mode.toFixed(4), `Modal class: ${L} (f=${f1})`);
}

// ===== DISPERSION FUNCTIONS =====

function calculateRange() {
    hideErrors();
    const numbers = parseInput('rangeInput');
    if (numbers.length === 0) return showError('rangeError', 'Please enter some numbers!');
    const sorted = [...numbers].sort((a, b) => a - b);
    const range = sorted[sorted.length - 1] - sorted[0];
    showResult('rangeResult', 'rangeOutput', 'rangeMeta', range.toFixed(4), `Min: ${sorted[0]}, Max: ${sorted[sorted.length - 1]}`);
}

function calculateMAD() {
    hideErrors();
    const numbers = parseInput('madInput');
    if (numbers.length === 0) return showError('madError', 'Please enter some numbers!');
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const mad = numbers.reduce((s, x) => s + Math.abs(x - mean), 0) / numbers.length;
    showResult('madResult', 'madOutput', 'madMeta', mad.toFixed(4), `Mean: ${mean.toFixed(4)}`);
}

function calculateVariance() {
    hideErrors();
    const numbers = parseInput('varianceInput');
    if (numbers.length === 0) return showError('varianceError', 'Please enter some numbers!');
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const sqDiff = numbers.reduce((s, x) => s + (x - mean) ** 2, 0);
    const popVar = sqDiff / n;
    const sampleVar = sqDiff / (n - 1);
    document.getElementById('varianceOutput').innerHTML = `Population Variance: ${popVar.toFixed(4)}<br>Sample Variance: ${sampleVar.toFixed(4)}`;
    document.getElementById('varianceMeta').textContent = `n = ${n}, Mean = ${mean.toFixed(4)}`;
    document.getElementById('varianceResult').style.display = 'block';
    document.getElementById('varianceError').style.display = 'none';
}

function calculateStdDev() {
    hideErrors();
    const numbers = parseInput('stddevInput');
    if (numbers.length === 0) return showError('stddevError', 'Please enter some numbers!');
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const sqDiff = numbers.reduce((s, x) => s + (x - mean) ** 2, 0);
    const popSD = Math.sqrt(sqDiff / n);
    const sampleSD = Math.sqrt(sqDiff / (n - 1));
    document.getElementById('stddevOutput').innerHTML = `Population SD: ${popSD.toFixed(4)}<br>Sample SD: ${sampleSD.toFixed(4)}`;
    document.getElementById('stddevMeta').textContent = `n = ${n}, Mean = ${mean.toFixed(4)}`;
    document.getElementById('stddevResult').style.display = 'block';
    document.getElementById('stddevError').style.display = 'none';
}

function calculateCV() {
    hideErrors();
    const numbers = parseInput('cvInput');
    if (numbers.length === 0) return showError('cvError', 'Please enter some numbers!');
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const sqDiff = numbers.reduce((s, x) => s + (x - mean) ** 2, 0);
    const sd = Math.sqrt(sqDiff / (n - 1));
    showResult('cvResult', 'cvOutput', 'cvMeta', ((sd / mean) * 100).toFixed(2) + '%', `Mean: ${mean.toFixed(4)}, SD: ${sd.toFixed(4)}`);
}

// ===== QUARTILE FUNCTIONS (UPGRADED EXACT INTERPOLATION) =====

function getPercentileExact(sortedArr, percentileDecimal) {
    const idx = percentileDecimal * (sortedArr.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sortedArr[lower];
    return sortedArr[lower] + (sortedArr[upper] - sortedArr[lower]) * (idx - lower);
}

function calculateQuartiles() {
    hideErrors();
    const numbers = parseInput('quartileInput');
    if (numbers.length < 4) return showError('quartileError', 'Please enter at least 4 numbers!');
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;
    
    // UPGRADED: Linear Percentile Interpolation (Standardized to Match Excel/Python)
    const q1 = getPercentileExact(sorted, 0.25);
    const median = getPercentileExact(sorted, 0.50);
    const q3 = getPercentileExact(sorted, 0.75);
    const iqr = q3 - q1;

    document.getElementById('quartileOutput').innerHTML = `Q1: ${q1.toFixed(4)}<br>Q2 (Median): ${median.toFixed(4)}<br>Q3: ${q3.toFixed(4)}<br>IQR: ${iqr.toFixed(4)}`;
    document.getElementById('quartileMeta').textContent = `n = ${n}`;
    document.getElementById('quartileResult').style.display = 'block';
    document.getElementById('quartileError').style.display = 'none';
}

function calculateFiveNumber() {
    hideErrors();
    const numbers = parseInput('fiveNumberInput');
    if (numbers.length < 4) return showError('fiveNumberError', 'Please enter at least 4 numbers!');
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;
    
    const min = sorted[0];
    const q1 = getPercentileExact(sorted, 0.25);
    const median = getPercentileExact(sorted, 0.50);
    const q3 = getPercentileExact(sorted, 0.75);
    const max = sorted[n - 1];

    document.getElementById('fiveNumberOutput').innerHTML = `Min: ${min.toFixed(4)}<br>Q1: ${q1.toFixed(4)}<br>Median: ${median.toFixed(4)}<br>Q3: ${q3.toFixed(4)}<br>Max: ${max.toFixed(4)}`;
    document.getElementById('fiveNumberMeta').textContent = `n = ${n}`;
    document.getElementById('fiveNumberResult').style.display = 'block';
    document.getElementById('fiveNumberError').style.display = 'none';
}

function calculatePercentile() {
    hideErrors();
    const numbers = parseInput('percentileInput');
    if (numbers.length === 0) return showError('percentileError', 'Please enter some numbers!');
    const p = parseFloat(document.getElementById('percentileValue').value);
    if (p < 0 || p > 100) return showError('percentileError', 'Percentile must be between 0 and 100!');
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const value = getPercentileExact(sorted, p / 100);
    
    showResult('percentileResult', 'percentileOutput', 'percentileMeta', value.toFixed(4), `${p}th percentile of ${sorted.length} values`);
}

// ===== CORRELATION FUNCTIONS =====

function getCorrelationData() {
    const x = document.getElementById('correlationXInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    const y = document.getElementById('correlationYInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    if (x.length === 0 || y.length === 0) { showError('correlationError', 'Please enter both X and Y values!'); return null; }
    if (x.length !== y.length) { showError('correlationError', 'X and Y must have the same number of values!'); return null; }
    return { x, y };
}

function calculateCorrelation() {
    hideErrors();
    const data = getCorrelationData();
    if (!data) return;
    const { x, y } = data;
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
    const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
    const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
    const r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r2 = r * r;
    document.getElementById('correlationOutput').innerHTML = `r (Correlation Coefficient): ${r.toFixed(4)}<br>r² (Coefficient of Determination): ${r2.toFixed(4)}`;
    document.getElementById('correlationMeta').textContent = `n = ${n} pairs`;
    document.getElementById('correlationResult').style.display = 'block';
    document.getElementById('correlationError').style.display = 'none';
}

function calculateRegression() {
    hideErrors();
    const data = getCorrelationData();
    if (!data) return;
    const { x, y } = data;
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
    const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = meanY - slope * meanX;
    const r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * y.reduce((s, yi) => s + yi * yi, 0) - sumY * sumY));
    const r2 = r * r;
    document.getElementById('regressionOutput').innerHTML = `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}<br>R² = ${r2.toFixed(4)}`;
    document.getElementById('regressionMeta').textContent = `n = ${n} pairs`;
    document.getElementById('regressionResult').style.display = 'block';
    document.getElementById('regressionError').style.display = 'none';
}

// ===== SKEWNESS & KURTOSIS =====

function calculateSkewness() {
    hideErrors();
    const numbers = parseInput('skewnessInput');
    if (numbers.length < 3) return showError('skewnessError', 'Please enter at least 3 numbers!');
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1));
    const skew = numbers.reduce((s, x) => s + ((x - mean) / sd) ** 3, 0) / n;
    const type = skew > 0.5 ? 'Positively skewed' : skew < -0.5 ? 'Negatively skewed' : 'Approximately symmetric';
    showResult('skewnessResult', 'skewnessOutput', 'skewnessMeta', skew.toFixed(4), type);
}

function calculateKurtosis() {
    hideErrors();
    const numbers = parseInput('kurtosisInput');
    if (numbers.length < 4) return showError('kurtosisError', 'Please enter at least 4 numbers!');
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1));
    const kurt = numbers.reduce((s, x) => s + ((x - mean) / sd) ** 4, 0) / n - 3; // Excess kurtosis
    const type = kurt > 0 ? 'Leptokurtic (heavy tails)' : kurt < 0 ? 'Platykurtic (light tails)' : 'Mesokurtic (normal)';
    showResult('kurtosisResult', 'kurtosisOutput', 'kurtosisMeta', kurt.toFixed(4), type);
}

// ===== GRAPH FUNCTIONS =====

let histogramChart = null;
let scatterChart = null;
let polygonChart = null;

function generateHistogram() {
    hideErrors();
    const numbers = document.getElementById('histogramInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    if (numbers.length === 0) return showError('histogramError', 'Please enter some numbers!');
    const bins = parseInt(document.getElementById('histogramBins').value) || 5;
    if (bins < 2) return showError('histogramError', 'Please enter at least 2 bins!');
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    const binWidth = range / bins;
    const labels = [];
    const counts = [];
    for (let i = 0; i < bins; i++) {
        const lower = min + i * binWidth;
        const upper = lower + binWidth;
        labels.push(`${lower.toFixed(1)}-${upper.toFixed(1)}`);
        counts.push(numbers.filter(n => n >= lower && n < (i === bins - 1 ? upper + 0.001 : upper)).length);
    }
    document.getElementById('histogramDisplay').style.display = 'block';
    if (histogramChart) histogramChart.destroy();
    const ctx = document.getElementById('histogramCanvas').getContext('2d');
    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Frequency', data: counts, backgroundColor: 'rgba(0,255,136,0.6)', borderColor: '#00ff88', borderWidth: 2, borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#eef5ff' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
    document.getElementById('histogramStats').innerHTML = `<div class="stat-item"><span>📊 Total</span><strong>${numbers.length}</strong></div><div class="stat-item"><span>📈 Bins</span><strong>${bins}</strong></div><div class="stat-item"><span>⬆ Max</span><strong>${max.toFixed(2)}</strong></div><div class="stat-item"><span>⬇ Min</span><strong>${min.toFixed(2)}</strong></div>`;
    document.getElementById('histogramError').style.display = 'none';
}

function generateScatter() {
    hideErrors();
    const x = document.getElementById('scatterXInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    const y = document.getElementById('scatterYInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    if (x.length === 0 || y.length === 0) return showError('scatterError', 'Please enter both X and Y values!');
    if (x.length !== y.length) return showError('scatterError', 'X and Y must have the same number of values!');
    document.getElementById('scatterDisplay').style.display = 'block';
    if (scatterChart) scatterChart.destroy();
    const ctx = document.getElementById('scatterCanvas').getContext('2d');
    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [{ label: 'Data Points', data: x.map((xi, i) => ({ x: xi, y: y[i] })), backgroundColor: '#00ff88', borderColor: '#00cc77', pointRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#eef5ff' } } }, scales: { x: { ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
    const r = calculateCorrelationValue(x, y);
    document.getElementById('scatterStats').innerHTML = `<div class="stat-item"><span>📊 n</span><strong>${x.length}</strong></div><div class="stat-item"><span>📈 r</span><strong>${r.toFixed(4)}</strong></div>`;
    document.getElementById('scatterError').style.display = 'none';
}

function calculateCorrelationValue(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
    const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
    const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
    return (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
}

function generateFrequencyPolygon() {
    hideErrors();
    const numbers = document.getElementById('polygonInput').value.split(/[ ,]+/).filter(n => n !== '').map(Number);
    if (numbers.length === 0) return showError('polygonError', 'Please enter some numbers!');
    const bins = parseInt(document.getElementById('polygonBins').value) || 5;
    if (bins < 2) return showError('polygonError', 'Please enter at least 2 bins!');
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    const binWidth = range / bins;
    const midpoints = [];
    const counts = [];
    for (let i = 0; i < bins; i++) {
        const lower = min + i * binWidth;
        const upper = lower + binWidth;
        midpoints.push((lower + upper) / 2);
        counts.push(numbers.filter(n => n >= lower && n < (i === bins - 1 ? upper + 0.001 : upper)).length);
    }
    document.getElementById('polygonDisplay').style.display = 'block';
    if (polygonChart) polygonChart.destroy();
    const ctx = document.getElementById('polygonCanvas').getContext('2d');
    polygonChart = new Chart(ctx, {
        type: 'line',
        data: { labels: midpoints.map(m => m.toFixed(1)), datasets: [{ label: 'Frequency', data: counts, backgroundColor: 'rgba(0,255,136,0.1)', borderColor: '#00ff88', borderWidth: 3, fill: true, tension: 0.3, pointBackgroundColor: '#00ff88', pointRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#eef5ff' } } }, scales: { y: { beginAtZero: true, ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#8a9aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
    document.getElementById('polygonStats').innerHTML = `<div class="stat-item"><span>📊 Total</span><strong>${numbers.length}</strong></div><div class="stat-item"><span>📈 Bins</span><strong>${bins}</strong></div>`;
    document.getElementById('polygonError').style.display = 'none';
}

// ===== EXCEL EXPORT =====

function exportToExcel(section) {
    const container = document.getElementById('section-' + section);
    if (!container) return;
    const inputs = container.querySelectorAll('.glass-input');
    const data = [];
    inputs.forEach(input => {
        const values = input.value.split(/[ ,]+/).filter(n => n !== '').map(Number);
        if (values.length > 0) {
            const label = input.closest('.form-group')?.querySelector('label')?.textContent.trim().replace(/[^a-zA-Z0-9 ]/g, '') || 'Data';
            data.push({ label, values });
        }
    });
    if (data.length === 0) return alert('📊 Please enter some data first!');
    const wbData = [];
    const title = container.querySelector('.calc-title')?.textContent || 'Statistic Tools Data';
    wbData.push([title], []);
    const headers = data.map(d => d.label);
    wbData.push(headers);
    const maxLen = Math.max(...data.map(d => d.values.length));
    for (let i = 0; i < maxLen; i++) wbData.push(data.map(d => d.values[i] !== undefined ? d.values[i] : ''));
    const resultBox = container.querySelector('.result-box');
    if (resultBox && resultBox.style.display !== 'none') {
        const resultText = resultBox.querySelector('.result-value')?.textContent || '';
        if (resultText) wbData.push([], ['Result'], [resultText]);
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wbData);
    ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length, 15) }));
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics');
    XLSX.writeFile(wb, `${section}_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('✅ Excel file saved successfully!', 'success');
}

function exportGraph() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return showToast('⚠️ No graph to export!', 'error');
    const link = document.createElement('a');
    link.download = `graph_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✅ Graph saved as image!', 'success');
}

function resetGraph() {
    document.getElementById('graphLabels').value = '';
    document.getElementById('graphValues').value = '';
    document.getElementById('graphValues2').value = '';
    document.getElementById('graphLabel2').value = 'Dataset 2';
    document.getElementById('graphDisplay').style.display = 'none';
    document.getElementById('graphError').style.display = 'none';
    currentChartType = 'bar';
    document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.type === 'bar'));
    document.getElementById('doubleBarRow').style.display = 'none';
    document.getElementById('doubleBarRow').classList.remove('show');
    if (graphChartInstance) { graphChartInstance.destroy(); graphChartInstance = null; }
}

function showToast(message, type) {
    const colors = { success: '#4caf50', error: '#f44336', info: '#2196f3', warning: '#ff9800' };
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:30px;right:30px;padding:16px 28px;background:rgba(10,18,22,0.95);backdrop-filter:blur(16px);border:1px solid ${colors[type] || colors.info}44;border-radius:16px;color:#eef5ff;font-size:0.95rem;font-weight:500;z-index:9999;box-shadow:0 15px 40px rgba(0,0,0,0.5);transform:translateY(100px);opacity:0;transition:all 0.4s cubic-bezier(0.2,0.9,0.4,1);display:flex;align-items:center;gap:12px;min-width:200px;`;
    toast.innerHTML = `<span style="color:${colors[type] || colors.info}">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 50);
    setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
}

// ===== GRAPH GENERATION (Create Graph) =====

let graphChartInstance = null;
let currentChartType = 'bar';

function selectChartType(type) {
    currentChartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.type === type));
    const doubleBarRow = document.getElementById('doubleBarRow');
    if (type === 'doublebar') {
        doubleBarRow.style.display = 'grid';
        doubleBarRow.classList.add('show');
    } else {
        doubleBarRow.style.display = 'none';
        doubleBarRow.classList.remove('show');
    }
    document.getElementById('graphDisplay').style.display = 'none';
    document.getElementById('graphError').style.display = 'none';
}

function generateGraph() {
    const labelsInput = document.getElementById('graphLabels').value.trim();
    const valuesInput = document.getElementById('graphValues').value.trim();
    const values2Input = document.getElementById('graphValues2')?.value.trim() || '';
    document.getElementById('graphError').style.display = 'none';
    document.getElementById('graphDisplay').style.display = 'none';
    if (!labelsInput || !valuesInput) return showGraphError('Please enter both labels and values!');
    const labels = labelsInput.split(',').map(s => s.trim()).filter(s => s !== '');
    let values = valuesInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    let values2 = [];
    if (currentChartType === 'doublebar') {
        if (!values2Input) return showGraphError('Please enter Dataset 2 for double bar chart!');
        values2 = values2Input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (values.length !== values2.length) return showGraphError(`Dataset 1 (${values.length}) and Dataset 2 (${values2.length}) must match!`);
        if (labels.length !== values.length) return showGraphError(`Labels (${labels.length}) and values (${values.length}) must match!`);
    } else {
        if (labels.length !== values.length) return showGraphError(`Labels (${labels.length}) and values (${values.length}) must match!`);
    }
    document.getElementById('graphDisplay').style.display = 'block';
    if (graphChartInstance) { graphChartInstance.destroy(); graphChartInstance = null; }
    const ctx = document.getElementById('graphCanvas');
    const isDark = !document.body.classList.contains('light-mode');
    const colors = ['rgba(180,255,100,0.8)', 'rgba(100,200,255,0.8)', 'rgba(255,200,100,0.8)', 'rgba(255,100,150,0.8)', 'rgba(150,100,255,0.8)', 'rgba(100,255,200,0.8)', 'rgba(255,150,50,0.8)', 'rgba(50,200,100,0.8)'];
    const borderColors = colors.map(c => c.replace('0.8', '1'));
    if (currentChartType === 'doublebar') {
        const label2 = document.getElementById('graphLabel2')?.value || 'Dataset 2';
        graphChartInstance = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Dataset 1', data: values, backgroundColor: 'rgba(180,255,100,0.8)', borderColor: 'rgba(180,255,100,1)', borderWidth: 2, borderRadius: 4 }, { label: label2, data: values2, backgroundColor: 'rgba(100,200,255,0.8)', borderColor: 'rgba(100,200,255,1)', borderWidth: 2, borderRadius: 4 }] },
            options: getChartOptions(isDark)
        });
        const total = values.reduce((a, b) => a + b, 0);
        const total2 = values2.reduce((a, b) => a + b, 0);
        document.getElementById('graphStats').innerHTML = `<div class="stat-item"><span>📊 Dataset 1 Total</span><strong>${total.toFixed(2)}</strong></div><div class="stat-item"><span>📈 Dataset 1 Avg</span><strong>${(total / values.length).toFixed(2)}</strong></div><div class="stat-item"><span>📊 Dataset 2 Total</span><strong>${total2.toFixed(2)}</strong></div><div class="stat-item"><span>📈 Dataset 2 Avg</span><strong>${(total2 / values2.length).toFixed(2)}</strong></div>`;
        return;
    }
    if (currentChartType === 'boxplot') {
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        const min = sorted[0];
        const max = sorted[n - 1];
        const q1 = getPercentileExact(sorted, 0.25);
        const median = getPercentileExact(sorted, 0.50);
        const q3 = getPercentileExact(sorted, 0.75);
        graphChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
                datasets: [{ label: 'Box Plot Statistics', data: [min, q1, median, q3, max], backgroundColor: ['rgba(255,100,100,0.6)', 'rgba(180,255,100,0.6)', 'rgba(100,200,255,0.8)', 'rgba(180,255,100,0.6)', 'rgba(255,100,100,0.6)'], borderColor: ['rgba(255,100,100,1)', 'rgba(180,255,100,1)', 'rgba(100,200,255,1)', 'rgba(180,255,100,1)', 'rgba(255,100,100,1)'], borderWidth: 2, borderRadius: 4 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: isDark ? '#eef5ff' : '#1a2a1a', font: { size: 12, weight: '600' } } },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(10,18,22,0.9)' : 'rgba(255,255,255,0.9)',
                        titleColor: isDark ? '#eef5ff' : '#1a2a1a',
                        bodyColor: isDark ? '#bde5a0' : '#2a4a2a',
                        borderColor: 'rgba(180,255,100,0.3)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        callbacks: { label: function(context) { const labels = ['Minimum', 'Q1 (25th percentile)', 'Median (Q2)', 'Q3 (75th percentile)', 'Maximum']; return `${labels[context.dataIndex]}: ${context.parsed.y.toFixed(2)}`; } }
                    }
                },
                scales: { y: { beginAtZero: true, ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }, x: { ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } } }
            }
        });
        document.getElementById('graphStats').innerHTML = `<div class="stat-item"><span>📊 Min</span><strong>${min.toFixed(2)}</strong></div><div class="stat-item"><span>📈 Q1</span><strong>${q1.toFixed(2)}</strong></div><div class="stat-item"><span>📊 Median</span><strong>${median.toFixed(2)}</strong></div><div class="stat-item"><span>📈 Q3</span><strong>${q3.toFixed(2)}</strong></div><div class="stat-item"><span>📊 Max</span><strong>${max.toFixed(2)}</strong></div><div class="stat-item"><span>📐 IQR</span><strong>${(q3 - q1).toFixed(2)}</strong></div>`;
        return;
    }
    const chartConfig = { type: currentChartType, data: { labels, datasets: [{ label: 'Data', data: values, backgroundColor: colors.slice(0, values.length), borderColor: borderColors.slice(0, values.length), borderWidth: 2, borderRadius: 6 }] }, options: getChartOptions(isDark) };
    if (['pie', 'polarArea'].includes(currentChartType)) delete chartConfig.options.scales;
    graphChartInstance = new Chart(ctx, chartConfig);
    const total = values.reduce((a, b) => a + b, 0);
    document.getElementById('graphStats').innerHTML = `<div class="stat-item"><span>📊 Total</span><strong>${total.toFixed(2)}</strong></div><div class="stat-item"><span>📈 Average</span><strong>${(total / values.length).toFixed(2)}</strong></div><div class="stat-item"><span>⬆ Max</span><strong>${Math.max(...values).toFixed(2)}</strong></div><div class="stat-item"><span>⬇ Min</span><strong>${Math.min(...values).toFixed(2)}</strong></div>`;
}

function getChartOptions(isDark) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { labels: { color: isDark ? '#eef5ff' : '#1a2a1a', font: { size: 12, weight: '600' } } },
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
            y: { beginAtZero: true, ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
            x: { ticks: { color: isDark ? '#8f9bb3' : '#4a6a4a' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }
        }
    };
}

function showGraphError(message) {
    const error = document.getElementById('graphError');
    error.textContent = '⚠️ ' + message;
    error.style.display = 'block';
    document.getElementById('graphDisplay').style.display = 'none';
}

// ===== REVIEW SYSTEM =====

// ===== APPWRITE DATABASE CONFIGURATION =====
const APPWRITE_CONFIG = {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: '6a7c59fb0003fee1c61c',
    databaseId: '6a7c62ee001cdab44121',
    collectionId: 'userreview'
};

// Initialize Appwrite Client & Databases
const appwriteClient = new Appwrite.Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

const appwriteDatabases = new Appwrite.Databases(appwriteClient);


// ===== STAR RATING & APPWRITE INITIALIZATION =====
let currentRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Live Appwrite Reviews
    if (typeof fetchLiveReviews === 'function') {
        fetchLiveReviews();
    }

    // 2. Interactive Star Rating Selector
    const picker = document.getElementById('starRating');
    if (picker) {
        const stars = picker.querySelectorAll('i');

        stars.forEach(star => {
            // Click to lock in rating
            star.addEventListener('click', (e) => {
                const val = parseInt(star.getAttribute('data-value')) || 0;
                currentRating = val;
                updateStars(currentRating);
            });

            // Hover preview
            star.addEventListener('mouseover', () => {
                const val = parseInt(star.getAttribute('data-value')) || 0;
                updateStars(val);
            });
        });

        // Reset hover state back to chosen locked rating on mouse leave
        picker.addEventListener('mouseleave', () => {
            updateStars(currentRating);
        });
    }
});

// Helper function to update star visuals
function updateStars(ratingValue) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value')) || 0;
        if (starVal <= ratingValue) {
            star.className = 'fas fa-star active'; // Solid filled star
            star.style.color = '#ffc107';          // Glowing yellow
        } else {
            star.className = 'far fa-star';        // Outline star
            star.style.color = 'rgba(255, 255, 255, 0.3)';
        }
    });
}


// ===== FETCH & RENDER REVIEWS FROM APPWRITE =====
async function fetchLiveReviews() {
    const reviewsFeed = document.getElementById('reviewsList'); // Your grid/feed container
    if (!reviewsFeed) return;

    try {
        const response = await appwriteDatabases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collectionId,
            [Appwrite.Query.limit(50)]
        );

        if (!response.documents || response.documents.length === 0) {
            reviewsFeed.innerHTML = `
                <div class="glass-card review-card empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted, #8a9aaa);">No feedback submitted yet. Be the first to leave a review!</p>
                </div>
            `;
            return;
        }

        // Map documents using your exact Appwrite schema (username, review, rating)
        reviewsFeed.innerHTML = response.documents.map(doc => {
            const score = doc.rating || 5;
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= score) {
                    starsHtml += '<i class="fas fa-star" style="color: #ffc107;"></i>';
                } else {
                    starsHtml += '<i class="far fa-star" style="color: rgba(255,255,255,0.2);"></i>';
                }
            }

            return `
                <div class="glass-card review-card" style="padding: 1.25rem; border-radius: 12px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong style="color: var(--text-light, #e8edf2); font-size: 1.05rem;">${escapeHtml(doc.username || 'Anonymous User')}</strong>
                        <div>${starsHtml}</div>
                    </div>
                    <p style="color: var(--text-muted, #8a9aaa); font-size: 0.95rem; line-height: 1.5; margin: 0.5rem 0;">${escapeHtml(doc.review || '')}</p>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Appwrite: Error fetching reviews:', error);
    }
}


// ===== SUBMIT REVIEW TO APPWRITE DATABASE =====
async function submitReview() {
    const nameInput = document.getElementById('reviewName');
    const emailInput = document.getElementById('reviewEmail');
    const textInput = document.getElementById('reviewText');
const btn = document.getElementById('submitReviewBtn') || document.querySelector('.btn-submit-review');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const reviewText = textInput.value.trim();

    // Validation
    if (!name || !email || !reviewText) {
        alert('⚠️ Please fill out all required fields.');
        return;
    }
    if (currentRating === 0) {
        alert('⚠️ Please select a star rating.');
        return;
    }
if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
}

    // Payload strictly matching your Appwrite Attributes
    const payload = {
        username: name,
        email: email,
        review: reviewText,
        rating: currentRating
    };

    try {
        await appwriteDatabases.createDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collectionId,
            Appwrite.ID.unique(),
            payload
        );

        // Reset form inputs
        nameInput.value = '';
        emailInput.value = '';
        textInput.value = '';
        currentRating = 0;
        updateStars(0);

        // Reload the feed instantly from Appwrite
        await fetchLiveReviews();

        alert('✅ Thank you! Your review has been saved.');
    } catch (error) {
        console.error('Appwrite Submission Error:', error);
        alert(`⚠️ Unable to submit review: ${error.message || 'Check Appwrite permissions'}`);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    }
}

// XSS Sanitizer Helper
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}
// ===== THEME TOGGLE LOGIC =====
function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('#themeToggle i');
    
    // Toggle the class
    body.classList.toggle('light-mode');
    
    // Update Icon and LocalStorage
    if (body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        icon.style.color = '#f0c060'; // Golden yellow sun
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = ''; // Reset to default CSS color
        localStorage.setItem('theme', 'dark');
    }
}

// ===== APPLY SAVED THEME ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.querySelector('#themeToggle i');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (icon) {
            icon.className = 'fas fa-sun';
            icon.style.color = '#f0c060';
        }
    }
});
