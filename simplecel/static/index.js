Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);
}

let sheetNames = Object.keys(data);
let sheetNumber = 0;
let hot;
let colHeaders;
const container = document.getElementById('handsontable-container');

createTabs();
document.getElementsByClassName('tab-links')[0].click();

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


function createTabs(){
  let innerHTML = [];

  sheetNames.forEach((item, index)=>{
    innerHTML.push('<button class="tab-links" id="tab-' + item + '">'
      + item + '</button>');
  });
  innerHTML.push('<button class="tab-links tab-new">+</button>');

  const tabArea = document.getElementById('tab-area');
  tabArea.innerHTML = innerHTML.join('');

  addTabListener();
}

function getTrueWindowDimension(){
  return {
    height: (window.innerHeight - document.getElementById('tab-area').offsetHeight) + 'px',
    width: window.innerWidth + 'px'
  };
}

function addTabListener(){
  Array.from(document.getElementsByClassName('tab-links')).forEach((item, index)=>{
    item.addEventListener('click', ()=>{
      let isNew;

      if(item.className.indexOf('tab-new') !== -1){
        const newSheetName = prompt("Please enter new sheet name:", "Sheet" + (index + 1));

        sheetNames.push(newSheetName)
        createTabs();

        const newSheetElement = document.getElementById('tab-' + newSheetName);
        newSheetElement.className = newSheetElement.className.replace(' tab-new', '');

        data[newSheetName] = Array(5).fill(Array(5).fill(''));

        isNew = true;
      } else {
        isNew = false;
      }

      if(hot !== undefined){
        if(colHeaders !== undefined){
          data[sheetNames[sheetNumber]] = [colHeaders];
        } else {
          data[sheetNames[sheetNumber]] = [];
        }
        data[sheetNames[sheetNumber]].extend(hot.getData());
        hot.destroy();
      }

      sheetNumber = index
      loadExcelSheet(isNew);

      Array.from(document.getElementsByClassName('tab-links')).forEach((item2, index2)=>{
        item2.className = item2.className.replace(' active', '');
      });
      item.className += ' active';
    });
  });
}

function loadExcelSheet(isNew) {
  const dimension = getTrueWindowDimension();

  Object.assign(container.style, dimension);

  let actualConfig = {
    columns: []
  };

  Object.keys(defaultConfig).forEach((key)=>{
    if(config[sheetNames[sheetNumber]] === undefined){
      config[sheetNames[sheetNumber]] = JSON.parse(JSON.stringify(config._default || {}));
    }

    if(isNew){
      config[sheetNames[sheetNumber]].hasHeader = false;
      config[sheetNames[sheetNumber]].colHeaders = true;
      colHeaders = undefined;
    }

    if(config[sheetNames[sheetNumber]][key] === undefined){
      config[sheetNames[sheetNumber]][key] = defaultConfig[key];
    }
  })
  Object.assign(actualConfig, config[sheetNames[sheetNumber]]);
  console.log(actualConfig);

  if(config[sheetNames[sheetNumber]].hasHeader){
    colHeaders = data[sheetNames[sheetNumber]][0];
    actualConfig.colHeaders = colHeaders;
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
