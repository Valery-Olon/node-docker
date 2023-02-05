const User = require("../models/userModel");

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users,
            },
        });
    }   catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};
//localhost:3000/api/v1/users/:id

exports.getOneUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status: "success",
        
            data: {
                user,
            },
        });
    }   catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

// exports.createUser = async (req, res, next) => {
//     try {
//         const user = await User.create(req.body);

//         res.status(200).json({
//             status: "success",
//             data: {
//                 user,
//             },
//         });
//     }   catch (e) {
//         //console.log(e),
//         res.status(400).json({
//             status: "fail",
//         });
//     }
// };

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
        
            data: {
                user,
            },
        });
    }   catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
        });
    }   catch (e) {
        res.status(400).json({
            status: "fail",
        });
    }
};