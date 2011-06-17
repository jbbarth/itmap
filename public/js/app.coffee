#Map distribution (servers and clusters)
web_app = [
  [ {name:"lb-intra-01", port:80, css_class:"server server-lb", link_to:"apache-01, apache-02"},
    {name:"lb-intra-02", port:80, css_class:"server server-lb server-passive"} ],
  [ {name:"apache-01", port:80, desc:"Apache 2.2.3", css_class:"server server-rp", link_to:"lb-j2ee-01"},
    {name:"apache-02", port:80, desc:"Apache 2.2.3", css_class:"server server-rp", link_to:"lb-j2ee-01"} ],
  [ {name:"lb-j2ee-01", port:80, css_class:"server server-lb", link_to:"tomcat-01, tomcat-02, tomcat-03"},
    {name:"lb-j2ee-02", port:80, css_class:"server server-lb server-passive"} ],
  [ {name:"tomcat-01", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-02", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-03", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>128m &rarr; 512m", css_class:"server server-j2ee", link_to:"postgres-01"} ],
  [ {name:"postgres-01", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server server-postgres"},
    {name:"postgres-02", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server server-postgres server-passive"} ]
]
rhclusters = [["postgres-01", "postgres-02"]]
heartbeats = [["lb-intra-01", "lb-intra-02"], ["lb-j2ee-01", "lb-j2ee-02"]]

servers = []
grid = new Grid {x_start: 100, x_step: 170, y_start: 50, y_step:110}
canvas_xlimits = [200, 800]

for line in web_app
  distribution = grid.distribute_horizontally(line.length, grid.options["x_step"], canvas_xlimits[0], canvas_xlimits[1])
  for serverJson in line
    server = new Server(serverJson["name"], serverJson)

jQuery ->
  prepareDraggableBoxes()
  updateCanvas($("#canvas"), $(".draggable"))
  $.each(rhclusters, () -> drawRhclusters(@[0], @[1]))
  $.each(heartbeats, () -> drawHeartbeats(@[0], @[1]))