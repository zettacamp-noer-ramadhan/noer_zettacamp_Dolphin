const router = require('express').Router()
const middleware = require('../middleware/auth.middleware')
const bookshelfService = require('../service/bookshelf.service')

// playground; OK, multiple ids, through body
// router.post('/playground', middleware, async (req, res) => {
//     const [status, data] = await bookshelfService.getBooksFilter(req.body.bookIds)
//     return res.status(status).json(data)
// })

// create a bookshelf; OK
router.post('/bookshelves', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.create(req.body.name)
    return res.status(status).json(data)
})

// insert books to a bookshelf; OK
router.post('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.insert(req.params.id, req.body)
    return res.status(status).json(data)
})

// get all bookshelf that contain a book with certain id; OK, single id
// get all bookshelves; OK
// with query
router.get('/bookshelves', middleware, async (req, res) => {
    if (Object.keys(req.query).length > 0 && !req.query.bookId) {
        return res.status(400).json({ message: 'wrong query parameter' })
    }

    const [status, data] = req.query?.bookId
        ? await bookshelfService.getBookshelvesFilter(req.query.bookId)
        : await bookshelfService.getMany()

    return res.status(status).json(data)
})

// get a bookshelf; OK
router.get('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.get(req.params.id)
    return res.status(status).json(data)
})

// update a bookshelf (name only); OK
router.put('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.update(req.params.id, req.body.name)
    return res.status(status).json(data)
})

// delete all bookshelves; OK
router.delete('/bookshelves', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.deleteMany()
    return res.status(status).json(data)
})

// delete a bookshelf; OK
router.delete('/bookshelves/:id', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.delete(req.params.id)
    return res.status(status).json(data)
})

// remove all books from a bookshelf; OK
router.delete('/bookshelves/:id/books', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.removeMany(req.params.id)
    return res.status(status).json(data)
})

// remove a book from a bookshelf; OK
router.delete('/bookshelves/:bookshelfId/books/:bookId', middleware, async (req, res) => {
    const [status, data] = await bookshelfService.remove(req.params.bookshelfId, req.params.bookId)
    return res.status(status).json(data)
})

module.exports = router