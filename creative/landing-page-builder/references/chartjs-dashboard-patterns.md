# Chart.js Dashboard Patterns

Reference patterns for building data dashboard UIs with Chart.js + Alpine.js.

## Line Chart with Dual Y-Axis

```js
const ctx = document.getElementById('chart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 280);
gradient.addColorStop(0, 'rgba(108,92,231,0.3)');
gradient.addColorStop(1, 'rgba(108,92,231,0)');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [
      {
        label: 'Spend ($)',
        data: spendData,
        borderColor: '#6c5ce7',
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,           // Hide points for clean look
        pointHoverRadius: 6,      // Show on hover
        pointHoverBackgroundColor: '#6c5ce7',
        yAxisID: 'y',
      },
      {
        label: 'Tokens (M)',
        data: tokenData,
        borderColor: '#00d2d3',
        // Different gradient for second dataset
        fill: true, tension: 0.4, borderWidth: 2,
        pointRadius: 0, pointHoverRadius: 6,
        yAxisID: 'y1',
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },  // Use custom legend in HTML
      tooltip: {
        backgroundColor: '#1a1a24',
        titleColor: '#e8e8f0',
        bodyColor: '#8888a0',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            if (ctx.datasetIndex === 0) return ' $' + ctx.parsed.y.toFixed(2);
            return ' ' + ctx.parsed.y.toFixed(1) + 'M tokens';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(42,42,58,0.5)', drawBorder: false },
        ticks: { color: '#555568', maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        position: 'left',
        grid: { color: 'rgba(42,42,58,0.3)', drawBorder: false },
        ticks: { color: '#8888a0', callback: v => '$' + v.toFixed(0) },
      },
      y1: {
        position: 'right',
        grid: { display: false },
        ticks: { color: '#00d2d3', callback: v => v.toFixed(0) + 'M' },
      }
    }
  }
});
```

## Doughnut Chart

```js
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: modelNames,
    datasets: [{
      data: modelSpends,
      backgroundColor: modelColors,  // Array of hex colors
      borderColor: '#13131a',        // Match surface bg
      borderWidth: 3,
      hoverOffset: 8,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#8888a0',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        }
      },
      tooltip: {
        // Same dark tooltip styling as line chart
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ' $' + ctx.parsed.toFixed(2) + ' (' + pct + '%)';
          }
        }
      }
    }
  }
});
```

## Heatmap Grid Pattern

```html
<!-- 7-column grid for daily heatmap -->
<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:8px;">
  <template x-for="day in dailyData" :key="day.date">
    <div class="day-cell tooltip"
         :data-tip="day.date + ': $' + day.spend.toFixed(2)"
         :style="'background:' + getHeatColor(day.spend)">
      <span x-text="day.label" style="font-size:0.65rem"></span>
      <span x-text="'$' + day.spend.toFixed(0)"
            style="font-family:JetBrains Mono,monospace"></span>
    </div>
  </template>
</div>

<script>
function getHeatColor(spend) {
  const max = Math.max(...this.dailyData.map(d => d.spend));
  const intensity = spend / max;
  if (intensity < 0.25) return 'rgba(108,92,231,0.08)';
  if (intensity < 0.5) return 'rgba(108,92,231,0.2)';
  if (intensity < 0.75) return 'rgba(108,92,231,0.4)';
  return 'rgba(108,92,231,0.7)';
}
</script>
```

## Stat Card with Trend Indicator

```html
<div class="stat-card" style="position:relative;overflow:hidden">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-1)"></div>
  <div style="font-size:0.8rem;color:var(--text-muted)">Total Spend</div>
  <div style="font-size:2rem;font-weight:800;font-family:'JetBrains Mono'" 
       x-text="'$' + totalSpend.toFixed(2)"></div>
  <div class="stat-change up" x-show="change > 0">
    <span class="material-icons-outlined">trending_up</span>
    <span x-text="'+' + change.toFixed(1) + '% vs prev'"></span>
  </div>
</div>
```

## Date Range Selector (Alpine.js)

```html
<div class="date-range" style="display:flex;gap:4px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:4px">
  <button class="date-btn" :class="{ active: range === 1 }" @click="setRange(1)">1D</button>
  <button class="date-btn" :class="{ active: range === 7 }" @click="setRange(7)">7D</button>
  <button class="date-btn" :class="{ active: range === 30 }" @click="setRange(30)">30D</button>
</div>

<script>
// In Alpine data:
setRange(days) {
  this.range = days;
  // Update chart data
  this.chart.data.labels = this.dailyData.map(d => d.date);
  this.chart.data.datasets[0].data = this.dailyData.map(d => d.spend);
  this.chart.update();
}
</script>
```

## Mock Data Generation

```js
// Generate realistic-looking mock data for 30 days
function generateDailyData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 2.5 + Math.random() * 8;        // Base daily spend
    const spike = Math.random() > 0.85 ? Math.random() * 15 : 0;  // Occasional spikes
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      label: d.getDate().toString(),
      spend: base + spike,
      tokens: Math.floor((base + spike) * 120000 + Math.random() * 500000),
    });
  }
  return data;
}
```

## Dark Theme Tooltip Config

Standard dark tooltip for all Chart.js charts:

```js
tooltip: {
  backgroundColor: '#1a1a24',
  titleColor: '#e8e8f0',
  bodyColor: '#8888a0',
  borderColor: '#2a2a3a',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  titleFont: { weight: 600 },
}
```
