import * as Realm from 'realm-web';
import * as utils from './utils';
import type {Trip} from "./models/models";
import {DB_NAME, TRIPS_COLLECTION} from "./constants/db.constants";

interface Bindings {
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

        console.debug(`[index.ts] url:`, JSON.stringify(url, null, 2))

        if (path !== '/api/trips') {
            return utils.toError(`Unknown "${path}" URL; try "/api/trips" instead.`, 404);
        }

        let client: globalThis.Realm.Services.MongoDB;

        const token = req.headers.get('authorization');
        if (!token) return utils.toError('Missing "authorization" header; try to add the header "authorization: REALM_API_KEY".', 401);

        try {
            const credentials = Realm.Credentials.apiKey(token);
            // Attempt to authenticate
            const user = await App.logIn(credentials);
            client = user.mongoClient('mongodb-atlas');
        } catch (err) {
            return utils.toError('Error with authentication.', 500);
        }

        // Grab a reference to the "cloudflare.trips" collection
        const collection = client.db(DB_NAME).collection<Trip>(TRIPS_COLLECTION);

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
            if (method === 'POST') {
                const body: Trip = await req.json();
                return utils.reply(
                    await collection.insertOne(body)
                );
            }

            // PATCH /api/trips
            if (method === 'PUT') {
                const { _id, ...data }: Trip = await req.json();
                return utils.reply(
                    await collection.findOneAndUpdate({
                        _id: new ObjectId(_id)
                    }, {
                        ...data
                    })
                );
            }

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
