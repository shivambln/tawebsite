const express = require('express');
const router = express.Router();
const Crypter = require('cryptr');
const cryptr = new Crypter('Jangir');
const mongoose = require('mongoose');
const ProjectModel = mongoose.model('project');
const Post = mongoose.model('post');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const paginate = require('jw-paginate');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const configAuth = require('./auth');
let jwt = require('jsonwebtoken');
const passport = require('passport');
const tokenList = {};

/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/admin/register admin register
 * @apiGroup Admin
 * @apiSuccessExample {json} Register Success
 *    HTTP/1.1 200 OK
 *    [{
 *      status:ture,
 *      message:"register successfull!!"
 *    }]
 *      HTTP/1.2 200 OK (User already exits)
 *    [{
 *      status:false,
 *      message:"uae"
 *    }]
 *      HTTP/1.3 200 OK (Email already exits)
 *    [{
 *      status:false,
 *      message:"eae"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

router.post('/api/admin/register', (req, res) => {
    ProjectModel.find({ email: req.body.email }, (err, docs) => {
        if (err) throw err;
        else {
            if (docs[0] == null) {
                ProjectModel.find({ username: req.body.username }, (err, docs) => {
                    if (docs[0] == null) {
                        var projectmodel = new ProjectModel();
                        projectmodel.email = req.body.email;
                        projectmodel.username = req.body.username;
                        projectmodel.password = cryptr.encrypt(req.body.password);
                        projectmodel.save((err, docs) => {
                            if (err) {
                                console.log('Error in saving data');
                            } else {
                                res.status(200).json({
                                    status: true,
                                    message: "register successfull!!"
                                });
                            }
                        });
                    } else {
                        res.status(200).json({
                            status: false,
                            message: "uae"
                        });
                    }
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: "eae"
                });
            }
        }
    });
});


/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/admin/login admin login
 * @apiGroup Admin
 * @apiSuccessExample {json} login Success
 *    HTTP/1.1 200 OK
 *    [{
 *      status: true,
 *      message: "login successfull!!"
 *    }]
 *      HTTP/1.2 404 Not Found
 *    [{
 *      status: false,
 *      message: "user not found!!"
 *    }]
 *      HTTP/1.3 401 Unauthorized (Wrong password)
 *    [{
 *      status:false,
 *      message:"eae"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

router.post('/api/admin/login', (req, res) => {
    console.log('raja');
    const eou = req.body.username;
    const password = req.body.password;
    ProjectModel.find({ email: eou }, (err, docs) => {
        if (err) {
            console.log('err');
        } else {
            if (docs[0] == null) {
                ProjectModel.find({ username: eou }, (err, docs) => {
                    if (docs[0] == null) {
                        res.status(404).json({
                            status: false,
                            message: "user not found!!"
                        });
                    } else {
                        if (password == cryptr.decrypt(docs[0].password)) {
                            res.status(200).json({
                                status: true,
                                message: "login successfull!!"
                            });
                        } else {
                            res.status(401).json({
                                status: false,
                                message: "Wrong Password!!"
                            });
                        }
                    }
                });
            } else {
                if (password == cryptr.decrypt(docs[0].password)) {
                    res.status(200).json({
                        status: true,
                        message: "login successfull!!"
                    });
                } else {
                    res.status(401).json({
                        status: false,
                        message: "Wrong Password!!"
                    });
                }
            }
        }
    });
});


/**
 * created by Nitesh Jangir
 * 
 * @api {get} /api/user/allpost Website panel all posts
 * @apiGroup Website
 * @apiSuccessExample {json} login Success
 *    HTTP/1.1 200 OK
 *    [{
 *      status: true,
 *      message: docs
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 *     [{
 *       status: true,
 *       message: 'Internal Server Error.'
 *     }]
 */


router.get('/api/user/allpost/:pagenumber', (req, res) => {
    console.log('shivam');
    let pagenumber = req.params.pagenumber;
    const token = req.headers["authorization"];

    console.log(token);
    jwt.verify(token, "my_secret_key", (err, jwtdocs) => {
        if (err) {
            res.status(401).json({
                status: 401,
                message: 'refreshToken'
            });
        } else {
            console.log(jwtdocs.tempusername);
            Post.find({}, (err, docs) => {
                if (err) {
                    res.status(500).json({
                        status: true,
                        message: 'Internal Server Error.'
                    });
                } else {
                    const item = docs;
                    const page = pagenumber;
                    const pagesize = 5;
                    const pager = paginate(item.length, page, pagesize);
                    const pageOfItems = item.slice(pager.startIndex, pager.endIndex + 1);
                    res.status(200).json({
                        status: true,
                        message: pager,
                        pageOfItems
                    });
                }
            });
        }
    })
});

router.get('/api/searchitem/:searchData/:pagenumber', (req, res) => {
    let searchData = req.params.searchData;
    let pagenumber = req.params.pagenumber;
    Post.find({ title: { $regex: searchData, $options: "$i" } }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            const item = doc;
            console.log(item);
            const page = pagenumber;
            const pageSize = 5;
            const pager = paginate(item.length, page, pageSize);
            const pageOfItems = item.slice(pager.startIndex, pager.endIndex + 1);
            console.log(pageOfItems);
            return res.json({ pager, pageOfItems })
        }
    })
});

/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/adminpost/create/:admin Create post by admin
 * @apiGroup Admin
 * @apiParam {admin} admin
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      status: true,
 *      message: 'successfull created.'
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */

router.post('/api/adminpost/create/:admin', (req, res) => {
    const admin = req.params.admin;
    const post = new Post();
    post.creater = admin;
    post.title = req.body.title;
    post.description = req.body.description;
    post.url = req.body.website;
    post.image = req.body.image;
    post.location = req.body.city;
    post.like = [];
    post.comment.userid = '';

    post.save((err, docs) => {
        if (err) {
            res.status(500).json({
                status: true,
                message: 'Server side error'
            });
        } else {
            console.log('HO GYOI');
            res.status(200).json({
                status: true,
                message: 'successfull created.'
            });
        }
    });
});

/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/adminpost/show/:admin/:page Show post by admin with pagination
 * @apiGroup Admin
 * @apiParam {admin} admin
 * @apiParam {page} Page
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      status: true,
 *      pager:'{
        "totalItems": Number,
        "currentPage": "Number",
        "pageSize": 5,
        "totalPages": Number,
        "startPage": 1,
        "endPage": Number,
        "startIndex": 0,
        "endIndex": Number,
        "pages": Array
        }'
        pageOfItems:{
            like:Array,
            comment:{
                username:String,
                comment:String
            },
            _id:Object_id,
            creater:String,
            title:String,
            description:String,
            url:String,
            image:String(base64),
            location:String
        }
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */

router.post('/api/adminpost/show/:admin/:page', (req, res) => {
    const admin = req.params.admin;
    ProjectModel.find({ $or: [{ email: admin }, { username: admin }] }, (err, docs) => {
        if (err) throw err;
        else {
            Post.find({ $or: [{ creater: docs[0].email }, { creater: docs[0].username }] }, (err, docs) => {
                if (err) {
                    return res.status(500).json({
                        status: true,
                        message: 'Internal server error'
                    });
                } else {
                    // res.status(200).json({
                    //     status: true,
                    //     message: docs
                    // });
                    const items = docs;
                    const page = req.params.page;
                    const pageSize = 5;
                    const pager = paginate(items.length, page, pageSize);
                    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
                    // let picture = console.log(pageOfItems[0].img.data);
                    return res.status(200).json({
                        status: true,
                        pager,
                        pageOfItems
                    });
                }
            });
        }
    });
});

// created by Nitesh Jangir

/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/adminpost/delete/:postid Delete post by admin
 * @apiGroup Admin
 * @apiParam {postid} PostId
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      status: true,
 *      message: 'Successfully deleted!!'
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 *      {
 *          status: true,
 *          message: 'Internal server error'
 *      }
 */

router.post('/api/adminpost/delete/:postid', (req, res) => {
    // const admin = req.params.admin;
    const postid = req.params.postid;
    Post.deleteOne({ _id: postid }, (err) => {
        if (err) {
            res.status(500).json({
                status: true,
                message: 'Internal server error'
            });
        } else {
            // console.log(doc);
            res.status(200).json({
                status: true,
                message: 'Successfully deleted!!'
            });
        }
    });
});

/**
 * created by Nitesh Jangir
 * 
 * @api {post} /api/adminpost/update/:postid Update post by admin
 * @apiGroup Admin
 * @apiParam {postid} PostId
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      status: true,
 *      message: docs
 *    }
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 *      {
 *          status: true,
 *          message: 'Internal server error'
 *      }
 */

// created by Nitesh Jangir
router.post('/api/adminpost/update/:postid', (req, res) => {
    const postid = req.params.postid;
    const post = new Post();
    post.title = req.body.title;
    post.description = req.body.description;
    post.url = req.body.website;
    post.image = req.body.image;
    post.location = req.body.city;
    Post.updateOne({ _id: postid }, {
        $set: {
            'title': post.title,
            'description': post.description,
            'url': post.url,
            'image': post.image,
            'location': post.location
        }
    }, (err, docs) => {
        if (err) {
            res.status(500).json({
                status: true,
                message: 'Internal server error'
            });
        } else {
            res.status(200).json({
                status: true,
                message: docs
            });
        }
    });
});

// created by Nitesh Jangir
router.get('/api/adminpost/:postid', (req, res) => {
    const postid = req.params.postid;
    Post.findOne({ _id: postid }, (err, docs) => {
        if (err) {
            console.log('Error in fetching the details of post');
        } else {
            res.status(200).json({
                status: true,
                message: docs
            });
        }
    });
});

// created by Nitesh Jangir
router.post('/api/post/:postid', (req, res) => {
    console.log('abc');
    const token = req.headers["authorization"];
    jwt.verify(token, "my_secret_key", (err, data) => {
        if (err) {
            res.status(401).json({
                status: 401,
                message: 'refreshToken'
            });
        } else {
            const postid = req.params.postid;
            Post.find({ _id: postid }, (err, docs) => {
                if (err) {
                    console.log('Post id not retrived');
                } else {
                    res.status(200).json({
                        status: true,
                        message: docs
                    })
                }
            });
        }
    });
});

// created by Nitesh Jangir
router.post('/api/adminpost/search/:page/:admin/:sid', (req, res) => {
    const admin = req.params.admin;
    const sid = req.params.sid;
    Post.find({
        $and: [{
            $or: [
                { title: { $regex: sid, $options: "$i" } },
                { description: { $regex: sid, $options: "$i" } },
                { url: { $regex: sid, $options: "$i" } },
                { location: { $regex: sid, $options: "$i" } }
            ]
        }, { creater: admin }]
    }, (err, docs) => {
        if (err) {
            return res.status(500).json({
                status: true,
                message: 'Internal server error'
            });
        } else {
            const items = docs;
            const page = req.params.page;
            const pageSize = 5;
            const pager = paginate(items.length, page, pageSize);
            const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
            // let picture = console.log(pageOfItems[0].img.data);
            return res.status(200).json({
                status: true,
                pager,
                pageOfItems
            });
        }
    });
});

// created by Arup Das
router.post('/api/post/comment/:admin/:postid', (req, res) => {
    const admin = req.params.admin;
    const postid = req.params.postid;
    comme.find({ $and: [{ userid: admin }, { postid: postid }] }, (err, docs) => {
        if (err) throw err;
        else {
            const length = docs.length;
            res.json({ length });
        }
    });
});

// created by Arup Das
router.post('/api/usercomment/:username/:postid/:comment', (req, res) => {
    ///:userid/:postid
    console.log('shikhar');
    //let comment = [req.params.userid] + "$#" + [req.params.comment];
    let username = req.params.username;
    let comment = req.params.comment;
    console.log(comment);
    let postid = req.params.postid;
    console.log(postid);
    Post.updateOne({ _id: postid }, { $push: { 'comment': [{ username, comment }] } }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ doc });
        }
    })
});

// created by Arup Das
router.post('/api/signup', (req, res) => {
    let BCRYPT_SALT_ROUNDS = 10;
    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.profilepic = req.body.myimage;
    bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
            user.password = hashedPassword;
            User.findOne({ email: user.email }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result === null) {
                        user.save((err, doc) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({ doc });
                            }
                        });
                    } else if (result !== null) {
                        let message = "email is already exist";
                        res.json({ message });
                    }
                }
            })
        }).catch((error) => {
            console.log(error);
        })
});

// created by Arup Das
router.post('/api/login', (req, res) => {
    let user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    User.findOne({ email: user.email }, (err, doc) => {
        if (err) {
            console.log(err);
        } else if (doc === null) {
            let message = "email does not exist";
            res.json(message)
        } else if (doc !== null) {
            bcrypt.compare(user.password, doc.password, (err, result) => {
                if (result == true) {
                    let tempid = doc._id;
                    const token = jwt.sign({ tempid }, "my_secret_key", {
                        expiresIn: '20s'
                    });
                    const response = {
                        "status": "Logged in",
                        "token": token,
                        object: tempid
                    }
                    res.json(response);
                } else {
                    let message = "password missmatch";
                    res.json(message);
                }
            })
        }

    })
});

// created by Arup Das
router.get('/api/getuserlike/:postid/:userid', (req, res) => {
    let postid = req.params.postid;
    let userid = req.params.userid;
    Post.find({ _id: postid }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            Post.find({ $and: [{ _id: postid }, { like: userid }] }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result === '') {
                        const totalLike = doc[0].like.length;
                        const userstatus = 0;
                        res.json({ userstatus, totalLike });
                    } else if (result != '') {
                        const totalLike = doc[0].like.length;
                        const userstatus = doc.length;
                        res.json({ userstatus, totalLike });
                    } else {
                        const totalLike = doc[0].like.length;
                        const userstatus = 0;
                        res.json({ userstatus, totalLike });
                    }
                }
            })
        }
    })
});

router.get('/api/getuserdislike/:postid/:userid', (req, res) => {
    let postid = req.params.postid;
    let userid = req.params.userid;
    Post.find({ _id: postid }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            Post.find({ $and: [{ _id: postid }, { dislike: userid }] }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result === '') {
                        const totaldisLike = doc[0].dislike.length;
                        const userstatus = 0;
                        res.json({ userstatus, totaldisLike });
                    } else if (result != '') {
                        const totaldisLike = doc[0].dislike.length;
                        const userstatus = doc.length;
                        res.json({ userstatus, totaldisLike });
                    } else {
                        const totaldisLike = doc[0].dislike.length;
                        const userstatus = 0;
                        res.json({ userstatus, totaldisLike });
                    }
                }
            })
        }
    })
});

// created by Arup Das
router.post('/api/userlike/:userid/:postid', (req, res) => {
    let postid = req.params.postid;
    let userid = req.params.userid;
    Post.find({ _id: postid }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            Post.find({ $and: [{ like: userid }, { _id: postid }] }, (err, doc) => {
                if (err) {
                    console.log('error');
                } else {
                    console.log(doc[0]);
                    if (doc.length != 0) {
                        res.json({
                            message: 'alreadyliked'
                        });
                    } else {
                        Post.find({ dislike: userid }, (err, doc) => {
                            if (err) {
                                console.log('error');
                            } else {
                                if (doc.length != 0) {
                                    Post.updateOne({ _id: postid }, { $push: { 'like': userid } }, (err, docs) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            Post.findOneAndUpdate({ _id: postid }, { $pull: { 'dislike': userid } }, (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    const userstatuslike = 1;
                                                    const userstatusdislike = 0;
                                                    res.json({ userstatuslike, userstatusdislike });
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    Post.updateOne({ _id: postid }, { $push: { 'like': userid } }, (err, docs) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            const userstatuslike = 1;
                                            const userstatusdislike = 0;
                                            res.json({ userstatuslike, userstatusdislike });
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
            });
            // if (doc[0].like != userid && doc[0].dislike === userid) {
            //     Post.updateOne({ _id: postid }, { $push: { 'like': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             Post.findOneAndUpdate({ _id: postid }, { $pull: { 'dislike': userid } }, (err, result) => {
            //                 if (err) {
            //                     console.log(err);
            //                 } else {
            //                     const userstatuslike = 1;
            //                     const userstatusdislike = 0;
            //                     res.json({ userstatuslike, userstatusdislike });
            //                 }
            //             })
            //         }
            //     })
            // }
            // } else if (doc[0].like != userid && doc[0].dislike != userid) {
            //     Post.updateOne({ _id: postid }, { $push: { 'like': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             const userstatuslike = 1;
            //             const userstatusdislike = 0;
            //             res.json({ userstatuslike, userstatusdislike });
            //         }
            //     })
            // } else {
            //     Post.updateOne({ _id: postid }, { $push: { 'like': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             Post.findOneAndUpdate({ _id: postid }, { $pull: { 'dislike': userid } }, (err, result) => {
            //                 if (err) {
            //                     console.log(err);
            //                 } else {
            //                     const userstatuslike = 1;
            //                     const userstatusdislike = 0;
            //                     res.json({ userstatuslike, userstatusdislike });
            //                 }
            //             })
            //         }
            //     })
            // }
        }
    }) //
});

router.post('/api/userdislike/:userid/:postid', (req, res) => {
    let postid = req.params.postid;
    let userid = req.params.userid;
    Post.find({ _id: postid }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            Post.find({ $and: [{ dislike: userid }, { _id: postid }] }, (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    if (doc.length != 0) {
                        res.json({
                            message: 'alreadydisliked'
                        });
                    } else {
                        Post.find({ like: userid }, (err, doc) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (doc.length != 0) {
                                    Post.updateOne({ _id: postid }, { $push: { 'dislike': userid } }, (err, docs) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            Post.findOneAndUpdate({ _id: postid }, { $pull: { 'like': userid } }, (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    const userstatuslike = 0;
                                                    const userstatusdislike = 1;
                                                    res.json({ userstatuslike, userstatusdislike });
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    Post.updateOne({ _id: postid }, { $push: { 'dislike': userid } }, (err, docs) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            const userstatuslike = 0;
                                            const userstatusdislike = 1;
                                            res.json({ userstatuslike, userstatusdislike });
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
            });
            // if (doc[0].like === userid && doc[0].dislike !== userid) {
            //     Post.updateOne({ _id: postid }, { $push: { 'dislike': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             Post.findOneAndUpdate({ _id: postid }, { $pull: { 'like': userid } }, (err, result) => {
            //                 if (err) {
            //                     console.log(err);
            //                 } else {
            //                     const userstatuslike = 0;
            //                     const userstatusdislike = 1;
            //                     res.json({ userstatuslike, userstatusdislike });
            //                 }
            //             })
            //         }
            //     })
            // } else if (doc[0].like != userid && doc[0].dislike != userid) {
            //     Post.updateOne({ _id: postid }, { $push: { 'dislike': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             const userstatuslike = 0;
            //             const userstatusdislike = 1;
            //             res.json({ userstatuslike, userstatusdislike });
            //         }
            //     })
            // } else {
            //     Post.updateOne({ _id: postid }, { $push: { 'dislike': userid } }, (err, docs) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             Post.findOneAndUpdate({ _id: postid }, { $pull: { 'like': userid } }, (err, result) => {
            //                 if (err) {
            //                     console.log(err);
            //                 } else {
            //                     const userstatuslike = 0;
            //                     const userstatusdislike = 1;
            //                     res.json({ userstatuslike, userstatusdislike });
            //                 }
            //             })
            //         }
            //     })
            // }
        }
    }) //
})

// created by Arup Das
router.get('/api/getuserComment/:postid', (req, res) => {
    // let username = req.params.username;
    let postid = req.params.postid;
    Post.find({ _id: postid }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            console.log('comment');
            if (doc === '') {
                let commentCount = 0;
                let allComment = '';
                res.json({ commentCount, allComment });
            } else if (doc != '') {
                let commentCount = doc[0].comment.length;
                let allComment = doc[0].comment;
                res.json({ commentCount, allComment });
            } else {
                let commentCount = 0;
                let allComment = '';
                res.json({ commentCount, allComment });
            }
            // let commentCount = doc[0].comment.length;
            // let allComment = doc[0].comment;
            // res.json({ commentCount, allComment });
        }
    })
})

router.post('/api/demo/:postid', (req, res) => {
    const postid = req.params.postid;
    const post = new Post();
    post.title = req.body.title;
    post.description = req.body.description;
    post.url = req.body.website;

    post.location = req.body.city;
    Post.updateOne({ _id: postid }, {
        $set: {
            'title': post.title,
            'description': post.description,
            'url': post.url,
            'location': post.location
        }
    }, (err, docs) => {
        if (err) {
            console.log('error in update adminpost');
        } else {
            res.status(200).json({
                status: true,
                message: docs
            });
        }
    });
});

router.post('/api/adminpost/show/:admin', (req, res) => {
    const admin = req.params.admin;
    ProjectModel.find({ $or: [{ email: admin }, { username: admin }] }, (err, docs) => {
        if (err) throw err;
        else {
            Post.find({ $or: [{ creater: docs[0].email }, { creater: docs[0].username }] }, (err, docs) => {
                if (err) {
                    console.log("error in fetching admin's post");
                } else {
                    res.status(200).json({
                        status: true,
                        message: docs
                    });
                }
            });
        }
    });
});

router.post('/api/sociallogin', (req, res) => {
    const tempemail = req.body.email;
    const tempusername = req.body.name;
    let tempid = req.body.id;
    console.log(tempemail);
    console.log(tempusername);
    console.log(tempid);
    const token = jwt.sign({ tempusername, tempemail, tempid }, "my_secret_key", {
        expiresIn: '24h'
    });
    res.json({ token });
});

// created by nitesh jangir
router.post('/api/userjwt/:object', (req, res) => {
    const Object_id = req.params.object;
    console.log(Object_id);
    const token = jwt.sign({ Object_id }, 'my_secret_key', { expiresIn: '50s' });
    res.status(200).json({
        status: '200',
        Token: token
    });
});

module.exports = router;