const dominioDefault = "http://localhost:50300";
// const dominioDefault = "http://servicify-api.di.uminho.pt";

const dominio = process.env.VUE_APP_API_URL || dominioDefault;
const apiVersion = process.env.VUE_APP_API_VERSION || "v1";


module.exports.host = dominio + "/" + apiVersion;