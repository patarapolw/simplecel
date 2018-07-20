var img_regex = /([^\s<>"\']+\.(?:png|jpg|jpeg|gif))/g;

(function(Handsontable){
  function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    var text = Handsontable.helper.stringify(value);
    // text = text.replace(/\n+/g, "\n\n");
    text = text.replace(img_regex,
      "<div class='hoverShowImage'><a href='$1' target='_blank'>$1</a></div>");

    var converter = new showdown.Converter;
    td.innerHTML = converter.makeHtml(text);

    return td;
  }

  // Register an alias
  Handsontable.renderers.registerRenderer('markdownRenderer', customRenderer);

})(Handsontable);

var sheetNames = Object.keys(data);
renderTabs(sheetNames);
loadExcelSheet(0);

$(document).ready(function() {
  $(document).tooltip({
      items: '.hoverShowImage',
      content: function(e){
          return "<img src='" + $(this).text().match(img_regex)[0] + "' />";
      }
  });
});

function renderTabs(sheetNames){
  var $tabArea = $('#tab-area');
  for(var i=0; i<sheetNames.length; i++){
    $tabArea.append('<li class="nav-item">\
    <a class="nav-link" href="#">' + sheetNames[i] + '</a>\
  </li>')
  }
  $tabArea.find('li:first-child').addClass('active');
}

function loadExcelSheet(sheetNumber) {
  var container = document.getElementById('handsontable-area');
  var columnFormatter = [];
  var colWidths = [];
  for(var i=0; i<data[sheetNames[sheetNumber]][0].length; i++){
    columnFormatter.push({data: i, renderer: "markdownRenderer"});
    colWidths.push(200);
  }

  var hot = new Handsontable(container, {
    data: data[sheetNames[sheetNumber]].slice(1),
    rowHeaders: false,
    colHeaders: data[sheetNames[sheetNumber]][0],
    colWidths: colWidths,
    columns: columnFormatter,
    manualColumnResize: true,
    filters: true,
    dropdownMenu: true,
    contextMenu: true,
    afterChange: function(change, source){
      if(source === 'loadData'){
        return;
      }
      // console.log(change);
      // if (!autosave.checked) {
      //   return;
      // }
      // $.post('/api/save/', {data: change});
    }
  });
}
