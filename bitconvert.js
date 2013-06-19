var options = {
  default_currency: 'USD',
  class_element: 'amount'
}

var exchange_rate = 0;
var original_element_values = [];
var current_currency = options.default_currency;

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "."+ options.class_element+"{ border: 1px solid #aaa; background-color: #eee; padding: 0px 6px; }";
document.body.appendChild(css);

function toggleConversion(){
  if(exchange_rate == 0){
    var elements = document.getElementsByClassName(options.class_element);
    for(var i = 0; i < elements.length; i++){
      var element_value = elements[i].innerHTML;
      element_value = element_value.replace(/[A-Za-z$-]/g, '');
      original_element_values[i] = parseFloat(element_value);
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4){
        var json = JSON.parse(xhr.responseText);
        exchange_rate = json.data.last.value;
        render();
      }
    }
    xhr.open('GET', 'http://data.mtgox.com/api/2/BTCUSD/money/ticker_fast', true);
    xhr.send();
  }
  else{
    render();
  }
}

function render(){
  var elements = document.getElementsByClassName(options.class_element);
  for(var i = 0; i < elements.length; i++){
    if(current_currency == 'BTC'){
      if(options.default_currency == 'BTC') elements[i].innerHTML = "$ "+(original_element_values[i]*exchange_rate).toFixed(2);
      else elements[i].innerHTML = "$ "+ original_element_values[i];
    }
    else{
      if(options.default_currency == 'USD') elements[i].innerHTML = (original_element_values[i]/exchange_rate).toFixed(8) + " BTC";
      else elements[i].innerHTML = original_element_values[i] + " BTC";
    }
  }
  current_currency = current_currency == 'USD' ? "BTC" : "USD";
}