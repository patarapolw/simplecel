const markdownConverter = new showdown.Converter;

(function(Handsontable){
  function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    const img_regex = /(?:(?=^)|(?=\s).|^)([^\s<>"\']+\.(?:png|jpg|jpeg|gif))/g;

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
    const img_regex = /(?:(?=^)|(?=\s).|^)([^\s<>"\']+\.(?:png|jpg|jpeg|gif))/g;

    let text = Handsontable.helper.stringify(value);
    text = text.replace(img_regex, "<img src='$1' width=200 />");

    td.innerHTML = text;

    return td;
  }

  // Register an alias
  Handsontable.renderers.registerRenderer('imageRenderer', customRenderer);

})(Handsontable);

const sheetNames = Object.keys(data);
let hot;
let innerHTML = [];

sheetNames.forEach((item, index)=>{
  innerHTML.push('<button class="tab-links">' + item + '</button>');
});

const tabArea = document.getElementById('tab-area');
const container = document.getElementById('handsontable-container');
tabArea.innerHTML = innerHTML.join('');

Array.from(document.getElementsByClassName('tab-links')).forEach((item, index)=>{
  item.addEventListener('click', ()=>{
    if(hot !== undefined) hot.destroy();
    loadExcelSheet(index);

    Array.from(document.getElementsByClassName('tab-links')).forEach((item2, index2)=>{
      item2.className = item2.className.replace(' active', '');
    });
    item.className += ' active';
  });

  if(index === 0) item.click();
});

window.addEventListener('resize', ()=>{
  const dimension = getTrueWindowDimension();

  Object.assign(container.style, dimension);
  Object.assign(document.getElementsByClassName('wtHolder')[0].style, dimension);
});


function getTrueWindowDimension(){
  return {
    height: (window.innerHeight - document.getElementById('tab-area').offsetHeight) + 'px',
    width: window.innerWidth + 'px'
  };
}

function loadExcelSheet(sheetNumber) {
  const dimension = getTrueWindowDimension();

  Object.assign(container.style, dimension);

  let columnFormatter = [];
  data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
    columnFormatter.push({
      data: index,
      // renderer: "markdownRenderer"
    });
  });

  hot = new Handsontable(document.getElementById('handsontable-area'), {
    data: data[sheetNames[sheetNumber]].slice(1),
    rowHeaders: false,
    colHeaders: data[sheetNames[sheetNumber]][0],
    columns: columnFormatter,
    manualColumnResize: true,
    filters: true,
    dropdownMenu: true,
    contextMenu: true,
    modifyColWidth: (width, col)=>{
      if(width > 200) return 200;
    },
    manualRowResize: true
  });

  colWidths = [];
  [...Array(hot.countCols()).keys()].map(i => {
    colWidths.push(hot.getColWidth(i));
  });

  hot.updateSettings({
    modifyColWidth: ()=>{},
    colWidths: colWidths
  });
}
