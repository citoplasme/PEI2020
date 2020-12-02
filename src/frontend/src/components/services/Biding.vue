<template>
  <Loading v-if="!ready" :message="'service'" />
  <v-stepper v-else v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        Negotiation
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        Waiting Service
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">
        Review
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4">
        Finished
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">

          <template>
            <v-container >
                <v-timeline
                dense
                clipped
                >
                <v-timeline-item 
                    fill-dot
                    class="white--text mb-12"
                    color="blue"
                    large
                >
                    <template v-slot:icon>
                    <span>P</span>
                    </template>
                    <v-text-field
                    v-model="input"
                    hide-details
                    flat
                    label="Leave a comment..."
                    solo
                    @keydown.enter="comment"
                    >
                    <template v-slot:append>
                        <v-btn
                        class="mx-0"
                        depressed
                        @click="comment"
                        >
                        Post
                        </v-btn>
                    </template>
                    </v-text-field>
                </v-timeline-item>

                <div v-for="n in this.data.orcamento" :key=n.id>
                    <div v-if="n.user ===idLoged">
                        <v-timeline-item
                            fill-dot
                            class="mb-4"
                            color="blue"
                            icon-color="grey lighten-2"
                            large
                        >
                            <template v-slot:icon>
                                <span>P</span>
                            </template>
                            <v-row justify="space-between">
                            <v-col cols="7">
                                {{n.value}}
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                {{n.datetime}}
                            </v-col>
                            </v-row>
                        </v-timeline-item>
                    </div>
                    <div v-else>
                        <v-timeline-item
                            fill-dot
                            class="mb-4"
                            color="green"
                            icon-color="grey lighten-2"
                            large
                        >
                            <template v-slot:icon>
                                <span>E</span>
                            </template>
                            <v-row justify="space-between">
                        
                            <v-col cols="7">
                                {{n.value}}
                            </v-col>
                            <v-col
                                class="text-right"
                                cols="5"
                            >
                                {{n.datetime}}
                            </v-col>
                            </v-row>
                        </v-timeline-item>
                    </div>
                </div>

                </v-timeline>
            </v-container>
            </template>

      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12 elevation-0" color="#E3F2FD" height="200px"></v-card>

      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12 elevation-0" color="#E3F2FD" height="200px"></v-card>

        
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card class="mb-12 elevation-0" color="#E3F2FD" height="200px">Service is Finished</v-card>

      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import Loading from "@/components/generic/Loading";

export default {

    /*
    -2 - Refused
    -1 - Canceled
    0 - Generated
    1 - Negotiating
    2 - Accepted
    3 - Waiting for evaluation
    4 - Finalized
    */
  props: ["idService"],
  components: {
    Loading
  },
  data: () => ({
    e1:1,
    input: null,
    data:null,
    ready: false
  }),

  async created() {
      
      await this.getData();

      this.ready = true;
      
  },

  methods:{
      async comment() {
          var value=this.input;

          var res = await this.$request("put","/services/" + this.idService+"/bid",{
          value: this.input,
          user: this.idLoged
        })
        this.input = null

        await this.getService();
      },
      async getData(){
          let level = await this.$userLevel(this.$store.state.token)
      
            this.lvl=level;
            await this.getService();

            var res2 = await this.$request(
                        "get",
                        "/users/" + this.$store.state.token + "/token"
                    );
            this.idLoged = res2.data._id;

            console.log("id loged-"+this.idLoged)
      },
      async getService(){
          var res = await this.$request("get","/services/" + this.idService);
            this.data=res.data;
            //Vai ordenar orçamentos por data
            this.data.orcamento.sort((a, b) => (a.datetime < b.datetime) ? 1 : -1)
            //vai usar isto para escolher a tab em que esta negotiation / waiting service etc
            this.e1=res.data.status;
      }
  }
};
//PUT /v1/services/5fc7d9dd6565e154c43bf91b/bid 500 3.758 ms - 71   erro
//PUT /v1/services/5fbfe418a873e93baefa1a70/bid                     funciona este
</script>
