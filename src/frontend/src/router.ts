import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Principal.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/pesquisa",
      name: "pesquisa",
      component: () => import("./views/users/Pesquisa.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] },
      props: true
    },
    // Routes da gestão de utilizadores
    {
      path: "/users/autenticacao",
      name: "autenticacao",
      component: () => import("./views/users/Autenticacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/registo",
      name: "registo",
      component: () => import("./views/users/Registo.vue"),
      meta: { levels: [0] }
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("./views/users/Login.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/recuperacao",
      name: "recuperacao",
      component: () => import("./views/users/Recuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/alteracaoPassword",
      name: "alteracaoPassword",
      component: () => import("./views/users/AlteracaoPassword.vue"),
      meta: { levels: [1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/alteracaoPasswordRecuperacao",
      name: "alteracaoPasswordRecuperacao",
      component: () => import("./views/users/AlteracaoPasswordRecuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/listagem",
      name: "listagem",
      component: () => import("./views/users/ListagemUsers.vue"),
      meta: { levels: [5, 6, 7] }
    },
    {
      path: "/users/registoAcesso",
      name: "registoDeAcesso",
      component: () => import("./views/users/RegistoAcesso.vue"),
      meta: { levels: [6, 7] }
    },
    //Métricas
    {
      path: "/gestao/metrica",
      name: "metrica",
      component: () => import("./views/gestao/Metrica.vue"),
      meta: { levels: [6, 7] }
    },
    //Chaves API
    {
      path: "/gestao/api/listagem",
      name: "listagemApi",
      component: () => import("./views/gestao/api/ListagemChavesApi.vue"),
      meta: { levels: [7] }
    },
    {
      path: "/gestao/api/registo",
      name: "registoApi",
      component: () => import("./views/gestao/api/RegistoChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/gestao/api/renovar",
      name: "renovarApi",
      component: () => import("./views/gestao/api/RenovarChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //Routes to monitor categories
    {
      path: "/categories/list",
      name: "categoriesList",
      component: () => import("./views/categories/CategoriesList.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/categories/:name",
      name: "categoryByName",
      component: () => import("./views/categories/CategoryByName.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //Routes do monitor Services
    {
      path: "/services/calendar",
      name: "servicesCalendar",
      component: () => import("./views/services/ServicesCalendar.vue"),
      meta: { levels: [1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //Routes to monitor Services Providers
    {
      path: "/serviceProviders/list",
      name: "serviceProviders",
      component: () => import("./views/service_providers/ServiceProviders.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    }
  ]
});
