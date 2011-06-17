# The Server class reflects servers of your infrastructures
# We use "window.Server" here so it's made available globally.
window.Server = class Server
  constructor: (serverName, serverAttributes = {}) ->
    @name = serverName
    @attributes = serverAttributes
    #the hard way:
    #@attributes = {}
    #for key, value of serverAttributes
    #  @attributes[key] = value
    
  toHtml: ->
    html =  '<div class="draggable '+@attributes['css_class']+'" id="srv_'+@attributes['name']+'" '
    if @attributes['link_to'] && @attributes['link_to'].length > 1
      rel = @attributes['link_to'].split(",").map((x)->"srv_"+$.trim(x)).join(",")
      html += 'rel="'+rel+'" '
    html += 'style="left:'+@attributes['pos_x']+'px; top:'+@attributes['pos_y']+'px">'
    html += '<h5>'+@attributes['name']+'<span class="port">:'+@attributes['port']+'</span></h5>'
    if @attributes['desc']
      html += '<div>'+@attributes['desc']+'</div>'
    html += '</div>'
    html
