const fs = require('fs')
const path = require('path')

let dataCache = null

function loadData() {
    if (!dataCache) {
        const file = path.resolve(__dirname, './mock/data.json')
        const data = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }))
        const reports = Array.from(data.dailyReports)
        dataCache = {}
        reports.forEach((report) => {
            dataCache[report.updatedDate] = report
        })
    }
    return dataCache
}

function getCoronavirusKeyIndex() {
    return Object.keys(loadData())
}

function getCoronavirusByDate(date) {
    console.log(date)
    const dailyData = loadData()[date] || {}
    if (dailyData.countries) {
        dailyData.countries.sort((a, b) => {
            return b.confirmed - a.confirmed
        })
    }
    return dailyData
}

module.exports = {
    getCoronavirusKeyIndex,
    getCoronavirusByDate
}
