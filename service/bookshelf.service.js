const mongoose = require('mongoose')
const bookModel = require('../model/book.model')
const bookshelfModel = require('../model/bookshelf.model')

const bookshelves = {}

// create a bookshelf; OK, used
bookshelves.create = async (bookshelfName) => {

    const bookshelfData = await bookshelfModel
        .create({ name: bookshelfName, books: [] })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData?.err) return [bookshelfData.status, bookshelfData.err]

    return [200, {
        message: 'bookshelf created',
        detail: bookshelfData
    }]
}

// insert books to a bookshelf; OK, used
bookshelves.insert = async (bookshelfId, { bookIds }) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const bookshelfData = await bookshelfModel
        .findOne({ _id: validBookshelfId })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData?.err) return [bookshelfData.status, bookshelfData.err]

    for (let bookId of bookIds) {


        const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isBookIdValid) return [400, { message: 'invalid book id' }]

        const validBookId = mongoose.Types.ObjectId(bookId)

        const bookRead = await bookModel
            .find({ _id: validBookId })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (bookRead?.err) return [bookRead.status, bookRead.err]

        if (!bookRead) return [400, { message: 'book id not exist' }]

        const insertedData = await bookshelfModel
            .updateOne({ _id: validBookshelfId }, { $addToSet: { books: validBookId } })
            .catch(err => ({ status: 500, err }))
            .then(data => data)

        if (insertedData?.err) return [insertedData.status, insertedData.err]

        // bookshelfData.books.push(validBookId)
        // const bookshelfSave = await bookshelfData
        //     .save()
        //     .catch(err => ({ status: 500, err }))

        // if (bookshelfSave?.err) return [bookshelfSave.status, bookshelfSave.err]
    }

    return [200, {
        message: 'books added to bookshelf',
        detail: bookshelfData
    }]
}

// get all bookshelves that contain a certain book; OK, used
bookshelves.getBookshelvesFilter = async (bookId) => {
    const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
    if (!isBookIdValid) return [400, { message: 'invalid book id' }]

    const validBookId = mongoose.Types.ObjectId(bookId)

    const bookshelvesData = await bookshelfModel
        .find({ books: { $eq: validBookId } })
        .populate({
            path: 'books',
            select: '-__v',
            populate: {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        })
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelvesData?.err) return [bookshelvesData.status, bookshelvesData.err]

    if (bookshelvesData.length === 0) return [200, {
        message: 'no bookshelves fetched',
        detail: 'empty library'
    }]

    return [200, {
        message: 'bookshelves fetched',
        detail: bookshelvesData
    }]
}

// get all bookshelves that contain one of certain books; OK
// bookshelves.getBooksFilter = async (bookIds) => {

//     const validBookIds = []

//     for (let bookId of bookIds) {
//         const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
//         if (!isBookIdValid) return [400, { message: 'invalid book id' }]

//         const validBookId = mongoose.Types.ObjectId(bookId)

//         const bookRead = await bookModel
//             .find({ _id: validBookId })
//             .catch(err => ({ status: 500, err }))
//             .then(data => data)

//         if (bookRead?.err) return [bookRead.status, bookRead.err]

//         if (!bookRead) return [400, { message: 'book id not exist' }]

//         validBookIds.push(validBookId)
//     }

//     const bookshelvesData = await bookshelfModel
//         .find({ books: { $in: validBookIds } })
//         .populate({
//             path: 'books',
//             select: '-__v',
//             populate: {
//                 path: 'author',
//                 model: 'Author',
//                 select: 'name'
//             }
//         })
//         .select('-__v')
//         .catch(err => ({ status: 500, err }))
//         .then(data => data)

//     if (bookshelvesData?.err) return [bookshelvesData.status, bookshelvesData.err]

//     if (bookshelvesData.length === 0) return [200, {
//         message: 'no bookshelves fetched',
//         detail: 'empty library'
//     }]

//     return [200, {
//         message: 'filter result',
//         detail: bookshelvesData
//     }]
// }

// get a bookshelf; OK, used
bookshelves.get = async (bookshelfId) => {

    const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isValidId) return [400, { message: 'invalid id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const bookshelfData = await bookshelfModel
        .findOne({ _id: validBookshelfId })
        .populate({
            path: 'books',
            select: '-__v',
            populate: {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        })
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData?.err) return [bookshelfData.status, bookshelfData.err]

    if (!bookshelfData) return [200, {
        message: 'no bookshelf fetched',
        detail: 'bookshelf not found'
    }]

    return [200, {
        message: 'bookshelf fetched',
        detail: bookshelfData
    }]
}

// get all bookshelves; OK, used
bookshelves.getMany = async () => {

    const bookshelfData = await bookshelfModel
        .find()
        .populate({
            path: 'books',
            select: '-__v',
            populate: {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        })
        .select('-__v')
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData?.err) return [bookshelfData.status, bookshelfData.err]

    if (bookshelfData.length === 0) return [200, {
        message: 'no bookshelves fetched',
        detail: 'empty library'
    }]

    return [200, {
        message: 'bookshelves fetched',
        detail: bookshelfData
    }]
}

// update a bookshelf (name only); OK, used
bookshelves.update = async (bookshelfId, bookshelfName) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const bookshelfData = await bookshelfModel
        .updateOne({ _id: validBookshelfId }, { $set: { name: bookshelfName } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (bookshelfData?.err) return [bookshelfData.status, bookshelfData.err]

    if (!bookshelfData) return [200, {
        message: 'no bookshelf fetched',
        detail: 'bookshelf not found'
    }]

    return [200, {
        message: 'bookshelf fetched',
        detail: bookshelfData
    }]
}

// delete a bookshelf; OK, used
bookshelves.delete = async (bookshelfId) => {

    const isValidId = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isValidId) return [400, { message: 'invalid id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const deletedBookshelf = await bookshelfModel
        .deleteOne({ _id: validBookshelfId })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    // todo: check matched document returnedd by mongodb

    if (deletedBookshelf?.err) return [deletedBookshelf.status, deletedBookshelf.err]

    if (!deletedBookshelf) return [200, {
        message: 'no bookshelf deleted',
        detail: 'bookshelf not found'
    }]

    return [200, {
        message: 'bookshelf deleted',
        detail: deletedBookshelf
    }]
}

// delete all bookshelves; OK, used
bookshelves.deleteMany = async () => {

    const deletedBookshelves = await bookshelfModel
        .deleteMany()
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    // todo: check matched document returned by mongodb

    if (deletedBookshelves?.err) return [deletedBookshelves.status, deletedBookshelves.err]

    return [200, {
        message: 'bookshelves deleted',
        detail: deletedBookshelves
    }]
}

// remove a book from a bookshelf; OK, used
bookshelves.remove = async (bookshelfId, bookId) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const isBookIdValid = mongoose.Types.ObjectId.isValid(bookId)
    if (!isBookIdValid) return [400, { message: 'invalid book id' }]

    const validBookId = mongoose.Types.ObjectId(bookId)

    const removed = await bookshelfModel
        .updateOne({ _id: validBookshelfId }, { $pull: { books: { $in: validBookId } } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removed?.err) return [removed.status, removed.err]

    return [200, {
        message: 'book removed from a bookshelf',
        detail: removed
    }]
}

// remove all books from a bookshelf; OK, used
bookshelves.removeMany = async (bookshelfId) => {

    const isBookshelfIdValid = mongoose.Types.ObjectId.isValid(bookshelfId)
    if (!isBookshelfIdValid) return [400, { message: 'invalid bookshelf id' }]

    const validBookshelfId = mongoose.Types.ObjectId(bookshelfId)

    const removed = await bookshelfModel
        .updateOne({ _id: validBookshelfId }, { $set: { books: [] } })
        .catch(err => ({ status: 500, err }))
        .then(data => data)

    if (removed?.err) return [removed.status, removed.err]

    return [200, {
        message: 'book removed from a bookshelf',
        detail: removed
    }]
}

module.exports = bookshelves