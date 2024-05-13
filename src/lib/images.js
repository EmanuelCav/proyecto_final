import multer from 'multer';

const storageDocuments = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "documents")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname)
    }
})

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "products")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname)
    }
})

const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "profiles")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname)
    }
})

export const documents = multer({
    storage: storageDocuments,
    limits: {
        fieldSize: 1000 * 1000
    }
})

export const profiles = multer({
    storage: storageProfiles,
    limits: {
        fieldSize: 1000 * 1000
    }
})

export const upload = multer({
    storage: storageProducts,
    limits: {
        fieldSize: 1000 * 1000
    }
})