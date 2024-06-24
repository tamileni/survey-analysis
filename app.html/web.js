function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csvData = event.target.result;
            const data = csvToArray(csvData);
            displayAnalysis(data);
        };
        reader.readAsText(file);
    }
}

function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    return arr;
}

function displayAnalysis(data) {
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('analysis-section').style.display = 'block';

    const summary = calculateSummary(data);
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = generateSummaryHtml(summary);

    const chartsDiv = document.getElementById('charts');
    chartsDiv.innerHTML = generateChartsHtml(data);
    drawCharts(data);
}

function calculateSummary(data) {
    const summary = {};
    data.forEach(row => {
        for (const key in row) {
            if (!summary[key]) {
                summary[key] = [];
            }
            summary[key].push(row[key]);
        }
    });
    return summary;
}

function generateSummaryHtml(summary) {
    let html = '<h3>Summary</h3>';
    for (const key in summary) {
        const values = summary[key];
        const uniqueValues = [...new Set(values)];
        html += `<p><strong>${key}:</strong> ${uniqueValues.join(', ')}</p>`;
    }
    return html;
}

function generateChartsHtml(data) {
    let html = '';
    for (const key in data[0]) {
        html += `<div class="chart-container"><canvas id="chart_${key}"></canvas></div>`;
    }
    return html;
}

function drawCharts(data) {
    for (const key in data[0]) {
        const ctx = document.getElementById(`chart_${key}`).getContext('2d');
        const values = data.map(row => row[key]);
        const uniqueValues = [...new Set(values)];
        const counts = uniqueValues.map(value => values.filter(v => v === value).length);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: uniqueValues,
                datasets: [{
                    label: key,
                    data: counts,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
