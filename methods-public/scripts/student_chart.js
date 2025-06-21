Chart.register(window['chartjs-plugin-annotation']);

let myChart;

async function getStudentPercentage() {
  const ctx = document.getElementById('myChart').getContext('2d');

  const response = await fetch('/student/attendance-summary-percentage');
  const summary = await response.json();

  const labels = summary.map(item => item.subject);
  const attendancePercentages = summary.map(item =>
    item.total === 0 ? 0 : Math.round((item.attended / item.total) * 100)
  );
  const colors = attendancePercentages.map(p => p >= 80 ? 'green' : 'red');

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Above 80',
        data: attendancePercentages,
        backgroundColor: colors,
        borderColor: 'black',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal', // Specify horizontal line
            scaleID: 'y',       // Specify which scale to use
            ymin:80,          // The value where line should appear
            borderColor: 'blue',
            borderWidth: 3,
            borderDash: [5, 5],
            label: {
              enabled: true,
              content: 'Target 80%',
              position: 'end',
              backgroundColor: 'rgba(0,0,255,0.8)',
              color: 'white',
              fontSize: 12,
              fontStyle: 'bold',
              xPadding: 6,
              yPadding: 6,
              cornerRadius: 4
            }
          }]
        },
        legend: {
      display: true,
      labels: {
        generateLabels: function (chart) {
          return [
            {
              text: 'Above 80%',
              fillStyle: 'green',
              strokeStyle: 'black',
              lineWidth: 1
            },
            {
              text: 'Below 80%',
              fillStyle: 'red',
              strokeStyle: 'black',
              lineWidth: 1
            }
          ];
        }
      }
    }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Attendance (%)'
          }
        },
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Registered Subjects'
          }
        }
      }
      
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getStudentPercentage();
  window.addEventListener('resize', () => {
    if (myChart) myChart.resize();
  });
});
