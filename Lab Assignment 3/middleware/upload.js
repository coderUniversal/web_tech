const multer = require("multer");
const path = require("path");

// Configure storage: where to save files and how to name them
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Save to public/uploads/
    },
    filename: function (req, file, cb) {
        // timestamp + original filename to avoid duplicates
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// File filter: allow only image types
const fileFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
};

// Create the multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;