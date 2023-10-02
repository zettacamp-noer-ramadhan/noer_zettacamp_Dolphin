const DataLoader = require('dataloader')
const authorService = require('../../service/author.service')

const loader = new DataLoader(async (keys) => {

    const [_, data] = await authorService.getMany()
    const dataMap = new Map()

    data.forEach(item => dataMap.set(String(item._id), item))

    return keys.map(key => dataMap.get(String(key)))
})

module.exports = loader