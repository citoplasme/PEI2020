import { Bar } from "vue-chartjs";
import _ from "lodash";

export default {
  props: ["type"],
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
      days_of_week_info: [
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
      months_info: [
        {
          value: 1,
          desc: "January",
          backgroundColor: "#00aba9"
        },
        {
          value: 2,
          desc: "February",
          backgroundColor: "#00aba9"
        },
        {
          value: 3,
          desc: "March",
          backgroundColor: "#00aba9"
        },
        {
          value: 4,
          desc: "April",
          backgroundColor: "#00aba9"
        },
        {
          value: 5,
          desc: "May",
          backgroundColor: "#00aba9"
        },
        {
          value: 6,
          desc: "June",
          backgroundColor: "#00aba9"
        },
        {
          value: 7,
          desc: "July",
          backgroundColor: "#00aba9"
        },
        {
          value: 8,
          desc: "August",
          backgroundColor: "#00aba9"
        },
        {
          value: 9,
          desc: "September",
          backgroundColor: "#00aba9"
        },
        {
          value: 10,
          desc: "October",
          backgroundColor: "#00aba9"
        },
        {
          value: 11,
          desc: "November",
          backgroundColor: "#00aba9"
        },
        {
          value: 12,
          desc: "December",
          backgroundColor: "#00aba9"
        }
      ] /*,
      months_info: [
        {
          value: 1,
          desc: "January",
          backgroundColor: "#63b179"
        },
        {
          value: 2,
          desc: "February",
          backgroundColor: "#aed987"
        },
        {
          value: 3,
          desc: "March",
          backgroundColor: "#ffff9d"
        },
        {
          value: 4,
          desc: "April",
          backgroundColor: "#fcc267"
        },
        {
          value: 5,
          desc: "May",
          backgroundColor: "#ef8250"
        },
        {
          value: 6,
          desc: "June",
          backgroundColor: "#00b300"
        },
        {
          value: 7,
          desc: "July",
          backgroundColor: "#00aba9"
        },
        {
            value: 8,
            desc: "August",
            backgroundColor: "#00aba9"
          },
          {
            value: 9,
            desc: "Septmber",
            backgroundColor: "#00aba9"
          },
          {
            value: 10,
            desc: "October",
            backgroundColor: "#00aba9"
          },
          {
            value: 11,
            desc: "November",
            backgroundColor: "#00aba9"
          },
          {
            value: 12,
            desc: "December",
            backgroundColor: "#00aba9"
          }
        ]*/,
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
    this.serviceByStatus();
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
    months(array) {
      try {
        let res = array.map(ser => {
          let date = new Date(ser.date);
          let o = date.getMonth();
          return o;
        });
        return res;
      } catch (e) {
        return e;
      }
    },
    years(array) {
      try {
        let res = array.map(ser => {
          let date = new Date(ser.date);
          let o = date.getUTCFullYear();
          return o;
        });
        return res;
      } catch (e) {
        return e;
      }
    },
    async serviceByStatus() {
      var res = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );

      var id = res.data._id;

      await this.$request(
        "get",
        "/services/monitoringByUser?idUser=" + id + "&action=1"
      )
        .then(result => {
          let response =
            this.type == "days_of_week"
              ? this.days_of_week(result.data)
              : this.type == "months"
              ? this.months(result.data)
              : this.years(result.data);
          response = _.countBy(response);

          Object.entries(response).forEach(([key, value]) => {
            if (this.type == "days_of_week") {
              this.info.labels.push(
                this.days_of_week_info.find(s => s.value == key).desc
              );
              this.info.datasets[0].backgroundColor.push(
                this.days_of_week_info.find(s => s.value == key).backgroundColor
              );
            } else if (this.type == "months") {
              this.info.labels.push(
                this.months_info.find(s => s.value == key).desc
              );
              this.info.datasets[0].backgroundColor.push(
                this.months_info.find(s => s.value == key).backgroundColor
              );
            } else {
              this.info.labels.push(key);
              this.info.datasets[0].backgroundColor.push(
                "#" +
                  Math.random()
                    .toString(16)
                    .substr(-6)
              );
            }
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
