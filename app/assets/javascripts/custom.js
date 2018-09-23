$(document).ready(function(){
  $('.filterable .btn-filter').on('click', onFilterbtnClick);
  $('.filterable .filters input').on('keyup', onKeyPressTextSearch);
  $('.delete-user').on('click', onDeleteBtnClick);
});


function onFilterbtnClick(evt) {
  evt.preventDefault();
  var $panel  = $(this).parents('.filterable'),
  $filters    = $panel.find('.filters .srchable'),
  $tbody      = $panel.find('.table tbody');
  $('.destroy').toggleClass('align-destry')
  if ($filters.prop('disabled') == true) {
      $filters.prop('disabled', false);
      $filters.first().focus();
  } else {
      $filters.val('').prop('disabled', true);
      $tbody.find('.no-result').remove();
      $tbody.find('tr').show();
  }
};

function onKeyPressTextSearch( evt ) {
  evt.preventDefault();
  /* Ignore tab key */

  var code = evt.keyCode || evt.which;
  if (code == '9') return;

  /* Useful DOM data and selectors */
  var $input    = $(this),
  inputContent  = $input.val().toLowerCase(),
  $panel        = $input.parents('.filterable'),
  column        = $panel.find('.filters th').index($input.parents('th')),
  $table        = $panel.find('.table'),
  $rows         = $table.find('tbody tr');

  /* Dirtiest filter function ever ;) */
  var $filteredRows = $rows.filter(function(){
      var value = $(this).find('td').eq(column).text().toLowerCase();
      return value.indexOf(inputContent) === -1;
  });

  /* Clean previous no-result if exist */
  $table.find('tbody .no-result').remove();

  /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
  $rows.show();
  $filteredRows.hide();

  /* Prepend no-result row if all rows are filtered */
  if ($filteredRows.length === $rows.length) {
      $table.find('tbody')
      .prepend($('<tr class="no-result text-center"><td colspan="'
      + $table.find('.filters th').length 
      +'">No result found</td></tr>'));
  }
}


function displayGraphAndChart( dataObj ){
  displayGraph( dataObj );
  displayPieChart( dataObj );
}

function displayGraph( dataObj ){
  var options = {
    animationEnabled: true,  
    title:{
        text: I18n.t("app.contribution")
    },
    axisY: {
        title: I18n.t("app.amount"),
        prefix: "$"
    },
    data: [{
        type: "area",
        markerSize: 5,
        xValueFormatString: "YYYY",
        yValueFormatString: "$#,##0.##",
        dataPoints: alterObj( dataObj )
    }]
  };

  $("#graphContainer").CanvasJSChart(options);
}


function displayPieChart( dataObj ){
  var options = {
    title: {
      text: I18n.t("app.share")
    },
    animationEnabled: true,
    data: [{
      type: "pie",
      startAngle: 40,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: alterObj( dataObj, true )
    }]
  };

  $("#chartContainer").CanvasJSChart(options);
}


function alterObj( dataObj, isPieChart ){
  var data = []
  if (isPieChart){
    var total = findTotal( dataObj );
    for (var i in dataObj) {
      var avgAmnt = parseFloat(((dataObj[i].amount/total) * 100).toFixed(2));
      data.push({label: dataObj[i].first_name, y: avgAmnt});
    }
  }else{
    for (var i in dataObj) {
      data.push({x: new Date(dataObj[i].created_at), y: dataObj[i].amount });
    }  
  }
  
  return data
}

function findTotal( obj ){
  var sum = 0
  for (var i in obj) { sum += obj[i].amount }
  return sum;
}


function ajaxCall ( mType, url, dataObj,doneCB, failCB, dataType) {
  var ajaxObj = {
    method: mType,
    url: url,
    data: dataObj,
    dataType: 'json'
  }
  $.ajax(ajaxObj)
  .done(doneCB)
  .fail(failCB);
}

function onDeleteBtnClick( evt ){
  var confirmDeletion =  confirm(I18n.t("app.confirm_deletion"));
  
  if (confirmDeletion){
    var self    = $(this);
    var data    = {
      id: self.attr('data-id')
    };

    var onDone  = function( res ) {
      self.closest('tr').remove();
    }

    var onFail = function( err ) {
      console.log( "Error --> ", err );
    }

    ajaxCall('get', 'delete_user', data, onDone, onFail, 'json');
  }  
}
