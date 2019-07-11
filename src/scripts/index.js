import { select } from 'd3-selection'
import { csv } from 'd3-fetch'
import { scaleLinear, scalePoint} from 'd3-scale'
import { group, sum } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { randomUniform } from 'd3-random'

import '../styles/style.css'

import '../data/WF19SessionHeadcounts.csv'


const main = select('main')
const svg = select('svg')

const hwratio = 1.25

const width = main.node().getBoundingClientRect().width
const height = width * hwratio
const margin = height * .12
const gheight = height - (margin * 3)
const gwidth = width

svg.attr('height', height).attr('width', width)

const g = svg.append('g').attr('transform', `translate(0, ${margin})`)
const axisG = svg.append('g')

const drawChart = data => {
    const groupedData = Array.from(group(data, d => d.track))
        .map(d => ({track: d[0], sessions: d[1]}))
        .map(d => {
            d.totalHeadCount = sum(d.sessions, ds => ds.headcount)
            return d
        })

    debugger
    
    const tracks = groupedData.map(d => d.track).sort()

    const max = 100
    const min = 0

    const scaleHor = scaleLinear()
        .domain([min, max])
        .range([8, gwidth - 8])

    const scaleVer = scalePoint()
        .domain(tracks)
        .range([0, gheight])

    const jigger = randomUniform(-5, 5)

    const xAxis = axisBottom(scaleHor).ticks(5)

    const text = g.selectAll('text')
        .data(groupedData)
        .enter()
        .append('text')
        .text(d => `${d.track} (${d.totalHeadCount})`)
        .attr('x', scaleHor(min))
        .attr('y', d => scaleVer(d.track) - 15)

    const lineSpacer = 0

    const line = g.selectAll('line')
        .data(tracks)
        .enter()
        .append('line')
        .attr('x1', scaleHor(min))
        .attr('x2', scaleHor(max))
        .attr('y1', d => scaleVer(d) + lineSpacer)
        .attr('y2', d => scaleVer(d) + lineSpacer)
        .attr('stroke', '#d3d3d3')
        .attr('stroke-width', .75)

    const circle = g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 4.5)
        .attr('cx', d => scaleHor(d.headcount))
        .attr('cy', d => scaleVer(d.track) + lineSpacer + jigger())
        .attr('stroke', '#3c7ee8')
        .attr('fill', '#fff')
        // .attr('fill-opacity', 0 )

    axisG.call(xAxis).attr('transform', `translate(0, ${gheight + (margin * 1.75)})`)
    axisG.selectAll('line').attr('stroke-width', .75).attr('stroke', '#d3d3d3')
    axisG.selectAll('path').attr('stroke-width', .75).attr('stroke', '#d3d3d3')
    axisG.selectAll('text').attr('color', '#808080')

    svg.append('text').text('Head Count')
        .attr('x', scaleHor(0))
        .attr('y', 0)
        .attr('transform', `translate(0, ${2 * margin + gheight + 15})`)
        .attr('font-size', 12)
        .attr('fill', '#808080')
        .attr('stroke-width', .5)
    
    svg.append('circle')
        .attr('r', 4.5)
        .attr('cx', scaleHor(0))
        .attr('cy', 8)
        .attr('stroke', '#3c7ee8')
        .attr('fill', '#fff')
    
    svg.append('text')
        .text('- Session')
        .attr('x', 16)
        .attr('y', 12)
        .attr('font-size', 12)

}

async function m() {
    const data = await csv('./data/WF19SessionHeadcounts.csv', d => {
        return {
            track: d.Track,
            number: +d['Session Number'],
            title: d['Session Title'],
            headcount: +d['Session Headcount']
        }
    }).then(data => data.filter(d => d.headcount > 0))

    drawChart(data)
}

m()