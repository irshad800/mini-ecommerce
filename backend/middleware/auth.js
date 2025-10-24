const auth = require('basic-auth');

     const admin = { name: 'admin', pass: 'password' };

     function authenticate(req, res, next) {
       const user = auth(req);
       if (!user || user.name !== admin.name || user.pass !== admin.pass) {
         res.set('WWW-Authenticate', 'Basic realm="example"');
         return res.status(401).send('Authentication required.');
       }
       next();
     }

     module.exports = authenticate;