# The Server class reflects servers of your infrastructures
# We use "window.Server" here so it's made available globally.
window.Server = class Server
  constructor: (serverName, serverAttributes = {}) ->
    @name = serverName
    for key, value of serverAttributes
      @[key] = value
    
  toHtml: ->
    html =  '<div class="draggable server '+@css_class+'" id="srv_'+@name+'" '
    if @link_to && @link_to.length > 1
      rel = @link_to.split(",").map((x)->"srv_"+$.trim(x)).join(",")
      html += 'rel="'+rel+'" '
    html += 'style="left:'+@pos_x+'px; top:'+@pos_y+'px">'
    html += '<h5>'+@name+'<span class="port">:'+@port+'</span></h5>'
    if @desc
      html += '<div>'+@desc+'</div>'
    html += '</div>'
    html
