
// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active classes
            navLinks.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            // Add active class
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // File Upload Logic
    const fileInput = document.getElementById('csvFile');
    const runBtn = document.getElementById('runAnalysisBtn');

    let rawData = [];
    let computedData = [];

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const text = event.target.result;
            rawData = parseCSV(text);
            renderTable(rawData, 'rawDataBody');
            document.getElementById('upload-status').innerText = `Loaded ${rawData.length} rows.`;
        };
        reader.readAsText(file);
    });

    // Run Analysis
    runBtn.addEventListener('click', () => {
        if (rawData.length === 0) {
            showToast("Please upload data first.", "error");
            return;
        }

        // Compute Effect Sizes
        computedData = rawData.map((row, index) => {
            const es = Stats.computeES(row.ConversionType, row);
            return {
                ...row,
                yi: es.yi,
                vi: es.vi,
                Study: row.Study || `Study_${index + 1}`
            };
        });

        // Display Computed Data
        renderTable(computedData, 'computedDataBody', true);

        // Run Meta-Analysis
        const metaResults = Stats.runMetaAnalysis(computedData);

        if (metaResults) {
            renderMetaSummary(metaResults);
            renderPlots(metaResults);
            // Switch to analysis tab
            document.querySelector('[data-target="analysis"]').click();
            showToast("Meta-analysis completed successfully!", "success");
        } else {
            showToast("Analysis failed. Check your data for valid Effect Sizes.", "error");
        }
    });

    // Sample Data Load
    document.getElementById('loadSampleBtn').addEventListener('click', () => {
        const sampleText = `Study,ConversionType,grp1m,grp1se,grp1n,grp2m,grp2se,grp2n,t,effect_size,p,N
Study A,Mean & SE,10,2,50,12,2.5,50,,,,
Study B,Mean & SE,15,3,40,14,2.8,45,,,,
Study C,TwoSample_t,,,,,,,2.5,,,
Study D,p_to_SE,,,,,,,,,0.5,0.05,100`;
        rawData = parseCSV(sampleText);
        renderTable(rawData, 'rawDataBody');
        document.getElementById('upload-status').innerText = "Sample data loaded.";
        showToast("Sample data loaded.", "success");
    });
});

// CSV Parser Helper
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => {
            let val = values[i] ? values[i].trim() : "";
            obj[h] = val;
        });
        return obj;
    });
}

// Security: Simple HTML sanitizer
function sanitizeHTML(str) {
    if (!str) return "";
    const temp = document.createElement('div');
    temp.textContent = String(str);
    return temp.innerHTML;
}

// Table Renderer
function renderTable(data, elementId, showES = false) {
    const tbody = document.getElementById(elementId);
    tbody.innerHTML = '';

    // Limit preview to 10 rows
    data.slice(0, 10).forEach(row => {
        const tr = document.createElement('tr');
        if (!showES) {
            tr.innerHTML = `<td>${sanitizeHTML(row.Study)}</td>
                            <td>${sanitizeHTML(row.ConversionType)}</td>
                            <td>${sanitizeHTML(row.grp1m || '-')}</td>
                            <td>${sanitizeHTML(row.grp1n || '-')}</td>`;
        } else {
            tr.innerHTML = `<td>${sanitizeHTML(row.Study)}</td>
                             <td>${showES && row.yi ? row.yi.toFixed(3) : 'NA'}</td>
                             <td>${showES && row.vi ? row.vi.toFixed(3) : 'NA'}</td>`;
        }
        tbody.appendChild(tr);
    });
}

function renderMetaSummary(res) {
    const html = `
        <div class="summary-card">
            <h3>Random Effects Model (DerSimonian-Laird)</h3>
            <p><strong>k (studies):</strong> ${res.k}</p>
            <p><strong>Estimate (Pooled ES):</strong> ${res.estimate.toFixed(4)}</p>
            <p><strong>SE:</strong> ${res.se.toFixed(4)}</p>
            <p><strong>95% CI:</strong> [${res.ci_lb.toFixed(4)}, ${res.ci_ub.toFixed(4)}]</p>
            <p><strong>Z-value:</strong> ${res.z.toFixed(4)} (p = ${res.p.toFixed(4)})</p>
            <hr>
            <p><strong>Heterogeneity:</strong></p>
            <p><strong>Q:</strong> ${res.Q.toFixed(4)} (p = ${res.Q_p.toFixed(4)})</p>
            <p><strong>I²:</strong> ${res.I2.toFixed(2)}%</p>
            <p><strong>Tau²:</strong> ${res.tau2.toFixed(4)}</p>
        </div>
    `;
    document.getElementById('meta-results').innerHTML = html;
}

function renderPlots(res) {
    const ctxForest = document.getElementById('forestChart').getContext('2d');
    Plots.renderForest(ctxForest, res);
}

// Toast Notification
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // Remove after animation (3s total: 0.3s slide + 2.2s wait + 0.5s fade)
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 3000);
}
