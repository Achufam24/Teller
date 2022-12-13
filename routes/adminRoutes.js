const { application } = require('express');
const express = require('express');
const { createuser, updateToAdmin, deleteUser, getUsersExceptMe, getAllusers, getAllSubscribers, subscribeMessage } = require('../controllers/adminController');
const { requireAuth, admin } = require('../middlewares/requireAuth');



const router = express.Router();

router.use(requireAuth);
router.use(admin);

router.post('/create-user',createuser);

router.patch('/update-user/:id', updateToAdmin);

router.delete('/delete-user/:id', deleteUser);

router.get('/OtherUsers', getUsersExceptMe);

router.get('/user', getAllusers);

router.get('/subscribers',getAllSubscribers);

router.post('/subscribeMessage',subscribeMessage);



module.exports = router;