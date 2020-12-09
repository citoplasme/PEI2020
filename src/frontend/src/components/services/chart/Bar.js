import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      status_info: [
        {
          value: -2,
          desc: "Refused",
          backgroundColor: "#63b179"
        },
        {
          value: -1,
          desc: "Canceled",
          backgroundColor: "#aed987"
        },
        {
          value: 0,
          desc: "Generated",
          backgroundColor: "#ffff9d"
        },
        {
          value: 1,
          desc: "Negotiating",
          backgroundColor: "#fcc267"
        },
        {
          value: 2,
          desc: "Accepted",
          backgroundColor: "#ef8250"
        },
        {
          value: 3,
          desc: "Waiting for evaluation",
          backgroundColor: "#00b300"
        },
        {
          value: 4,
          desc: "Finalized",
          backgroundColor: "#00aba9"
        }
      ],
      info: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    };
  },
  async mounted() {
    this.servicesCountByStatus();
  },
  methods: {
    async servicesCountByStatus() {
      await this.$request("get", "/services/monitoring?action=1")
        .then(res => {
          var result = Object.assign([], res.data).sort(function(a, b) {
            return a._id - b._id;
          });

          result.forEach(element => {
            this.info.labels.push(
              this.status_info.find(s => s.value === element._id).desc
            );
            this.info.datasets[0].backgroundColor.push(
              this.status_info.find(s => s.value === element._id)
                .backgroundColor
            );
            this.info.datasets[0].data.push(element.numberOfServices);
          });
          this.renderChart(this.info, this.options);
        })
        .catch(err => {
          return err;
        });
    }
  }
};
