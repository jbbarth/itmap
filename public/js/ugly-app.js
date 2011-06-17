// GLOBAL PARAMETERS
var arrow = [ [ 0, 0 ], [ -10, -4 ], [ -10, 4] ]; //coords for an horizontal arrow
var bias = 5; //bias to calculate best handler for min dist
var exagerate = 1; //exagerate box coords so that arrows are not under boxes

// DRAG BOXES
function prepareDraggableBoxes() {
  $(".draggable").draggable({
    //handle: '.handler',
    handle: '.draggable h5',
    drag: function(){updateCanvas($("#canvas"), $(".draggable"));},
    stop: function(){updateCanvas($("#canvas"), $(".draggable"));}
  });
  $(".draggable").draggable({collide: 'block'});
  $("div, h5").disableSelection();
  $(".draggable").hover(
    function (){ $(this).addClass("hover"); },
    function (){ $(this).removeClass("hover"); }
  );
  $(".draggable").click(
    function (){ $(this).toggleClass("selected"); }
  )
}

//Draw hearbeats
function drawHeartbeats(el1, el2) {
  var coords1 = getCornersCoords("#srv_"+el1);
  var coords2 = getCornersCoords("#srv_"+el2);
  var center1 = barycenter(coords1[0],coords1[2]);
  var center2 = barycenter(coords2[0],coords2[2]);
  var pos = barycenter(center1, center2);
  var hb = document.createElement('div');
  hb.setAttribute('class','heartbeat');
  hb.setAttribute('rel',el1+','+el2);
  hb.innerHTML = '&hearts;';
  $(hb).insertBefore("canvas");
  $(hb).css("position", "absolute").css("color","#f33").css("font-size","11px").css("left", pos[0]-4).css("top", pos[1]-6);
} 
 
//Draw redhat clusters
function drawRhclusters(el1, el2) {
  var coords1 = getCornersCoords("#srv_"+el1);
  var coords2 = getCornersCoords("#srv_"+el2);
  var center1 = barycenter(coords1[0],coords1[2]);
  var center2 = barycenter(coords2[0],coords2[2]);
  var pos = barycenter(center1, center2);
  var rhc = document.createElement('div');
  rhc.setAttribute('class','rhcluster');
  rhc.setAttribute('rel',el1+','+el2);
  rhc.innerHTML = 'R';
  $(rhc).insertBefore("canvas");
  $(rhc).css("position", "absolute").css("font-weight","bold").css("color","#c90000").css("padding","0px 2px").css("left", pos[0]-6).css("top", pos[1]-6);
} 

//Adapted from:
//http://stackoverflow.com/questions/1104295/jquery-use-canvas-to-draw-lines-between-divs
//http://servut.us/akx/stackoverflow/jquery-canvas-lines.html
function updateCanvas(canvasJq, blkEls) {
  var canvasEl = canvasJq[0];
  canvasEl.width=canvasJq.width();
  canvasEl.height=canvasJq.height();
  var cOffset = canvasJq.offset();
  var ctx = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  $(blkEls).each(function(){
    var src=$(this);
    if(src.attr("rel")) {
      var srcOffset=src.offset();
      var srcMidHeight=src.height()/2;
      var targets=src.attr("rel");
      $.each(targets.split(","), function(idx,target){
        coords = minDistanceHandlers(src,$("#"+target));
        drawLineArrow(ctx, coords[0][0] - cOffset.left,coords[0][1] - cOffset.top,
          coords[1][0] - cOffset.left,coords[1][1] - cOffset.top, "#666");
      });
    }
  });
  ctx.stroke();
  ctx.closePath();
}
//get an array with coords of each corner of an element
function getCornersCoords(blkEl) {
  var e = $(blkEl), o = e.offset()
  if (o) {
    return new Array(
      new Array(o.left - exagerate, o.top - exagerate),
      new Array(o.left + e.width() + exagerate, o.top - exagerate),
      new Array(o.left + e.width() + exagerate, o.top + e.height() + exagerate),
      new Array(o.left - exagerate, o.top + e.height() + exagerate)
    )
  }
}
function barycenter(coords1,coords2) {
  return new Array(
    Math.ceil((coords1[0] + coords2[0]) / 2),
    Math.ceil((coords1[1] + coords2[1]) / 2)
  )
}
function getHandlersCoords(blkEl) {
  var c = getCornersCoords(blkEl);
  var b = new Array();
  //FIRST OPTION: all handlers
  //$.each(c, function(idx,val){
  //  b.push(barycenter(c[idx], c[(1+idx)%4]));
  //});
  //return b.concat(c)
  //
  //SECOND OPTION: only horizontal
  //b.push(barycenter(c[0], c[1]));
  //b.push(barycenter(c[2], c[3]));
  //return b.concat(c)
  //
  //THIRD OPTION: only barycenters
  //$.each(c, function(idx,val){
  //  b.push(barycenter(c[idx], c[(1+idx)%4]));
  //});
  //return b
  //
  //FOURTH OPTION: only horizontal barycenters
  b.push(barycenter(c[0], c[1]));
  b.push(barycenter(c[2], c[3]));
  return b
}
function distanceBetween(coords1,coords2) {
  return Math.sqrt(Math.pow(coords2[0] - coords1[0], 2) + Math.pow(coords2[1] - coords1[1], 2))
}
function minDistanceCoords(coordsAry1, coordsAry2) {
  var min = null;
  var coords = null;
  var numpoints = coordsAry1.length; numpoints = numpoints / 2
  var center1 = barycenter(coordsAry1[0],coordsAry1[numpoints]);
  var center2 = barycenter(coordsAry2[0],coordsAry2[numpoints]);
  //console.log("center1 :"+center1[0]+","+center1[1]);
  //console.log("center2 :"+center2[0]+","+center2[1]);
  $.each(coordsAry1, function(idx1,val1){
    $.each(coordsAry2, function(idx2,val2){
      dst = distanceBetween(val1,val2) + distanceBetween(center1,val1) + distanceBetween(center2,val2);
      if (min == null || dst <= min - bias) { 
        min = dst;
        //console.log("distance:"+dst);
        //console.log("new coords:"+idx1+","+idx2);
        coords = new Array(val1,val2);
      }
    });
  });
  return coords
}
function minDistanceHandlers(blkEl1,blkEl2) {
  return minDistanceCoords(getHandlersCoords(blkEl1),getHandlersCoords(blkEl2))
}
//draws arrows
//see: http://deepliquid.com/blog/archives/98
function drawFilledPolygon(ctx,shape,color) {
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.moveTo(shape[0][0],shape[0][1]);
  for(p in shape) {
    if (p > 0) { ctx.lineTo(shape[p][0],shape[p][1]); }
  }
  ctx.lineTo(shape[0][0],shape[0][1]);
  ctx.fill();
};
function translateShape(shape,x,y) {
  var rv = [];
  for(p in shape)
    rv.push([ shape[p][0] + x, shape[p][1] + y ]);
  return rv;
};
function rotateShape(shape,ang) {
  var rv = [];
  for(p in shape)
    rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
  return rv;
};
function rotatePoint(ang,x,y) {
  return [
    (x * Math.cos(ang)) - (y * Math.sin(ang)),
    (x * Math.sin(ang)) + (y * Math.cos(ang))
  ];
};
function drawLineArrow(ctx,x1,y1,x2,y2,color) {
  ctx.beginPath();
  ctx.lineWidth=1;
  ctx.strokeStyle=color;
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  var ang = Math.atan2(y2-y1,x2-x1);
  drawFilledPolygon(ctx,translateShape(rotateShape(arrow,ang),x2,y2),color);
};
