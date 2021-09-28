var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

d3.json(url,function(response){
  //console.log(response);
  scatterPlot(response);
})

function scatterPlot(data){
  var height = 770;
  var width = 1000;
  
  var padding = {
    top: 100, 
    bottom: 70,
    left: 100,
    right: 150
  };
  
  var graphHeight = height - padding.top- padding.bottom;
  var graphWidth = width - padding.left - padding.right;
      
  var getDateObject = d3.timeParse("%M:%S");
  data.forEach(function(d){ 
    d.date =  getDateObject(d.Time);
  });
  
  var xscale= d3.scaleTime()
    .domain(d3.extent(data,function(d){ return d.date;}))
    .range([graphWidth,0])
    .nice();
     
  var yscale = d3.scaleLinear()
  .domain([
    d3.min( data, function(d){ return d.Place} ),
    d3.max( data, function(d){ return d.Place} )
  ])
  .range([0,graphHeight]);
  
  var xaxis = d3.axisBottom().scale(xscale).tickFormat(d3.timeFormat("%M:%S"));
  var yaxis = d3.axisLeft().scale(yscale);
 
  var tooltip = d3.tip()
    .html(function(d){ return "<span class='name'>"+ d.Name + "&ensp;-&ensp;" + d.Nationality +"</span></br><span class='record'>Rank:</span>"+ d.Place +"<span class='record'>Year:</span>"+ d.Year + "<span class='record'>Time:</span>" + d.Time + "</span></br><p class='case'>" + (d.Doping !== "" ? d.Doping: 'Case Clean')+ "</p>"});
  

  function handleMouseover(d){  
    if(d.Place < 10)  
        tooltip.attr("class","tooltip south").direction("s").offset([27,0]);   
    else
        tooltip.attr("class","tooltip north").direction("n").offset([-20,0]);     
    tooltip.show(d);
  }
  
  //ToolTip
  var svg = d3.select("svg")
    .attr("height",height)
    .attr("width",width)
    .append("g")
    .attr("id","svg")
    .attr("transform","translate("+ padding.left +","+ padding.top + ")")
    .call(tooltip);
  
  //X axis
  svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(5,"+ graphHeight+")")
    .call(xaxis)
    .append("text")
    .attr("class","xLabel")
    .attr("x",graphWidth/2)
    .attr("dy","50")
    .text("Minutes behind fastest time");
  //Y axis
  svg.append("g")
    .attr("class","y axis")
    .attr("transform","translate(0,-15)")
    .call(yaxis)
    .append("text")
    .attr("class","yLabel")
    .attr("y",graphHeight/2)
    .attr("dy","-40")
    .attr("transform","rotate(-90,0,"+ (graphHeight/2)+")")
    .text("Ranking");
  
  //DataGroup
  var group = svg.append("g")
    .attr("transform","translate(5,-15)");
  
  var dataGroup = group
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class","datapoint")
    .on("mouseover",function(d){ 
       d3.select(this).classed("highlight",true);
       handleMouseover(d);
     })
    .on("mouseout",function(d){ 
       d3.select(this).classed("highlight",false);
       tooltip.hide();
     });
  
  //Circles - Data-Point Circle
  dataGroup.append("circle")
    .attr("cx",function(d){ return xscale(d.date)})
    .attr("cy",function(d){ return yscale(d.Place)})
    .attr("r","5")
    .attr("class",function(d){ return (d.Doping === "" ? "dots no-drug" : "dots on-drug");});
  
  //Texts -Data-Point Name
  dataGroup.append("text")
    .text(function(d){ return d.Name})
    .attr("class","point-name")
    .attr("x",function(d){ return xscale(d.date);})
    .attr("y",function(d){ return yscale(d.Place);})
    .attr("dy","5px")
    .attr("dx","10px");

  //Legend
  var legendSpacing = 40;
  var symbolSpace = 10;
  var circleRadius = 5;
  var legendHeight = 50;
  
  var l = svg.append("g")
    .attr("class","legendBox")
    .attr("transform","translate(0,"+ (-1 * legendHeight) +")");
  
  l.append("circle")
    .attr("r",circleRadius)
    .attr("class","dots on-drug")
    .attr("cx",legendSpacing);
  
  l.append("text")
    .text("Riders With Doping Allegations")
    .attr("x",legendSpacing)
    .attr("dx", symbolSpace)
    .attr("dy",circleRadius);
  
  l.append("circle")
    .attr("r",circleRadius)
    .attr("class", " dots no-drug")
    .attr("cx",(legendSpacing + 260));
  
  l.append("text")
    .text("No Doping Allegations")
    .attr("x",(legendSpacing + 260))
    .attr("dx",symbolSpace)
    .attr("dy",circleRadius);
  
  
}