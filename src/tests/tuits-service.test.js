import {
    createTuit,
    deleteTuit, findTuitById,
    findAllTuits
} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";

const hellen = {
    username: 'hellenpaine',
    password: 'hk426',
    email: 'hellenkeller@test.com'
};
let newUser;

// setup test before running test
beforeAll(async () => {
    // remove any/all users to make sure we create it in the test
    await deleteUsersByUsername(hellen.username);
    newUser = await createUser(hellen);
})

describe('can create tuit with REST API', () => {
    // TODO: implement this
    // sample user to insert
    let tid;

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteTuit(tid);
    })

    test('can insert new tuits with REST API', async () => {
        // insert new user in the database
        const newUserId = newUser._id

        const sampleTuit = {
            tuit: 'This is a test Tuit.',
        }
        const newTuit = await createTuit(newUserId, sampleTuit);
        tid = newTuit._id;

        // verify inserted user's properties match parameter user
        expect(newTuit.tuit).toEqual(sampleTuit.tuit);
        expect(newTuit.postedBy).toEqual(newUserId);
    });
});

describe('can delete tuit wtih REST API', () => {
    // TODO: implement this
    let tid;

    // setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        const sampleTuit = {
            tuit: 'This is a test Tuit to be deleted.',
        }
        const newUserId = newUser._id;
        const newTuit = await createTuit(newUserId, sampleTuit);
        tid = newTuit._id;
    })

    test('can delete tuits from REST API by tid', async () => {
        // delete a tuit by its id. Assumes tuit already exists
        const status = await deleteTuit(tid);

        // verify we deleted at least one tuit by its id
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    // TODO: implement this
    let tid;
    const sampleTuit = {
        tuit: 'This is a test Tuit to be fetched.',
    }

    // setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        const newUserId = newUser._id;
        const newTuit = await createTuit(newUserId, sampleTuit);
        tid = newTuit._id;
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        // retrieve the user from the database by its primary key
        const existingTuit = await findTuitById(tid);

        // verify retrieved user matches parameter user
        expect(existingTuit.tuit).toEqual(sampleTuit.tuit);
        expect(existingTuit.postedBy.username).toEqual(newUser.username);
        expect(existingTuit.postedBy._id).toEqual(newUser._id);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteTuit(tid);
    })
});

describe('can retrieve all tuits with REST API', () => {
    // TODO: implement this

    // sample users we'll insert to then retrieve
    const tuits = [
        "tuit1", "tuit2", "tuit3"
    ];
    let tuitIds = []

    // setup data before test
    beforeAll(async () => {
        // insert several tuits
        const newUserId = newUser._id
        for (const t of tuits) {
            let temp_tuit = await createTuit(newUserId, {
                tuit: t,
            });
            tuitIds.push(temp_tuit._id);
        }
    });

    // clean up after ourselves
    afterAll(async () => {
        // delete the tuits we inserted
        for (const tid of tuitIds) {
            await deleteTuit(tid)
        }
    });

    test('can retrieve all tuits from REST API', async () => {
        // retrieve all the users
        const allTuits = await findAllTuits();

        // there should be a minimum number of tuits
        expect(allTuits.length).toBeGreaterThanOrEqual(tuits.length);

        // let's check each tuit we inserted
        const tuitsWeInserted = allTuits.filter(
            tuit => tuits.indexOf(tuit.tuit) >= 0);

        // compare the actual tuits in database with the ones we sent
        tuitsWeInserted.forEach(tuit => {
            const t = tuits.find(t => t === tuit.tuit);
            expect(tuit.tuit).toEqual(t);
        });
    });
});

afterAll(async () => {
    // remove user we created
    return deleteUsersByUsername(hellen.username);
})