<template>
  <Loading v-if="!ready" :message="'your profile'" />
  <v-card v-else class="mx-auto" max-width="1000" tile>
    <v-row class="mx-auto">
      <v-list-item>
        <v-hover v-slot:default="{ hover }">
          <v-card class="mx-auto rounded-circle elevation-0">
            <v-list-item-avatar size="250">
              <v-img
                v-if="
                  user.photo !== undefined &&
                    user.photo.content !== undefined &&
                    user.photo.extension !== undefined
                "
                :src="
                  `data:image/${user.photo.extension};base64,${
                    user.photo.content
                  }`
                "
                style="width: 100%; height: 100%"
              />
              <v-img
                v-else
                style="width: 100%; height: 100%"
                :src="require('@/assets/default_user.png')"
              />
            </v-list-item-avatar>
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--text"
                style="height: 100%"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="editar_imagem(user)">
                      <v-icon large color="black">edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit image</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="
                    user.photo !== undefined &&
                      user.photo.content !== undefined &&
                      user.photo.extension !== undefined
                  "
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="remover_imagem(user)">
                      <v-icon large color="black">clear</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove image</span>
                </v-tooltip>
              </div>
            </v-expand-transition>
          </v-card>
        </v-hover>
        <v-list-item-content>
          <v-list-item-title class="title">{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-row>
    <v-list>
      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.categorias &&
            user.categorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Categories</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.categorias" :key="item._id">
                <span class="fakea" @click="go(`/categories/${item._id}`)">{{
                  item.name
                }}</span>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.subcategorias &&
            user.subcategorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Specializations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.subcategorias" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?subcategorias=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.locations &&
            user.locations.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Locations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.locations" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?locations=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Karma</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.karma }}</p>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Completed Services</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.servicos_realizados }}</p>
          </div>
        </v-col>
      </v-list-item>
    </v-list>

    <v-col class="text-right">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="editar(user)" color="primary" class="mr-1">
            <v-icon medium>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit profile</span>
      </v-tooltip>

      <v-tooltip bottom v-if="user.level >= 3 && user.level <= 4">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="editar_categories(user)"
            color="primary"
            class="mr-1 ml-1"
          >
            <v-icon medium>domain</v-icon>
          </v-btn>
        </template>
        <span>Edit categories</span>
      </v-tooltip>

      <v-tooltip bottom v-if="user.level >= 3 && user.level <= 4">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="editar_specializations(user)"
            color="primary"
            class="mr-1 ml-1"
          >
            <v-icon medium>construction</v-icon>
          </v-btn>
        </template>
        <span>Edit specializations</span>
      </v-tooltip>

      <v-tooltip bottom v-if="user.level >= 3 && user.level <= 4">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="editar_locations(user)"
            color="primary"
            class="mr-1 ml-1"
          >
            <v-icon medium>location_on</v-icon>
          </v-btn>
        </template>
        <span>Edit locations</span>
      </v-tooltip>

      <v-tooltip bottom v-if="user.level >= 3 && user.level <= 4">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="getPremium(user)"
            color="primary"
            class="ml-1"
          >
            <v-icon medium>payment</v-icon>
          </v-btn>
        </template>
        <span>Get Karma</span>
      </v-tooltip>
    </v-col>

    <v-dialog v-model="dialog_premium" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Add Karma to your account</span>
        </v-card-title>
        <v-card-text>
          Gib money to get karma boost
        </v-card-text>
        <v-row>
          <v-col>
            <v-list>
              <template v-for="(product, index) in this.products">
                <v-list-item v-bind:key="product.product_id">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="product.description"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-btn @click="addtoCart(product)" color="primary">
                    Add
                  </v-btn>
                </v-list-item>
                <v-divider
                  v-if="index + 1 < products.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
          </v-col>
          <v-col>
            <v-card-text>
              <h1>CART</h1>
              <h2 v-if="cart.length == 0">Empty Cart</h2>
              <template v-else v-for="(product, index) in this.cart">
                <v-list-item v-bind:key="index">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="product.description"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn @click="clearCart()" color="primary">CLEAR CART</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="cart.length > 0" color="primary" text @click="payMethod">
            Proceed to Payment
          </v-btn>
          <v-btn color="red" text @click="dialog_premium = false">Cancel</v-btn>
        </v-card-actions>
        <div v-if="cart.length > 0" ref="paypal"></div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Profile</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="person"
                    v-model="editedItem.name"
                    label="Name"
                    :rules="regraNome"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="email"
                    v-model="editedItem.email"
                    label="Email"
                    :rules="regraEmail"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="guardar">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_image" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Image</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form_image" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-file-input
                    v-model="ficheiro"
                    placeholder="Select the file"
                    show-size
                    clearable
                    single-line
                    accept="image/*"
                    solo
                    :rules="regraImagem"
                    required
                  ></v-file-input>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_image = false">Cancel</v-btn>
          <v-btn color="primary" text @click="guardar_image">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_categories" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Categories</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form_categories" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    prepend-icon="domain"
                    v-model="searchString"
                    :items="newcategories"
                    auto-select-first
                    clearable
                    dense
                    chips
                    rounded
                    deletable-chips
                    label="Categories"
                    solo
                    multiple
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_categories = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" text @click="guardar_categories">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_specializations" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Specializations</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form_specializations" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    prepend-icon="domain"
                    v-model="searchString2"
                    :items="newspecializations"
                    auto-select-first
                    clearable
                    dense
                    chips
                    rounded
                    deletable-chips
                    multiple
                    label="Specializations"
                    solo
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_specializations = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" text @click="guardar_specializations"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_locations" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Locations</span>
        </v-card-title>
        <v-card-text>
          <Loading v-if="!locs_ready" :message="'locations'" />
          <v-form ref="form_locations" lazy-validation v-else>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    prepend-icon="flag"
                    v-model="searchString4"
                    :items="newcountries"
                    auto-select-first
                    clearable
                    dense
                    chips
                    rounded
                    deletable-chips
                    multiple
                    label="Countries"
                    solo
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    prepend-icon="location_on"
                    v-model="searchString3"
                    :items="newlocations"
                    auto-select-first
                    clearable
                    dense
                    chips
                    rounded
                    deletable-chips
                    multiple
                    label="Locations"
                    solo
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="load_locations(searchString4)"
            >Load Locations</v-btn
          >
          <v-btn color="red" text @click="dialog_locations = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" text @click="guardar_locations">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_image_delete" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Action Confirmation</v-card-title>
        <v-card-text>
          Are you sure that you want to delete the image?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_image_delete = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="eliminar_imagem()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  components: {
    Loading
  },
  data: () => ({
    user: {},
    panelHeaderColor: "primary",
    dialog: false,
    dialog_image: false,
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    id: "",
    ready: false,
    categories: [],
    specializations: [],
    regraNome: [v => !!v || "Name is required."],
    regraImagem: [v => !!v || "Image is required."],
    regraEmail: [
      v => !!v || "Email is required.",
      v => /^.+@.+\..+$/.test(v) || "Email has to be valid."
    ],
    regraTipo: [v => !!v || "User type is required."],
    regraPassword: [v => !!v || "Password is required."],
    editedItem: {},
    ficheiro: [],
    dialog_image_delete: false,
    dialog_categories: false,
    newcategories: [],
    searchString: [],
    dialog_specializations: false,
    searchString2: [],
    newspecializations: [],
    countries: [],
    dialog_locations: false,
    cart: [],
    cartValue: 0,
    paypalDescription: "",
    dialog_premium: false,
    loaded: false,
    products: [
      {
        product_id: "1karma",
        price: 1,
        description: "100 Karma",
        qty: 0
      },
      {
        product_id: "10karma",
        price: 10,
        description: "1000 Karma",
        qty: 0
      },
      {
        product_id: "100karma",
        price: 100,
        description: "10000 Karma",
        qty: 0
      }
    ],
    searchString3: [],
    searchString4: [],
    newcountries: [],
    locations: [],
    newlocations: [],
    locs_ready: true
  }),
  async created() {
    var res = await this.$request(
      "get",
      "/users/" + this.$store.state.token + "/token"
    );
    this.id = res.data._id;

    await this.getUser();

    this.ready = true;
  },
  methods: {
    addtoCart: function(product) {
      this.cart.push(product);
      this.paypalDescription =
        this.paypalDescription + product.description + ", ";
      this.cartValue = this.cartValue + product.price;
    },
    clearCart: function() {
      this.cart = [];
      this.cartValue = 0;
      this.paypalDescription = "";
    },
    payMethod: function() {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AXBdCpb1zBJLiVZJPUCzGm8pkAXp6wtiWHO6jqTJrI0c1O40BI47_uShRPnESM6saN5R8Tiy8HUt4apZ";
      script.addEventListener("load", this.setLoaded);
      document.body.appendChild(script);
    },
    setLoaded: function() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.paypalDescription,
                  amount: {
                    currency_code: "USD",
                    value: this.cartValue
                  }
                }
              ]
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.paidFor = true;
            alert("Payment Sucessfull");
          },
          onError: err => {}
        })
        .render(this.$refs.paypal);
    },
    preparaCampos: async function(array) {
      try {
        let res = array.map(v => {
          return {
            text: v.name,
            value: v._id
          };
        });
        return res;
      } catch (e) {
        return [];
      }
    },
    async editar_specializations() {
      let specs = this.specializations.filter(el =>
        this.user.categorias.find(e => e._id === el.category)
      );
      this.newspecializations = await this.preparaCampos(specs);
      this.searchString2 = this.user.subcategorias.map(x => x._id);
      this.dialog_specializations = true;
    },
    async editar_categories() {
      this.newcategories = await this.preparaCampos(this.categories);
      this.searchString = this.user.categorias.map(x => x._id);
      this.dialog_categories = true;
    },
    async load_locations(paises) {
      this.locs_ready = false;
      // GET Locations na BD
      this.locations = await this.get_locations(paises);
      // Converter para array de text/value
      this.newlocations = await this.preparaCampos(this.locations);
      // Limpar selecionadas
      this.searchString3 = [];
      this.locs_ready = true;
    },
    async editar_locations() {
      // Abrir dialog
      this.dialog_locations = true;
      // Loading
      this.locs_ready = false;
      // GET Países na BD
      this.countries = await this.get_countries();
      // Converter para array de text/value
      this.newcountries = await this.preparaCampos(this.countries);
      // Ids das locations do user
      this.searchString3 = this.user.locations.map(x => x._id);
      // Ids dos países do user
      this.searchString4 = [
        ...new Set(this.user.locations.map(x => x.country))
      ];
      // GET Locations na BD
      this.locations = await this.get_locations(this.searchString4);
      // Converter para array de text/value
      this.newlocations = await this.preparaCampos(this.locations);
      this.locs_ready = true;
    },
    remover_imagem(item) {
      this.dialog_image_delete = true;
    },
    editar_imagem(item) {
      //this.ficheiro = {}; //Object.assign({}, this.user.photo);
      this.dialog_image = true;
    },
    editar(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    getPremium(item) {
      this.dialog_premium = true;
    },
    filter_query_string(ids) {
      let obj = {
        _id: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    filter_query_string_locs(ids) {
      let obj = {
        country: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async merge_fileds() {
      try {
        // FILTRAR ACTIVES ???
        let cats = this.user.categorias.map(c => {
          return this.categories.find(obj => obj._id === c);
        });

        // FILTRAR ACTIVES ???
        let specs = this.user.subcategorias.map(sc => {
          return this.specializations.find(obj => obj._id === sc);
        });

        this.user.categorias = cats;
        this.user.subcategorias = specs;
      } catch (e) {
        return e;
      }
    },
    async getUser() {
      try {
        var response = await this.$request("get", "/users/" + this.id);
        this.user = response.data;

        await this.getCategories();

        await this.getSpecializations();

        await this.merge_fileds();

        await this.getLocations();
      } catch (e) {
        return e;
      }
    },
    async get_countries() {
      try {
        var response = await this.$request("get", "/countries/");
        return response.data;
      } catch (e) {
        return e;
      }
    },
    async get_locations(paises) {
      try {
        let qs = this.filter_query_string_locs(paises);
        let queryS = qs === "" ? "" : "?" + qs;
        var response = await this.$request("get", "/locations/" + queryS);
        return response.data;
      } catch (e) {
        return e;
      }
    },
    async getLocations() {
      try {
        if (this.user.locations && this.user.locations.length > 0) {
          let qs = this.filter_query_string(this.user.locations);
          let queryS = qs === "" ? "" : "?" + qs;
          var response = await this.$request("get", "/locations/" + queryS);
          let specs = this.user.locations.map(sc => {
            return response.data.find(obj => obj._id === sc);
          });
          this.user.locations = specs;
        }
      } catch (e) {
        return e;
      }
    },
    async getCategories() {
      try {
        var response = await this.$request("get", "/categories/");
        this.categories = response.data;
      } catch (e) {
        return e;
      }
    },
    async getSpecializations() {
      try {
        var response = await this.$request("get", "/specializations/");
        this.specializations = response.data;
      } catch (e) {
        return e;
      }
    },
    guardar() {
      if (this.$refs.form.validate()) {
        this.$request("put", "/users/" + this.editedItem._id, {
          nome: this.editedItem.name,
          email: this.editedItem.email,
          level: this.user.level
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getUser();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async guardar_image() {
      if (this.$refs.form_image.validate()) {
        var formData = new FormData();

        if (this.ficheiro != null) {
          formData.append("file", this.ficheiro);
        }
        await this.$request(
          "put",
          "/users/" + this.user._id + "/uploadphoto",
          formData
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_image = false;
            this.getUser();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async guardar_premium() {
      //mudar o tipo de cliente?
    },
    async guardar_categories() {
      if (this.$refs.form_categories.validate()) {
        this.$request("put", "/users/" + this.user._id + "/categories", {
          categories: this.searchString
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_categories = false;
            this.getUser();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async guardar_specializations() {
      if (this.$refs.form_specializations.validate()) {
        this.$request("put", "/users/" + this.user._id + "/specializations", {
          specializations: this.searchString2
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_specializations = false;
            this.getUser();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async guardar_locations() {
      if (this.$refs.form_locations.validate()) {
        this.$request("put", "/users/" + this.user._id + "/locations", {
          locations: this.searchString3
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_locations = false;
            this.getUser();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async eliminar_imagem() {
      await this.$request("delete", "/users/" + this.user._id + "/removephoto")
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.dialog_image_delete = false;
          this.getUser();
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getUser();
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}
.card-heading {
  font-size: x-large;
  font-weight: bold;
}
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}
.fakea {
  color: #1a76d2;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
