import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      contador: [0, 0, 0, 0, 0, 0, 0],
      resultsval: [],
      status_info: [
        {
          value: [0, 25],
          desc: "[0-25]",
          backgroundColor: "#63b179"
        },
        {
          value: [26, 50],
          desc: "[26-50]",
          backgroundColor: "#aed987"
        },
        {
          value: [51, 100],
          desc: "[51-100]",
          backgroundColor: "#ffff9d"
        },
        {
          value: [101, 250],
          desc: "[101-250]",
          backgroundColor: "#fcc267"
        },
        {
          value: [251, 500],
          desc: "[251-500]",
          backgroundColor: "#ef8250"
        },
        {
          value: [501, 1000],
          desc: "[501-1000]",
          backgroundColor: "#00b300"
        },
        {
          value: [1001, 9999999999],
          desc: "[>1000]",
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
  mounted() {
    this.servicesPriceCount();
  },
  methods: {
    async servicesPriceCount() {
      await this.$request("get", "/services")
        .then(res => {
          var result = Object.assign([], res.data)
            .sort(function(a, b) {
              return a._id - b._id;
            })
            .filter(function(a) {
              if (a.status >= 2) return a;
            });
          this.resultsval = result;
          result.forEach(element => {
            var preco = element.orcamento[element.orcamento.length - 1].value;
            if (isNaN(preco)) {
              preco = preco.replace(/\D/g, "");
            }
            var descricao = this.status_info.find(
              (s => s.value[0] <= preco) && (s2 => s2.value[1] >= preco)
            ).desc;
            var cor = this.status_info.find(
              (s => s.value[0] <= preco) && (s2 => s2.value[1] >= preco)
            ).backgroundColor;
            if (!this.info.labels.includes(descricao)) {
              this.info.labels.push(descricao);
              this.info.datasets[0].backgroundColor.push(cor);
            }
            if (preco <= 25) {
              this.contador[0] = this.contador[0] + 1;
            } else if (preco <= 50) {
              this.contador[1] = this.contador[1] + 1;
            } else if (preco <= 100) {
              this.contador[2] = this.contador[2] + 1;
            } else if (preco <= 250) {
              this.contador[3] = this.contador[3] + 1;
            } else if (preco <= 500) {
              this.contador[4] = this.contador[4] + 1;
            } else if (preco <= 1000) {
              this.contador[5] = this.contador[5] + 1;
            } else {
              this.contador[6] = this.contador[6] + 1;
            }
          });
          this.info.datasets[0].data = this.contador.filter(function(a) {
            return a > 0;
          });
          this.renderChart(this.info, this.options);
        })
        .catch(err => {
          return err;
        });
    }
  }
};
