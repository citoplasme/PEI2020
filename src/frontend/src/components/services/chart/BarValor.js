import { Bar } from "vue-chartjs";
import _ from "lodash";

export default {
  extends: Bar,
  data() {
    return {
      status_info: [
        {
          value: 0,
          desc: "Sunday",
          backgroundColor: "#63b179"
        },
        {
          value: 1,
          desc: "Monday",
          backgroundColor: "#aed987"
        },
        {
          value: 2,
          desc: "Tuesday",
          backgroundColor: "#ffff9d"
        },
        {
          value: 3,
          desc: "Wednesday",
          backgroundColor: "#fcc267"
        },
        {
          value: 4,
          desc: "Thursday",
          backgroundColor: "#ef8250"
        },
        {
          value: 5,
          desc: "Friday",
          backgroundColor: "#00b300"
        },
        {
          value: 6,
          desc: "Saturday",
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
    await this.servicesPriceCount();
  },
  methods: {
    days_of_week(array) {
      try {
        let res = array.map(ser => {
          let date = new Date(ser.date);
          let o = date.getDay();
          return o;
        });
        return res;
      } catch (e) {
        return e;
      }
    },
    async servicesPriceCount() {
      await this.$request("get", "/services")
        .then(res => {
          // Ficar só com serviços já finalizados ou à espera de avaliação
          let result = res.data.filter(
            s => (s.status == 3 || s.status == 4) && s.date !== undefined
          );

          // Ficar com um array de dias da semana só
          let response = this.days_of_week(result);

          // Agrupar por ano em cada classe -> objeto chaves : valores
          // Cada chave é o dia, valor é o contador
          response = _.countBy(response);

          Object.entries(response).forEach(([key, value]) => {
            this.info.labels.push(
              this.status_info.find(s => s.value == key).desc
            );
            this.info.datasets[0].backgroundColor.push(
              this.status_info.find(s => s.value == key).backgroundColor
            );
            this.info.datasets[0].data.push(value);
          });

          this.renderChart(this.info, this.options);
        })
        .catch(err => {
          return err;
        });
    }
  }
};
