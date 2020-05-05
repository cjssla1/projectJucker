
module.exports = {
    HTML:function(title,res,body){
        listhtml = '<ul>';
        for(var i=0; i<res.length;i++){
            listhtml += `<li><a href="/page/${res[i].id}">${res[i].title}</a></li>`;
        }
        listhtml += '</ul>';

        return `
            <!doctype html>
            <html>
            <head>
                <title>${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1>${title}</h1>
                <p>${listhtml}</p>
                <p>${body}</p>
            </body>
            </html>
        `;
    }
}