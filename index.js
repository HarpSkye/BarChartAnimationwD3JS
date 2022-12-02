const jsonURL = 'https://pkgstore.datahub.io/core/gdp/gdp_json/data/1a2503aa36368933be8f9a96e1dc16de/gdp_json.json'

// set variables
const h = 800;
const w = 800;
const p = 50;

d3.json(jsonURL).then(data => {
    //get data ready
        const result = data.filter(d => d['Country Code'] ==='ARB');

        let year = [];
        var parseTime = d3.timeParse("%Y");
        for (let obj of result){
            year.push(parseTime(obj['Year']))
        }

        let value = [];
        for (let obj of result){value.push(obj["Value"])};

        //set range
        const xScale = d3.scaleTime().domain([d3.min(year), d3.max(year)]).range([p, w-p]);
        const yScale = d3.scaleLinear().domain([d3.min(value), d3.max(value)]).range([h-p,p*1.5]);
 
        //set axis 
        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')).ticks(20);
        var yAxis = d3.axisLeft(yScale).tickFormat(d => {return d/100000000000 +'T'}).ticks(20);
    
        //set div for tooltip
        const tooltip = d3.select('body').append('div')
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style('opacity', 0)
            .style('border', 'solid')
            .style('border-width', '0px')
            .style('border-radius', '15px')
            .style('padding', '10px')
            .style('background-color', 'beige')

        //set canvas
        const svg = d3.select('body')
                .append('svg')
                .attr('width', w)
                .attr('height', h)

    //create animated bar chart
    const animate =  svg.selectAll('rect')
        .data(result)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => {return xScale(parseTime(d.Year))})
        .attr('y', (d) => {return yScale(d.Value)})
        .attr('width', 0)
        .attr('height', (d) => {return h - yScale(d.Value)-p})
        .attr('fill', 'steelblue')

    animate.transition() 
        .duration(100)
        .attr('width', 10)
        .delay(function(d,i){return i*50})
    
    animate
        .on('mouseover', function(event, d){d3.select(this).attr('fill', 'orange');                                 
                                    tooltip 
                                     .html('Year: '+ `${d.Year}` + '<br />' + 'GDP: $'+`${d.Value}`)   
                                     .style('left', d3.select(this).attr('x') +'px')       
                                     .style('top', d3.select(this).attr('y') +'px')

                                     tooltip.style('opacity', 1);
                                     tooltip.attr('data-date', d.Year); 
                                    })   
        .on('mouseout', function(){d3.select(this).attr('fill', 'steelblue');
                                    tooltip.style('opacity', 0)}) 

    
    //create svg title
    svg.append('text')
        .attr('x', w/2)
        .attr('y', p)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .style('text-decoration', 'underline')
        .attr('id', 'title')
        .text('World GDP: Arabic')

    //set axis in canvas
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${w-p})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${p}, 0)`) 
        .call(yAxis)

    })

