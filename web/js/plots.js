
// Plots.js - Visualization using Chart.js

const Plots = {
    renderForest: function (ctx, metaRes) {
        // Prepare Data
        const studies = metaRes.studies;

        // Error Bars Data Structure
        const labels = studies.map(s => s.Study);

        // For Forest Plots, we usually map Study on Y axis and Effect Size on X.
        // Chart.js Scatter can do this.

        const dataPoints = studies.map((s, i) => {
            return {
                x: s.yi,
                y: i, // Study index
                v: s.vi, // store variance for reference
                se: Math.sqrt(s.vi),
                study: s.Study
            };
        });

        const pooledData = {
            x: metaRes.estimate,
            y: -1, // Below the studies
            xMin: metaRes.ci_lb,
            xMax: metaRes.ci_ub
        };

        // We need a plugin or custom draw for error bars in Chart.js generally,
        // but let's try a floating bar hack or simple scatter with custom drawing.
        // Using a Scatter chart where we draw lines for CI.

        // Destroy old chart if exists (assuming simple global for demo, robust apps track instances)
        if (window.currentForestChart) {
            window.currentForestChart.destroy();
        }

        window.currentForestChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Studies',
                        data: dataPoints,
                        backgroundColor: '#2c3e50',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Pooled Estimate',
                        data: [{ x: pooledData.x, y: pooledData.y }],
                        backgroundColor: '#e74c3c',
                        pointStyle: 'rectRot',
                        pointRadius: 10
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        title: { display: true, text: 'Effect Size (Standardized Mean Difference)' },
                        grid: { display: true }
                    },
                    y: {
                        type: 'linear', // Hack mapping index to Y
                        title: { display: true, text: 'Study' },
                        min: -2,
                        max: studies.length,
                        ticks: {
                            callback: function (value) {
                                if (value === -1) return "Pooled";
                                return labels[value] || "";
                            },
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const p = context.raw;
                                if (p.y === -1) return `Pooled: ${p.x.toFixed(2)} [${pooledData.xMin.toFixed(2)}, ${pooledData.xMax.toFixed(2)}]`;
                                return `${p.study}: ${p.x.toFixed(2)} (SE: ${p.se.toFixed(2)})`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                xMin: 0,
                                xMax: 0,
                                borderColor: 'black',
                                borderWidth: 1,
                                borderDash: [2, 2]
                            }
                            // Note: Drawing proper CIs requires custom plugin or annotation loop
                        }
                    }
                }
            },
            plugins: [{
                id: 'errorBars',
                afterDatasetsDraw(chart, args, options) {
                    const { ctx } = chart;

                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);

                        meta.data.forEach((element, index) => {
                            const d = dataset.data[index];
                            if (!d) return;

                            let xCenter = element.x;
                            let yCenter = element.y;
                            let width;

                            // Calculate CI width in pixels
                            if (i === 0) { // Studies
                                const ci_lower = d.x - 1.96 * d.se;
                                const ci_upper = d.x + 1.96 * d.se;
                                const x1 = chart.scales.x.getPixelForValue(ci_lower);
                                const x2 = chart.scales.x.getPixelForValue(ci_upper);

                                ctx.save();
                                ctx.beginPath();
                                ctx.strokeStyle = '#2c3e50';
                                ctx.lineWidth = 2;
                                ctx.moveTo(x1, yCenter);
                                ctx.lineTo(x2, yCenter);
                                ctx.stroke();
                                // End caps
                                ctx.beginPath();
                                ctx.moveTo(x1, yCenter - 5);
                                ctx.lineTo(x1, yCenter + 5);
                                ctx.moveTo(x2, yCenter - 5);
                                ctx.lineTo(x2, yCenter + 5);
                                ctx.stroke();
                                ctx.restore();

                            } else { // Pooled (Diamond shape approx)
                                const ci_lower = pooledData.xMin;
                                const ci_upper = pooledData.xMax;
                                const x1 = chart.scales.x.getPixelForValue(ci_lower);
                                const x2 = chart.scales.x.getPixelForValue(ci_upper);

                                ctx.save();
                                ctx.beginPath();
                                ctx.strokeStyle = '#e74c3c';
                                ctx.lineWidth = 2;
                                ctx.moveTo(x1, yCenter);
                                ctx.lineTo(x2, yCenter);
                                ctx.stroke();
                                ctx.restore();
                            }
                        });
                    });
                }
            }]
        });
    }
};
