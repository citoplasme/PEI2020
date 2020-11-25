const dominioDefault = "http://localhost:7779";
// const dominioDefault = "http://servicify-api.di.uminho.pt";

const dominio = process.env.API_URL || dominioDefault;
const apiVersion = process.env.API_VERSION || "v1";

module.exports.host = dominio + "/" + apiVersion;
