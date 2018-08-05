const sheetNames = Object.keys(data);
let sheetNumber = 0;
let hot;
let innerHTML = [];

sheetNames.forEach((item, index)=>{
  innerHTML.push('<button class="tab-links">' + item + '</button>');
});

const tabArea = document.getElementById('tab-area');
const container = document.getElementById('handsontable-container');
tabArea.innerHTML = innerHTML.join('') + tabArea.innerHTML;

Array.from(document.getElementsByClassName('tab-links')).forEach((item, index)=>{
  item.addEventListener('click', ()=>{
    if(hot !== undefined){
      data[sheetNames[sheetNumber]] = hot.getData();
      hot.destroy();
    }

    sheetNumber = index
    loadExcelSheet();

    Array.from(document.getElementsByClassName('tab-links')).forEach((item2, index2)=>{
      item2.className = item2.className.replace(' active', '');
    });
    item.className += ' active';
  });

  if(index === sheetNumber) item.click();
});

document.getElementById('save').addEventListener('click', ()=>{
  fetch('/api/save',{
    method: 'post',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      config: config,
      data: data
    })
  }).then((resp)=>{
    alert('Saved!');
  })
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

function loadExcelSheet() {
  const dimension = getTrueWindowDimension();

  Object.assign(container.style, dimension);

  let actualConfig = {
    columns: []
  };

  Object.keys(defaultConfig).forEach((key)=>{
    if(config[sheetNames[sheetNumber]] === undefined){
      config[sheetNames[sheetNumber]] = Object.assign({}, config._default || {});
    }
    if(config[sheetNames[sheetNumber]][key] === undefined){
      config[sheetNames[sheetNumber]][key] = defaultConfig[key];
    }
  })
  Object.assign(actualConfig, config[sheetNames[sheetNumber]]);

  if(config[sheetNames[sheetNumber]].hasHeader){
    actualConfig.colHeaders = data[sheetNames[sheetNumber]][0];
    actualConfig.data = data[sheetNames[sheetNumber]].slice(1);
  } else {
    actualConfig.data = data[sheetNames[sheetNumber]];
  }

  if(actualConfig.columns.length === 0){
    const renderers = actualConfig.renderers;

    if(typeof renderers === 'string'){
      data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
        actualConfig.columns.push({
          data: index,
          renderer: renderers
        });
      });
    } else if(renderers !== null && typeof renderers === 'object') {
      data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
        actualConfig.columns.push({
          data: index,
          renderer: renderers[index.toString()]
        });
      });
    } else {
      data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
        actualConfig.columns.push({
          data: index
        });
      });
    }
  }

  if(actualConfig.colWidths === undefined && actualConfig.modifyColWidth === undefined){
    actualConfig.modifyColWidth = (width, col)=>{
      if(width > actualConfig.maxColWidth) return actualConfig.maxColWidth;
    }
  }

  hot = new Handsontable(document.getElementById('handsontable-area'), actualConfig);

  if(actualConfig.colWidths === undefined && config[sheetNames[sheetNumber]].modifyColWidth === undefined){
    colWidths = [];
    [...Array(hot.countCols()).keys()].map(i => {
      colWidths.push(hot.getColWidth(i));
    });

    hot.updateSettings({
      colWidths: colWidths
    });

    actualConfig.colWidths = config[sheetNames[sheetNumber]].colWidths = colWidths;
  }

  hot.updateSettings({
    modifyColWidth: (width, column)=>{
      actualConfig.colWidths[column]
        = config[sheetNames[sheetNumber]].colWidths[column]
        = width;
    }
  })
}
