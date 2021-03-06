//when the web page is loaded
$(document).ready(function() {
    // set tooltip and add title 
    var titleTooltip = "<b>START HERE</b> - Enter name and location info to pass on the next page when the form is submitted"
    $('[data-toggle="tooltip"]').attr('title', titleTooltip);
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'top',
        trigger: 'manual'
    }).tooltip('show');  
    
    //leave specific space depending on the screen size
    $('.description').css('margin-bottom', $('.tooltip').height()+20);

    //validate form
    $('#landing-section-form').validate({
        rules: {
		   firstName: "required",
           lastName: "required"
       },
	   messages: {
		   firstName: 'Please enter your First Name',
           lastName: 'Please enter your Last Name'
       }
	});
    // add url parameters to "Search Subject" field
    $('#searchSubject').val(getURLParameters());
    
});

//change tooltip position on resize the window
$(window).resize(function() {
    $('[data-toggle="tooltip"]').tooltip().tooltip('show'); 
    $('.description').css('margin-bottom', $('.tooltip').height()+20);
});

//get url parameters
function getURLParameters(){
    var pageUrl = window.location.search.substring(1);
    var urlParameters = pageUrl.split('&');
    var textField = [];
    var ajaxParameter = [];
    urlParameters.forEach(function(currentValue, index, init){
        var parameterName = currentValue.split('=');
        if(parameterName[1]){
            textField += parameterName[1].replace('+', ' ') + ' ';
        }
        //create the parameter of ajaxCall
        if(parameterName[0] == 'firstName' || parameterName[0] == 'lastName'){
           ajaxParameter += parameterName[1] + ' ';
        }
    });

    if(ajaxParameter){
        //call ajaxCall with firstName and lastName as parameter every 5 sec
        ajaxCall($.trim(ajaxParameter));
    }
    return textField;
}

//fill progress bar when ajaxCall is success
function move() {
  var width = 0;
  var id = setInterval(frame, 150);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      $('#loading-bar').hide();
      $('#open-report').show();        
    } else {
      width++; 
      $('#loading-bar-filled').width(width + '%'); 
      $('#loading-bar-filled').text(width + '%');
    }
  }
}

//ajaxCall fill the fields of the form depending of the name
function ajaxCall(name) {
    var params = jQuery.param({
        name: name,
    });
    $.ajax({
    type: 'GET',
    dataType: 'json',
    url: 'https://jsonplaceholder.typicode.com/users?' + params,
    contentType: 'application/json; charset=utf-8',
    success:function(data) {
        if($.trim(data)){
            $('.box-section').show();
            move();
            new Promise(function(resolve, reject) { 
                // A mock async action using setTimeout
                setTimeout(function() { $('#ajaxId').val(data[0].id); resolve(); }, 5 * 1000);
            }).then(function() { 
                setTimeout(function() { $('#ajaxName').val(data[0].name); }, 5 * 1000);
            }).then(function() { 
                setTimeout(function() { $('#ajaxEmail').val(data[0].email); }, 10 * 1000);
            });
        }else{
            $('#loading-bar-filled').width('100%'); 
            $('#loading-bar-filled').text('100%');
            $('.box-section-no-results').show();
        }
    },
    error: function (textStatus, errorThrown) {
        $('#loading-bar-filled').width('100%');
        $('#loading-bar-filled').text('100%');
        $('.box-section-no-results h2').text('Network error');
        $('.box-section-no-results').show();
        console.log(errorThrown);
    }
  });
}