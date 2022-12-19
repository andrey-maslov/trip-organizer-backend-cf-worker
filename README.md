# REST API with a Cloudflare Worker and a MongoDB Atlas Cluster

# How it Works

- The MongoDB Atlas cluster stores the data in the MongoDB collection.
- A MongoDB Atlas App Services App manages the authentication and the collection access rules.
- A Cloudflare worker uses the Realm Web SDK to authenticate and retrieve the data that is then exposed with a REST API.

# Build and Deploy

Run the following commands:
```
$ npm i @cloudflare/wrangler -g
$ wrangler login
$ wrangler publish
```

## Test using shell
```shell
$ npm i @cloudflare/wrangler -g
$ wrangler login
$ wrangler publish
$ cd api_tests
$ ./post.sh "Write a good README.md for Github"
$ ./post.sh "Commit and push"
$ ./findAll.sh
$ ./findOne.sh <OBJECT_ID> # replace with an _id from the previous command
$ ./patch.sh <OBJECT_ID> true
$ ./findAll.sh # note that done=true now on your todo
$ ./deleteOne.sh <OBJECT_ID>
$ ./findAll.sh # only one left
```

You can also navigate to MongoDB Atlas Cluster and browse collection to confirm the above tests.

# Template Authors

- Luke Edwards <ledwards@cloudflare.com>
- Maxime Beugnet <maxime@mongodb.com>

## Useful links
[Create a REST API with Cloudflare Workers and MongoDB Atlas](https://www.mongodb.com/developer/products/atlas/cloudflare-worker-rest-api/)
