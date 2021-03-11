# C-CDA Online Search Tool

This repository contains the HTML pages (and pdfs) which were provided as part of the C-CDA navigation tool project, initially released in January 2021 

The project was released in beta here: http://www.hl7.org/ccdasearch/

**IMPORTANT:** Information contained in this repository is publicly accessible on the internet, but it is not open-source. Please see LICENSE.txt for more information

## What's here

- An index page served up by express app (Note that HL7 website may use different hosting)
- The index page has a searchable table of all templates
- All the C-CDA 2.1 Templates (and Companion Guide) as pdfs
- The C-CDA 2.1 and Companion Guide C-CDA 2.1 templates as html pages
- Links to examples and value sets from VSAC within each html template

## Beta Fedback

This project was launched as a beta in January 2021. You can read about the project on the HL7 Blog here: https://blog.hl7.org/new-hl7-c-cda-navigation-tool-released

For feedback, please create an issue on this github repository. HL7 has not formalized a maintenance or update plan at this time. This repository may eventually be migrated but was originally developed by Github user https://github.com/jddamore with help from many HL7 colleagues!  

## To install and run locally

1. Make sure node & npm are installed on server

2. Install components to run server: `npm i`

3. Copy certificate files (key.pem and cert.pem) to `/certs` directory

4. Start server: `npm start` 
(may need `sudo`, you probably want to add to chron package on server restart)

