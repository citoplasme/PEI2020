import { Bar } from "vue-chartjs";
import _ from "lodash";

export default {
  props: ["type"],
  extends: Bar,
  data() {
    return {
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
    await this.infoByCollection();
  },
  methods: {
    async infoByCollection() {
      let collection_info = await this.$request("get", "/" + this.type);
      let action = this.type == "categories" ? "4" : "5";

      await this.$request("get", "/services/monitoring?action=" + action).then(
        res => {
          res.data.forEach(element => {
            let found_element = collection_info.data.find(
              c => c._id === element._id
            );

            if(found_element.name !== undefined){
              this.info.labels.push(found_element.name);
              this.info.datasets[0].backgroundColor.push(
                "#" +
                  Math.random()
                    .toString(16)
                    .substr(-6)
              );
              this.info.datasets[0].data.push(element.nUsers);
            }
          });
          this.renderChart(this.info, this.options);
        }
      );
    }
  }
};
