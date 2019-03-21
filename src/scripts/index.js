import { select } from 'd3-selection'
import { csv } from 'd3-fetch'

import '../styles/style.css'

import '../data/WF19SessionHeadcounts.csv'


const main = select('main')
const svg = select('svg')

const hwratio = .6

const width = main.node().getBoundingClientRect().width
const height = width * hwratio
const margin = width * .05
const gheight = height - margin - margin
const gwidth = width -  margin - margin

svg.attr('height', height).attr('width', width)

const g = svg.append('g').attr('transform', `translate(${margin}, ${margin})`)

(async () => {
    const data = await csv('./data/WF19SessionHeadcounts.csv', d => {
        return {
            track: d.Track,
            number: +d['Session Number'],
            title: d['Session Title'],
            headcount: +d['Region X Headcount']
        }
    })

    console.log(data)
})

// csv('./data/WF19SessionHeadcounts.csv', (data) => {
//     return {
//         track: data.Track,
//         number: +data['Session Number'],
//         title: data['Session Title'],
//         headcount: +data['Region X Headcount']
//     }
// }).then(data => console.dir(data))
