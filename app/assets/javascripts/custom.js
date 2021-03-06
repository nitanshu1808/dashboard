$(document).on('turbolinks:load', function() {
  $('.filterable .btn-filter').on('click', onFilterbtnClick);
  $('.filterable .filters input').on('keyup', onKeyPressTextSearch);
  $('.delete-user').on('click', onDeleteBtnClick);
  $('.checkbox-inline').on('click', oncheckBoxLabelClick);
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


function onPageNumberClick( evt ){
  var self    = $(this);
  var title   = self.text();
  var pageNum = self.attr('data-page-no');

  var data    = { page: pageNum}

  var onDone  = function( res ) {
    console.log("hello")
  }

  var onFail = function( err ) {
    console.log( "Error --> ", err );
  }

  ajaxCall('get', '/', data, onDone, onFail, 'json');
}

function setPrevNextPageLink( type, page_num ){

  $('.canvasjs-chart-credit').remove();
  var next      = $('.next')
  var prev      = $('.previous')
  var pageNum   = page_num && parseInt(page_num);

  if (!(pageNum) && pageNum <= 0) return false
  var totalPages = parseInt($(".pagination").attr("data-total-page"));
  switch (type) {
    case  'Next':
      setPrevNextAttrVal(next, prev, pageNum + 1, pageNum - 1)
      break;
    case  'Previous':
      setPrevNextAttrVal(next, prev, pageNum, (pageNum <= 0 && 0) || pageNum - 1)
    break;
    case 'Last':
      setPrevNextAttrVal(next, prev, 0, totalPages - 1);
      break;
    case 'First':
    setPrevNextAttrVal(next, prev, 2, 0)
  }
}

function setPrevNextAttrVal(next, prev, nextVal, prevVal){
  var url = next.attr("href")
  if (url.includes("page")){
    next.attr('href', url.replace(/=\d/, "=" + nextVal));
    prev.attr('href', url.replace(/=\d/, "=" + prevVal));  
  } else{
    next.attr('href', url + "&page=" + nextVal);
    prev.attr('href', url + "&page=" + prevVal);
  }  
}

function oncheckBoxLabelClick(evt){
  evt.preventDefault();
  var checkBox  = $(this).find('input[type=checkbox]');
  var self      = $(this);
  if (!(checkBox.is(":checked"))){
    checkBox.prop( "checked", true );
  }else{
    checkBox.prop( "checked", false );
  }
}


$( document ).on('turbolinks:load', function() {
  $('#myModal').on('click', '.modal-body',  function() {
    $("#new_user").validate({
      rules: {
        "user[first_name]": {
          required: true,
          maxlength: 30
        },
        "user[last_name]": {
          required: true,
          maxlength: 30
        },
        "user[email]": {
          required: true,
          maxlength: 30
        },
        "user[amount]":{
          required: true,
          number:   true
        }
      },
      messages: {
        "user[first_name]": {
            required:  I18n.t("app.enter_val", {val: I18n.t("app.first_name")}),
            maxlength: I18n.t("app.character_validation", {val: I18n.t("app.first_name"), num: 30})
        },
        "user[last_name]": {
            required:  I18n.t("app.enter_val", {val: I18n.t("app.last_name")}),
            maxlength: I18n.t("app.character_validation", {val: I18n.t("app.last_name"), num: 30})
        },
        "user[email]": {
            required:  I18n.t("app.enter_val", {val: I18n.t("app.email")}),
            maxlength: I18n.t("app.character_validation", {val: I18n.t("app.email"), num: 30})
        },
        "user[amount]": {
            required:  I18n.t("app.enter_val", {val: I18n.t("app.amount")}),
            number:    I18n.t("app.numeric")
        }
      }
    });
  });
})