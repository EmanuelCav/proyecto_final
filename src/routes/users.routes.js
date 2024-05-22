import { Router } from 'express';
import passport from 'passport';

import * as userCtrl from'../controller/users.ctrl.js';

import { auth, emailAuth, admin } from'../middleware/auth.js';

import { UserDTO } from '../dto/user.dto.js';

import { documents, profiles } from '../lib/images.js';

const router = Router()

router.get('/api/users', [auth, admin], userCtrl.users)

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)

router.get('/api/users/premium/:id', [auth, admin], userCtrl.updatePremium)

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/products');
  });

router.get('/api/sesions/current', auth, passport.authenticate("current"), (req, res) => {
  if(req.user) {
    return res.json(new UserDTO(req.user))
  }
})

router.post('/email', userCtrl.forgotPassword)
router.post('/profile', auth, documents.array("files", 3), userCtrl.uploadDocument)

router.delete('/api/users/:id', [auth, admin], userCtrl.removeUser)
router.delete('/api/users', [auth, admin], userCtrl.removeUsers)

router.put('/recover', emailAuth, userCtrl.recoverPassword)
router.put('/profile', auth, profiles.single("file"), userCtrl.updateProfileImage)
router.put('/users/:id', [auth, admin], userCtrl.updateRole)

export default router
