const img_regex = /(?:(?=^)|(?=\s).|^)([^\s<>"\']+\.(?:png|jpg|jpeg|gif))/g;
const markdownConverter = new showdown.Converter;

(function(Handsontable){
  function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    let text = Handsontable.helper.stringify(value);
    text = text.replace(/\n+/g, "\n\n");
//    text = text.replace('\n', "<br />");
    text = text.replace(img_regex,
      "<img src='$1' width=200 />");

    td.innerHTML = markdownConverter.makeHtml(text);
//    td.innerHTML = text;

    return td;
  }

  // Register an alias
  Handsontable.renderers.registerRenderer('markdownRenderer', customRenderer);

})(Handsontable);

const sheetNames = Object.keys(data);
let hot;

$(document).ready(function() {
  renderTabs(sheetNames);
  loadExcelSheet(0);
});

function renderTabs(sheetNames){
  const $tabArea = $('#tab-area');
  for(let i=0; i<sheetNames.length; i++){
    const $li = $('<li class="nav-item"></li>');
    $li.append('<a class="nav-link" href="#">' + sheetNames[i] + '</a>');
    $li.click(function(){
      hot.destroy();
      loadExcelSheet(i);
    })
    $tabArea.append($li);
  }
  $tabArea.find('li:first-child').addClass('active');
}

function loadExcelSheet(sheetNumber) {
  $('#handsontable-area')
    .height($(window).height() - $('#tab-area').height())
    .width($(window).width());

  const container = document.getElementById('handsontable-area');
  let columnFormatter = [];
  for(let i=0; i<data[sheetNames[sheetNumber]][0].length; i++){
    columnFormatter.push({data: i, renderer: "markdownRenderer"});
  }

  hot = new Handsontable(container, {
    data: data[sheetNames[sheetNumber]].slice(1),
    rowHeaders: false,
    colHeaders: data[sheetNames[sheetNumber]][0],
    columns: columnFormatter,
    manualColumnResize: true,
    filters: true,
    dropdownMenu: true,
    contextMenu: true,
    modifyColWidth: function(width, col){
      if(width > 200) return 200;
    },
    manualRowResize: true,
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
