#Map distribution (servers and clusters)
web_app = [
  [ {name:"lb-intra-01", port:80, css_class:"server-lb", link_to:"apache-01, apache-02"},
    {name:"lb-intra-02", port:80, css_class:"server-lb server-passive"} ],
  [ {name:"apache-01", port:80, desc:"Apache 2.2.3", css_class:"server-rp", link_to:"lb-j2ee-01"},
    {name:"apache-02", port:80, desc:"Apache 2.2.3", css_class:"server-rp", link_to:"lb-j2ee-01"} ],
  [ {name:"lb-j2ee-01", port:80, css_class:"server-lb", link_to:"tomcat-01, tomcat-02, tomcat-03"},
    {name:"lb-j2ee-02", port:80, css_class:"server-lb server-passive"} ],
  [ {name:"tomcat-01", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-02", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-03", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>128m &rarr; 512m", css_class:"server-j2ee", link_to:"postgres-01"} ],
  [ {name:"postgres-01", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server-postgres"},
    {name:"postgres-02", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server-postgres server-passive"} ]
]
rhclusters = [["postgres-01", "postgres-02"]]
heartbeats = [["lb-intra-01", "lb-intra-02"], ["lb-j2ee-01", "lb-j2ee-02"]]

servers = []
grid = new Grid {x_start: 100, x_step: 170, y_start: 30, y_step:110}
canvas_xlimits = [0, 400]
canvasOffset = 7.5

y = grid.options.y_start
for line in web_app
  active = $.grep(line, (x)-> ! x.css_class.match(/passive/))
  distrib = grid.distribute_horizontally(active.length, grid.options.x_step, canvas_xlimits[0], canvas_xlimits[1])
  x = distrib[0]
  for serverJson in line
    server = new Server(serverJson.name, serverJson)
    server.pos_x = x
    server.pos_y = y
    x += grid.options.x_step
    servers.push(server)
  y += grid.options.y_step
  y -= 50 if line[0].css_class.match(/server-lb/)

$ ->
  paper = Raphael("map", 550, 450)
  shapes = []
  rect_index = {}
  $.each servers, ->
    $(@toHtml()).insertBefore($("#map"))
    server = $("#srv_"+@name)[0]
    [x, y, w, h] = [@pos_x - canvasOffset, @pos_y - canvasOffset, $(server).outerWidth()+1, $(server).outerHeight()+1]
    fo = document.createElementNS(paper.svgns, "foreignObject")
    fo.setAttribute("x", x)
    fo.setAttribute("y", y)
    fo.setAttribute("width", w)
    fo.setAttribute("height", h)
    newdiv = document.createElementNS("http://www.w3.org/1999/xhtml","div")
    server.setAttribute("style","")
    newdiv.appendChild(server)
    fo.appendChild(newdiv)
    paper.canvas.appendChild fo
    rect = paper.rect(x, y, w, h)
    #move foreign object along with rect
    rect.foreign = fo
    #keep rect in the 'shapes' collection
    shapes.push(rect)
    #update rect_index, where we manage connections
    rect_index[@name] = rect

  # make server draggable
  dragger = ->
    @ox = @attr("x")
    @oy = @attr("y")
    if @foreign
      @foreign.ox = @foreign.getAttribute("x")
      @foreign.oy = @foreign.getAttribute("y")
    #@animate({"fill-opacity": 0.2}, 500)
  move = (dx, dy) ->
    @attr({x: @ox + dx, y: @oy + dy})
    #move paired element if any
    if @foreign
      @foreign.setAttribute("x", parseFloat(@foreign.ox) + dx)
      @foreign.setAttribute("y", parseFloat(@foreign.oy) + dy)
    for conn in connections
      paper.connection(conn)
    paper.safari()
  up = ->
    #@animate({"fill-opacity": 0}, 500)
  for shape in shapes
    color = Raphael.getColor()
    shape.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-opacity": 0, "stroke-width": 0, cursor: "move"})
    shape.drag(move, dragger, up)
  connections = []
  for server in servers
    for target in server.targets()
      if rect_index[target]
        connections.push(paper.connection(rect_index[server.name], rect_index[target]))
