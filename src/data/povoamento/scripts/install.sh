#!/bin/bash  
echo "Starting process"  
DB="authtemplate"
# Importação dos dados para as várias coleções
# Categorias
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

echo "Finished"  
