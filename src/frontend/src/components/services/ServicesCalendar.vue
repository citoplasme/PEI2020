<template>
  <!--Loading v-if="!ready" :message="'the services'" /-->
  <!--div v-else-if="calendar_view"-->
  <div v-if="calendar_view">
    <div align="center">
      <v-icon color="red">format_paint</v-icon> - Canceled
      <v-icon color="#cc9900">format_paint</v-icon> - Negotiating
      <v-icon color="#cccc00">format_paint</v-icon> - Waiting Service
      <v-icon color="green">format_paint</v-icon> - Waiting for evaluation
      <v-icon color="blue">format_paint</v-icon> - Finalized
    </div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>
                chevron_left
              </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>
                chevron_right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar" id="changeTitle">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi_menu_down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="go(selectedEvent.id)">
                  <v-icon>attach_money</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-tooltip bottom right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="calendar_view = false">
              <v-icon color="primary">list</v-icon>
            </v-btn>
          </template>
          <span>List View</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="calendar_view = true">
              <v-icon color="primary">calendar_today</v-icon>
            </v-btn>
          </template>
          <span>Calendar View</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
  <div v-else-if="!calendar_view">
    <v-card class="ma-4">
      <v-card-title>
        <h1>Services</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="services"
        :search="search"
        class="elevation-1"
        footer-props.items-per-page-options="[10, 20, 50]"
        footer-props.items-per-page-text="Show"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            No results were found for "{{ search }}" .
          </v-alert>
        </template>

        <template v-slot:item="props">
          <tr @click="go_single(props.item._id)">
            <td class="subheading">{{ props.item.client }}</td>
            <td class="subheading">{{ props.item.service_provider }}</td>
            <td class="subheading">
              <v-chip :color="getColor(props.item.status)" dark>
                {{ number_to_status(props.item.status) }}
              </v-chip>
            </td>
            <td class="subheading">{{ props.item.date }}</td>
            <td class="subheading">{{ props.item.hour }}</td>
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="go_single(props.item._id)">
                    <v-icon medium color="gray">search</v-icon>
                  </v-btn>
                </template>
                <span>See details</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-row>
      <v-col class="text-right">
        <v-tooltip bottom right>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="calendar_view = false">
              <v-icon color="primary">list</v-icon>
            </v-btn>
          </template>
          <span>List View</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="calendar_view = true">
              <v-icon color="primary">calendar_today</v-icon>
            </v-btn>
          </template>
          <span>Calendar View</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Loading from "@/components/generic/Loading";
export default {
  components: {
    //Loading
  },
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2", // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false,
    calendar_view: true,
    ready: false,
    services: [],
    search: "",
    headers: [
      {
        text: "Client",
        sortable: true,
        value: "client",
        class: "title"
      },
      {
        text: "Service Provider",
        sortable: true,
        value: "service_provider",
        class: "title"
      },
      {
        text: "Status",
        sortable: true,
        value: "status",
        class: "title"
      },
      {
        text: "Date",
        sortable: true,
        value: "date",
        class: "title"
      },
      {
        text: "Hour",
        sortable: true,
        value: "hour",
        class: "title"
      },
      {
        text: "Operations",
        value: "ops"
      }
    ]
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    this.getEvents();
    //this.ready = true;
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;
      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);
      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  methods: {
    number_to_status(number) {
      if (number == -2) return "Negotiation Failed";
      else if (number == -1) return "Canceled";
      else if (number == 0) return "Generated";
      else if (number == 1) return "Negotiating";
      else if (number == 2) return "Accepted";
      else if (number == 3) return "Waiting Evaluation";
      else if (number == 4) return "Finalized";
      else return "";
    },
    getColor(status) {
      var color;
      switch (status) {
        case -2:
          color = "red darken-4";
          break;
        case -1:
          color = "red";
          break;
        case 0:
          color = "purple darken-3";
          break;
        case 1:
          color = "#cc9900";
          break;
        case 2:
          color = "#cccc00";
          break;
        case 3:
          color = "green";
          break;
        case -4:
          color = "blue";
          break;
        default:
          color = "black";
          break;
      }
      return color;
    },
    go(id) {
      var url = "/services/biding/" + id;
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    go_single(id) {
      var url = "/services/" + id;
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async getEvents() {
      //Vai buscar o id do utilizador/provider
      var res = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );
      var id = res.data._id;

      //Vai buscar todos os serviços em que o user/provider esteja como cliente ou prestador
      var snapshot = await this.$request("get", "/services");

      this.services = snapshot.data;

      var events = [];
      snapshot.data.forEach(async element => {
        //Vai buscar o nome da empresa
        var empresa = await this.$request(
          "get",
          "/users/service_providers/" + element.service_provider
        );

        //Escolher cor
        //-2 - Refused                    red
        //-1 - Canceled                   red
        //0 - Generated
        //1 - Negotiating                 #cc9900
        //2 - Accepted                    #cccc00
        //3 - Waiting for evaluation      green
        //4 - Finalized                   blue
        var color;
        switch (element.status) {
          case -2:
            color = "red";
            break;
          case -1:
            color = "red";
            break;
          case 1:
            color = "#cc9900";
            break;
          case 2:
            color = "#cccc00";
            break;
          case 3:
            color = "green";
            break;
          case -4:
            color = "blue";
            break;

          default:
            color = "black";
            break;
        }
        var x = {
          //depois temos de por isto sem ser hardcoded
          id: element._id,
          name: empresa.data.name,
          details: element.desc,
          start: element.date + "T" + element.hour + ":00",
          end: element.date,
          color: color
        };
        events.push(x);
      });

      this.events = events;
      this.ready = true;
    },
    setDialogDate({ date }) {
      this.dialogDate = true;
      this.focus = date;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async addEvent() {
      if (this.name && this.start && this.end) {
        await db.collection("calEvent").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        });
        this.getEvents();
        (this.name = ""),
          (this.details = ""),
          (this.start = ""),
          (this.end = ""),
          (this.color = "");
      } else {
        alert("You must enter event name, start, and end time");
      }
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    async updateEvent(ev) {
      await db
        .collection("calEvent")
        .doc(this.currentlyEditing)
        .update({
          details: ev.details
        });
      (this.selectedOpen = false), (this.currentlyEditing = null);
    },
    async deleteEvent(ev) {
      await db
        .collection("calEvent")
        .doc(ev)
        .delete();
      (this.selectedOpen = false), this.getEvents();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      var year = start.date.split("-")[0];
      var month = start.date.split("-")[1];

      const mNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      this.$refs.calendar.title = mNames[month - 1] + ", " + year;

      //forca o texto a mudar
      var x = document.getElementById("changeTitle");
      if (x != null) x.innerHTML = mNames[month - 1] + ", " + year;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
