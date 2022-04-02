import {
    findAllTuitsLikedByUser,
    findAllUsersThatLikedTuit,
    userLikesTuit,
    findAllTuitsDislikedByUser,
    findAllUsersThatDislikedTuit,
    userDislikesTuit
} from "../services/likes-service";
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
const sampleTuit = {
    tuit: 'This is a test Tuit.',
}
let newUser;
let uid;
let tid;

// setup test before running test
beforeAll(async () => {
    // remove any/all users to make sure we create it in the test
    await deleteUsersByUsername(hellen.username);
    newUser = await createUser(hellen);
    uid = newUser._id
    const newTuit = await createTuit(uid, sampleTuit);
    tid = newTuit._id;
})

describe('can like a tuit with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userLikesTuit(uid, tid);
    })

    test('can like tuits with REST API', async () => {
        const likesTuit = await userLikesTuit(uid, tid);
        expect(likesTuit).toEqual("OK");
        let likedTuit = await findTuitById(tid);
        expect(likedTuit.stats.likes).toEqual(1);
    });
});

describe('can unlike a tuit with REST API', () => {

    test('can like tuits with REST API', async () => {
        const likesTuit = await userLikesTuit(uid, tid);
        let likedTuit = await findTuitById(tid);
        expect(likedTuit.stats.likes).toEqual(1);

        const unlikesTuit = await userLikesTuit(uid, tid);
        expect(unlikesTuit).toEqual("OK");
        likedTuit = await findTuitById(tid);
        expect(likedTuit.stats.likes).toEqual(0);
    });
});

describe('can dislike a tuit with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userDislikesTuit(uid, tid);
    })

    test('can dislike tuits with REST API', async () => {
        const dislikesTuit = await userDislikesTuit(uid, tid);
        expect(dislikesTuit).toEqual("OK");
        let dislikedTuit = await findTuitById(tid);
        expect(dislikedTuit.stats.dislikes).toEqual(1);
    });
});

describe('can undislike a tuit with REST API', () => {

    test('can undislike tuits with REST API', async () => {
        const dislikesTuit = await userDislikesTuit(uid, tid);
        let dislikedTuit = await findTuitById(tid);
        expect(dislikedTuit.stats.dislikes).toEqual(1);

        const unlikesTuit = await userDislikesTuit(uid, tid);
        expect(unlikesTuit).toEqual("OK");
        dislikedTuit = await findTuitById(tid);
        expect(dislikedTuit.stats.dislikes).toEqual(0);
    });
});

describe('get tuits liked by user with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userLikesTuit(uid, tid);
    })

    test('can undislike tuits with REST API', async () => {
        const likesTuit = await userLikesTuit(uid, tid);
        const likedTuits = await findAllTuitsLikedByUser(uid);
        expect(likedTuits.length).toEqual(1);
        expect(likedTuits[0].stats.likes).toEqual(1);
        expect(likedTuits[0].tuit).toEqual(sampleTuit.tuit);
    });
});

describe('get users that liked tuit with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userLikesTuit(uid, tid);
    })

    test('can undislike tuits with REST API', async () => {
        const likesTuit = await userLikesTuit(uid, tid);
        const users = await findAllUsersThatLikedTuit(tid);
        expect(users.length).toEqual(1);
        expect(users[0].likedBy.username).toEqual(hellen.username);
    });
});

describe('get tuits disliked by user with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userDislikesTuit(uid, tid);
    })

    test('can undislike tuits with REST API', async () => {
        const dislikesTuit = await userDislikesTuit(uid, tid);
        const dislikedTuits = await findAllTuitsDislikedByUser(uid);
        expect(dislikedTuits.length).toEqual(1);
        expect(dislikedTuits[0].stats.dislikes).toEqual(1);
        expect(dislikedTuits[0].tuit).toEqual(sampleTuit.tuit);
    });
});

describe('get users that disliked tuit with REST API', () => {
    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return userDislikesTuit(uid, tid);
    })

    test('can undislike tuits with REST API', async () => {
        const dislikesTuit = await userDislikesTuit(uid, tid);
        const users = await findAllUsersThatDislikedTuit(tid);
        expect(users.length).toEqual(1);
        expect(users[0].dislikedBy.username).toEqual(hellen.username);
    });
});

// clean up after ourselves
afterAll(async () => {
    // delete the tuit we inserted
    await deleteTuit(tid);
    // remove user we created
    await deleteUsersByUsername(hellen.username);
});