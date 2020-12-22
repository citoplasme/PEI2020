fs = require('fs');
/*
// ----------------------------------------------------------------------------
// ------------------------------ Categories ----------------------------------
// ----------------------------------------------------------------------------

var data = fs.readFileSync('../files/categories.json', 'utf8');
var parsed = JSON.parse(data);

// Remover n/a
parsed = parsed.filter(o => o.name != 'n/a')

// Remover duplicados
parsed = parsed.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i)

fs.writeFileSync("../final/categories.json", JSON.stringify(parsed, null, 2)); 

// ----------------------------------------------------------------------------
// --------------------------- Specializations --------------------------------
// ----------------------------------------------------------------------------

var d = fs.readFileSync('../files/specializations.json', 'utf8');
var p = JSON.parse(d);

// Remover n/a
p = p.filter(o => o.name != 'n/a')

// Remover category n/a
p = p.filter(o => o.category != 'n/a')

// Remover duplicados
p = p.filter((v,i,a) => a.findIndex(t=>(t.name === v.name))===i)

// Match de categorias por ID
p = p.map(o => {
    o.category = parsed.find(c => c.name == o.category)._id.$oid;
    return o;
})

fs.writeFileSync("../final/specializations.json", JSON.stringify(p, null, 2)); 

// ----------------------------------------------------------------------------
// -------------------------------- Users -------------------------------------
// ----------------------------------------------------------------------------
var l = fs.readFileSync('../files/locations.json', 'utf8');
var locs = JSON.parse(l);

var d2 = fs.readFileSync('../files/users.json', 'utf8');
var d3 = fs.readFileSync('../files/companies.json', 'utf8');
var p1 = JSON.parse(d2);
var p2 = JSON.parse(d3);

p1 = p1.concat(p2)

// Remover emails duplicados
p1 = p1.filter((v,i,a) => a.findIndex(t=>(t.email === v.email))===i)
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
p1 = p1.map(o => {
    // Por ToS a true
    o.termsofservice = true;

    // Adicionar passwords (123 codificado)
    o.local = {
        password : "$2a$14$VsGKWkY9OGBWO94wHnlmeO5nXUGfN5kurz8c6HVrlrMF.bq9eF4Cy"
    };
    // Converter photo para o formato certo
    o.photo = {
        extension : o.photo.substring("data:image/".length, o.photo.indexOf(";base64")),// extensão: png
        content : o.photo.substring(o.photo.indexOf(";base64,") + ";base64,".length, o.photo.length)// conteudo, depois de ;base64, 
    }
    // Gerar Locs, cats e specs se level entre 3 e 4
    if(o.level >= 3 && o.level <= 4){

        // Numero de serviços >= 100
        if(o.level == 3 && o.servicos_realizados >= 100){
            o.level = 3.5;
        }
        // Gerar Locations
        let nlocs = getRandomIntInclusive(0, 10);
        o.locations = locs.sort(() => .5 - Math.random()).slice(0,nlocs).map(c => c._id.$oid);
        // Gerar Categories
        // Gerar dimensão aleatoria
        let ncats = getRandomIntInclusive(0, parsed.length / 2);
        // Povoar com base em dimensão
        o.categorias = parsed.sort(() => .5 - Math.random()).slice(0,ncats).map(c => c._id.$oid);
        // Gerar Especializações
        // Gerar Specs possiveis com base nas categorias
        let possible_specs = p.filter(s => o.categorias.includes(s.category));
        // Gerar dimensão aleatoria
        let nspecs = getRandomIntInclusive(0, possible_specs.length / 3);
        // Povoar com base em dimensão
        o.subcategorias = possible_specs.sort(() => .5 - Math.random()).slice(0,nspecs).map(c => c._id.$oid);
    }
    return o;
})

fs.writeFileSync("../final/users.json", JSON.stringify(p1, null, 2)); 

console.log('FINISHED')
*/
// ----------------------------------------------------------------------------
// -------------------------------- Services ----------------------------------
// ----------------------------------------------------------------------------
var s = fs.readFileSync('../files/services.json', 'utf8');
var u = fs.readFileSync('../final/users.json', 'utf8');

var servs = JSON.parse(s);
var users = JSON.parse(u);

var clients = users.filter(u => u.level == 1 || u.level == 2);
var service_providers = users.filter(u => u.level == 3 || u.level == 3.5 || u.level == 4);

servs = servs.map(se => {
    // CLient 
    se.client = clients.sort(() => .5 - Math.random()).slice(0,1).map(c => c._id.$oid)[0];
    // Service Provider
    se.service_provider = service_providers.sort(() => .5 - Math.random()).slice(0,1).map(c => c._id.$oid)[0];
    // Status 
    // Negotiation Failed
    if(se.status == -2){
        // Delete review client
        delete se.review.client.payment;
        delete se.review.client.ponctuality;
        delete se.review.client.security;
        delete se.review.client.general;
        delete se.review.client.comentario;
        delete se.review.client.karma;

        // Delete review service provider
        delete se.review.service_provider.ponctuality;
        delete se.review.service_provider.quality;
        delete se.review.service_provider.security;
        delete se.review.service_provider.attendance;
        delete se.review.service_provider.general;
        delete se.review.service_provider.comentario;
        delete se.review.service_provider.karma;    
    }
    // Canceled
    else if(se.status == -1){
        // Delete review client
        delete se.review.client.payment;
        delete se.review.client.ponctuality;
        delete se.review.client.security;
        delete se.review.client.general;
        delete se.review.client.comentario;
        delete se.review.client.karma;

        // Delete review service provider
        delete se.review.service_provider.ponctuality;
        delete se.review.service_provider.quality;
        delete se.review.service_provider.security;
        delete se.review.service_provider.attendance;
        delete se.review.service_provider.general;
        delete se.review.service_provider.comentario;
        delete se.review.service_provider.karma;
    }
    // Generated
    else if(se.status == 0){
        // Delete review client
        delete se.review.client.payment;
        delete se.review.client.ponctuality;
        delete se.review.client.security;
        delete se.review.client.general;
        delete se.review.client.comentario;
        delete se.review.client.karma;

        // Delete review service provider
        delete se.review.service_provider.ponctuality;
        delete se.review.service_provider.quality;
        delete se.review.service_provider.security;
        delete se.review.service_provider.attendance;
        delete se.review.service_provider.general;
        delete se.review.service_provider.comentario;
        delete se.review.service_provider.karma;
        // Delete orcamento
        se.orcamento = [];
    }
    // Negotiating
    else if(se.status == 1){
        // Delete review client
        delete se.review.client.payment;
        delete se.review.client.ponctuality;
        delete se.review.client.security;
        delete se.review.client.general;
        delete se.review.client.comentario;
        delete se.review.client.karma;

        // Delete review service provider
        delete se.review.service_provider.ponctuality;
        delete se.review.service_provider.quality;
        delete se.review.service_provider.security;
        delete se.review.service_provider.attendance;
        delete se.review.service_provider.general;
        delete se.review.service_provider.comentario;
        delete se.review.service_provider.karma;
    }
    // Accepted
    else if(se.status == 2){
        // Delete review client
        delete se.review.client.payment;
        delete se.review.client.ponctuality;
        delete se.review.client.security;
        delete se.review.client.general;
        delete se.review.client.comentario;
        delete se.review.client.karma;

        // Delete review service provider
        delete se.review.service_provider.ponctuality;
        delete se.review.service_provider.quality;
        delete se.review.service_provider.security;
        delete se.review.service_provider.attendance;
        delete se.review.service_provider.general;
        delete se.review.service_provider.comentario;
        delete se.review.service_provider.karma;
    }
    // Waiting for evaluation
    else if(se.status == 3){
        let n = getRandomIntInclusive(1, 2);
        if(n == 1){
            // Delete review client
            delete se.review.client.payment;
            delete se.review.client.ponctuality;
            delete se.review.client.security;
            delete se.review.client.general;
            delete se.review.client.comentario;
            delete se.review.client.karma;
        }
        else {
            // Delete review client
            delete se.review.client.payment;
            delete se.review.client.ponctuality;
            delete se.review.client.security;
            delete se.review.client.general;
            delete se.review.client.comentario;
            delete se.review.client.karma;

            // Delete review service provider
            delete se.review.service_provider.ponctuality;
            delete se.review.service_provider.quality;
            delete se.review.service_provider.security;
            delete se.review.service_provider.attendance;
            delete se.review.service_provider.general;
            delete se.review.service_provider.comentario;
            delete se.review.service_provider.karma;
        }
    }
    // Finalized
    else{
        // Do nothing 
    }

    // Colocar users dos bids como User ou SP
    if(se.orcamento.length > 0){
        se.orcamento.map(e => {
            let n = getRandomIntInclusive(1, 2);
            if(n == 1){
                e.user = se.client;
            }
            else {
                e.user = se.service_provider;
            }
            return e;
        })
    }

    // Horas com dois digitos
    if(se.hour.length < 5){
        se.hour = '0' + se.hour;
    }

    return se;
})


fs.writeFileSync("../final/services.json", JSON.stringify(servs, null, 2)); 

console.log('FINISHED')