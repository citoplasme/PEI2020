#!/bin/bash  

echo "Starting process"  

DB="authtemplate"
user="ADMIN"
pass="ADMIN"
declare -a collections=("categories" "countries" "locations" "services" "specializations" "users")
# Importação dos dados para as várias coleções
# Categorias
<<<<<<< HEAD

for collection in "${collections[@]}"
do
    mongoimport --authenticationDatabase authtemplate --username "$user" --password "$pass" --db "$DB" --collection "$collection" --file ../final/$collection.json --jsonArray --drop
done
=======
mongoimport --db "$DB" --collection categories --file ../final/categories.json --jsonArray --drop

# Specializations
mongoimport --db "$DB" --collection specializations --file ../final/specializations.json --jsonArray --drop

# Countries
mongoimport --db "$DB" --collection countries --file ../files/countries.json --jsonArray --drop

# Locations
mongoimport --db "$DB" --collection locations --file ../files/locations.json --jsonArray --drop

# Users
mongoimport --db "$DB" --collection users --file ../final/users.json --jsonArray --drop

# Services
mongoimport --db "$DB" --collection services --file ../final/services.json --jsonArray --drop
>>>>>>> 665b7e7f3ed442ab0421c738bb924914975e690a

echo "Finished"  

