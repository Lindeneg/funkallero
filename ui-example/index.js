const Handlebars = require('handlebars');

Handlebars.registerHelper('csvArray', function (a) {
    return a.split(',');
});
Handlebars.registerPartial('header', '<head>{{#each css}}{{this}}{{/each}}</head>');

const template = Handlebars.compile(`
    <html>
    {{> header css=(csvArray '1,5,125,125')}}
    </h1ml>
    `);

console.log(template());
