#!/bin/bash  

echo "Starting process"  

DB="authtemplate"
user="ADMIN"
pass="ADMIN"
declare -a collections=("categories" "countries" "locations" "services" "specializations" "users")
# Importação dos dados para as várias coleções
# Categorias

for collection in "${collections[@]}"
do
    mongoimport --authenticationDatabase authtemplate --username "$user" --password "$pass" --db "$DB" --collection "$collection" --file ../final/$collection.json --jsonArray --drop
done

echo "Finished"  

