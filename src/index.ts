import * as Realm from 'realm-web';
import * as utils from './utils';
import type {Trip} from "./models/models";

interface Bindings {
    // MongoDB Realm Application ID
    REALM_APPID: string;
}

let App: Realm.App;
const ObjectId = Realm.BSON.ObjectID;

const worker: ExportedHandler<Bindings> = {
    async fetch(req, env) {
        const url = new URL(req.url);
        App = App || new Realm.App(env.REALM_APPID);

        const method = req.method;
        const path = url.pathname.replace(/[/]$/, '');
        const tripID = url.searchParams.get('id') || '';

        if (path !== '/api/trips') {
            return utils.toError(`Unknown "${path}" URL; try "/api/trips" instead.`, 404);
        }

        const token = req.headers.get('authorization');
        if (!token) return utils.toError('Missing "authorization" header; try to add the header "authorization: REALM_API_KEY".', 401);

        try {
            const credentials = Realm.Credentials.apiKey(token);
            // Attempt to authenticate
            var user = await App.logIn(credentials);
            var client = user.mongoClient('mongodb-atlas');
        } catch (err) {
            return utils.toError('Error with authentication.', 500);
        }

        // Grab a reference to the "cloudflare.trips" collection
        const collection = client.db('trip-organizer').collection<Trip>('trips');

        try {
            if (method === 'GET') {
                if (tripID) {
                    // GET /api/trips?id=XXX
                    return utils.reply(
                        await collection.findOne({
                            _id: new ObjectId(tripID)
                        })
                    );
                }

                // GET /api/trips
                return utils.reply(
                    await collection.find()
                );
            }

            // POST /api/trips
            // if (method === 'POST') {
            //     const {todo} = await req.json();
            //     return utils.reply(
            //         await collection.insertOne({
            //             owner: user.id,
            //             done: false,
            //             todo: todo,
            //         })
            //     );
            // }

            // PATCH /api/trips?id=XXX&done=true
            // if (method === 'PATCH') {
            //     return utils.reply(
            //         await collection.updateOne({
            //             _id: new ObjectId(tripID)
            //         }, {
            //             $set: {
            //                 done: url.searchParams.get('done') === 'true'
            //             }
            //         })
            //     );
            // }

            // DELETE /api/trips?id=XXX
            if (method === 'DELETE') {
                return utils.reply(
                    await collection.deleteOne({
                        _id: new ObjectId(tripID)
                    })
                );
            }

            // unknown method
            return utils.toError('Method not allowed.', 405);
        } catch (err) {
            const msg = (err as Error).message || 'Error with query.';
            return utils.toError(msg, 500);
        }
    }
}

// Export for discoverability
export default worker;
