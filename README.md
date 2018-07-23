# NodeJS modular server

![alt text](https://www.nixp.ru/uploads/news/fullsize_image/b85be26f474620c0bdcf9f76c413aa9e1618c986.png "NodeJS Logo")

### Basic architecture

**Files structure**

> * app
  * controllers
    * users.js
  * core
    * routes
      * formPost.js
      * get.js
      * post.js
      * put.js
    * app.js
    * db.js
    * router.js
  * modules
    * 1.0
      * users
        * POST_authenticate.js

**Used libraries**

* body-parser
* express
* forever
* formidable
* helmet
* mondogb
* nodemon
