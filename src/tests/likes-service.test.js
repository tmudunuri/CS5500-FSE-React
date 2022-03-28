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

        console.log(likesTuit);

        // verify inserted user's properties match parameter user
        // expect(newTuit.tuit).toEqual(sampleTuit.tuit);
        // expect(newTuit.postedBy).toEqual(newUserId);
    });
});

// clean up after ourselves
afterAll(async () => {
    // remove user we created
    await deleteUsersByUsername(hellen.username);
    // delete the tuit we inserted
    await deleteTuit(tid);
});