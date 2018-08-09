Array.prototype.extend = function (other_array) {
  /* you should include a test to check whether other_array really is an array */
  other_array.forEach(function(v) {this.push(v)}, this);
}

let sheetNames = Object.keys(data);
let sheetNumber = 0;
let hot;
const container = document.getElementById('handsontable-container');

createTabs();
document.getElementsByClassName('tab-links')[0].click();

document.body.addEventListener('keydown', function(e){
  e = e || window.event;
  const key = e.which || e.keyCode;
  const keyF = 102;
  const keyf = 70;

  if((key === keyf || key === keyF) && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    document.getElementById('search-bar').focus();
  }
});

document.getElementById('search-bar').addEventListener('keyup', (e)=>{
  readSearchBarValue(e.target.value);
});

document.getElementById('save').addEventListener('click', ()=>{
  const filtersPlugin = hot.getPlugin('filters');
  filtersPlugin.clearConditions();
  filtersPlugin.filter();

  if(config[sheetNames[sheetNumber]].hasHeader){
    data[sheetNames[sheetNumber]] = [hot.getColHeader()];
  } else {
    data[sheetNames[sheetNumber]] = [];
  }
  data[sheetNames[sheetNumber]].extend(hot.getData());

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

function readSearchBarValue(value){
  let newData = [];
  let oldData;

  if(config[sheetNames[sheetNumber]].hasHeader){
    oldData = data[sheetNames[sheetNumber]].slice(1);
  } else {
    oldData = data[sheetNames[sheetNumber]];
  }

  oldData.forEach((item, index)=>{
    if(item.some(x=>{x = (x!==null)?x:''; return x.toString().indexOf(value) !== -1})){
      newData.push(item);
    }
  });
  hot.updateSettings({
    data: newData
  });

  if(!value){
    insertEmptyRow();
  }
}

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
    height: (window.innerHeight - document.getElementById('tab-area').offsetHeight - 10) + 'px',
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
        saveData();
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

function clearFilter(){
  document.getElementById('search-bar').value = '';
  readSearchBarValue('');

  const filtersPlugin = hot.getPlugin('filters');
  filtersPlugin.clearConditions();
  filtersPlugin.filter();
}

function saveData(){
  clearFilter();

  if(config[sheetNames[sheetNumber]].hasHeader){
    data[sheetNames[sheetNumber]] = [hot.getColHeader()];
  } else {
    data[sheetNames[sheetNumber]] = [];
  }
  data[sheetNames[sheetNumber]].extend(hot.getData());
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

      if(isNew){
        const newConfig = {
          hasHeader: false,
          colHeaders: true,
          allowInsertCol: true
        };

        Object.assign(config[sheetNames[sheetNumber]], newConfig);
      }
    }

    if(config[sheetNames[sheetNumber]][key] === undefined){
      config[sheetNames[sheetNumber]][key] = defaultConfig[key];
    }
  })
  Object.assign(actualConfig, config[sheetNames[sheetNumber]]);
  console.log(actualConfig);

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
          renderer: renderers
        });
      });
    } else if(renderers !== null && typeof renderers === 'object') {
      data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
        actualConfig.columns.push({
          renderer: renderers[index.toString()]
        });
      });
    } else {
      data[sheetNames[sheetNumber]][0].forEach((item, index)=>{
        actualConfig.columns.push({});
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
  });

  if(actualConfig.autoInsertEmptyRow){
    insertEmptyRow();

    hot.updateSettings({
      afterChange: (changes, source)=>{
        if(!document.getElementById('search-bar')){
          insertEmptyRow();
        }
      }
    })
  }

  if(actualConfig.allowInsertCol){
    setTimeout(()=>{
      let menuItems = hot.getPlugin('contextMenu').menu.menuItems;

      menuItems.forEach((item, index)=>{
        if(item.key === "col_left"){
          menuItems.splice(index, 2,
            {
              key: "col_left",
              name: "Insert column left",
              callback: ()=>{
                const currentCol = hot.getSelected()[0][1];
                insertColumn(currentCol, actualConfig, hot);
              },
              disabled: false
            },
            {
              key: "col_right",
              name: "Insert column right",
              callback: ()=>{
                const currentCol = hot.getSelected()[0][1];
                insertColumn(currentCol + 1, actualConfig, hot);
              },
              disabled: false
            }
          );
        } else if(item.key === 'remove_col'){
          menuItems.splice(index, 1,
            {
              key: "remove_col",
              name: "Remove column",
              callback: ()=>{
                const currentCol = hot.getSelected()[0][1];

                removeColumn(currentCol, actualConfig, hot);
              },
              disabled: false
            }
          )
        }
      })

      hot.updateSettings({
        contextMenu: menuItems
      });
    }, 1000);
  }
}

function insertEmptyRow(){
  if(hot.getDataAtRow(hot.countRows() - 1).some(x=>x)){
    const newData = hot.getData();
    newData.push([]);
    hot.updateSettings({
      data: newData
    });
  }
}

function insertColumn(index, actualConfig, hotInstance){
  if(typeof renderers === 'string'){
    actualConfig.columns.splice(index, 0, {
      renderer: renderers
    });
  } else {
    actualConfig.columns.splice(index, 0, {});
  }

  actualConfig.colWidths.splice(index, 0, null);

  data[sheetNames[sheetNumber]].forEach((item)=>{
    item.splice(index, 0, '');
  });

  saveData();

  if(actualConfig.hasHeader){
    actualConfig.colHeaders.splice(index, 0,
      characterRange('A', actualConfig.colHeaders.length + 1)[index]);
    actualConfig.data = data[sheetNames[sheetNumber]].slice(1);
  } else {
    actualConfig.data = data[sheetNames[sheetNumber]];
  }

  hotInstance.updateSettings({
    columns: actualConfig.columns,
    colWidths: actualConfig.colWidths,
    colHeaders: actualConfig.colHeaders,
    data: actualConfig.data
  });
}

function removeColumn(index, actualConfig, hotInstance){
  if(typeof renderers === 'string'){
    actualConfig.columns.splice(index, 1);
  } else {
    actualConfig.columns.splice(index, 1);
  }

  actualConfig.colWidths.splice(index, 1);

  data[sheetNames[sheetNumber]].forEach((item)=>{
    item.splice(index, 1);
  });

  saveData();

  if(actualConfig.hasHeader){
    actualConfig.colHeaders = data[sheetNames[sheetNumber]][0];
    actualConfig.data = data[sheetNames[sheetNumber]].slice(1);
  } else {
    actualConfig.data = data[sheetNames[sheetNumber]];
  }

  hotInstance.updateSettings({
    columns: actualConfig.columns,
    colWidths: actualConfig.colWidths,
    colHeaders: actualConfig.colHeaders,
    data: actualConfig.data
  });
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function characterRange(startChar, numberOfChar) {
  return String.fromCharCode(...range(numberOfChar, startChar.charCodeAt(0)))
}
