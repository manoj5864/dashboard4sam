// d3.legend.js
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

export function legend(g) {
  g.each(function () {
    var g = d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box", true)
        .style("height", (24 * items.length) + "px")
        .style("width", "120px")
    li.enter().append("g").classed("legend-items", true)

    svg.selectAll("[data-legend]").each(function () {
      var self = d3.select(this)
      items[self.attr("data-legend")] = {
        pos: self.attr("data-legend-pos") || this.getBBox().y,
        color: self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
      }
    })

    items = d3.entries(items).sort(function (a, b) {
      return a.value.pos - b.value.pos
    })


    li.selectAll("text")
        .data(items, function (d) {
          return d.key
        })
        .call(function (d) {
          d.enter().append("text")
        })
        .call(function (d) {
          d.exit().remove()
        })
        .attr("y", function (d, i) {
          return (i * 2) + "em"
        })
        .attr("x", "1em")
        .text(function (d) {
          ;
          return d.key
        })
        .attr('class', function (d) {
          return d.key
        })

    li.selectAll("circle")
        .data(items, function (d) {
          return d.key
        })
        .call(function (d) {
          d.enter().append("circle")
        })
        .call(function (d) {
          d.exit().remove()
        })
        .attr("cy", function (d, i) {
          return (i * 2) - 0.35 + "em"
        })
        .attr("cx", 0)
        .attr("r", "0.5em")
        .style("fill", function (d) {
          console.log(d.value.color);
          return d.value.color
        })
        .attr('class', function (d) {
          return d.key
        })
        .style("opacity", "1")
        .on('click', function (d) {
          var selectedCircle = this
          var unselectedCircles = d3.selectAll("circle")[0].filter(function (x) {
            return x.style.fill !== this.style.fill
          }, this)
          this.style.opacity = 1
          var doubleClick = false
          unselectedCircles.forEach(function (x) {
            if (x.style.opacity < 1) {
              doubleClick = true
              return
            }
          })
          if (doubleClick) {
            d3.selectAll(".node")
                .select("rect")
                .style("opacity", "1")
            d3.selectAll("circle")
                .style("opacity", "1")
          }
          else {
            console.log("not a double click")
            var nodesToBeSelected = d3.selectAll(".node")
                .select("rect")
                .filter(getRectsWithSameClass.bind(this, this.attributes.class.value))
            nodesToBeSelected.style("opacity", ".5")


            unselectedCircles.forEach(function (x) {
              d3.select(x)
                  .style("opacity", ".5")
            })
          }
          function getRectsWithSameClass(elem, x) {
            return x._instanceName !== elem
          }
        })

    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()
    lb.attr("x", (lbbox.x - legendPadding))
        .attr("y", (lbbox.y - legendPadding))
        .attr("height", (lbbox.height + 2 * legendPadding))
        .attr("width", (lbbox.width + 2 * legendPadding))
  })
  return g
}