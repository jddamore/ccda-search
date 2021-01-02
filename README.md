# C-CDA Online Search Tool

Simple repository that posts the pieces of C-CDA on a website. 

## What's here

- An index page served up by express app
- The index page has a searchable table of all templates
- All the C-CDA 2.1 Templates (and Companion Guide) as pdfs
- The C-CDA 2.1 Templates as html pages (Companion Guide TBD)
- Links to examples and value sets from VSAC within each html template

## To install and run 

1. Make sure node & npm are installed on server

2. Install components to run server: `npm i`

3. Copy certificate files (key.pem and cert.pem) to `/certs` directory

4. Start server: `npm run` 
(you probably want to add to chron package on server restart)

