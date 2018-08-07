const markdownConverter = new showdown.Converter;
const img_regex = /(?:(?=^)|(?=\s).|^)([^\s<>"\']+\.(?:png|jpg|jpeg|gif))/gi;

(function(Handsontable){
  function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    let text = Handsontable.helper.stringify(value);
    text = text.replace(/\n+/g, "\n\n");
    text = text.replace(img_regex, "<img src='$1' width=200 />");

    td.innerHTML = markdownConverter.makeHtml(text);

    return td;
  }

  // Register an alias
  Handsontable.renderers.registerRenderer('markdownRenderer', customRenderer);

})(Handsontable);

(function(Handsontable){
  function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    let text = Handsontable.helper.stringify(value);
    text = text.replace(img_regex, "<img src='$1' width=200 />");

    td.innerHTML = text;

    return td;
  }

  // Register an alias
  Handsontable.renderers.registerRenderer('imageRenderer', customRenderer);

})(Handsontable);
