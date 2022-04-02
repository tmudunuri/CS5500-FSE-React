import Tuits from "../components/tuits/index";
import MyDislikes from "../components/profile/my-dislikes";
import {screen, render, waitFor} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {userDislikesTuit, api} from "../services/likes-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import {createTuit, deleteTuit} from "../services/tuits-service";

const hellen = {
    username: 'hellenpaine',
    password: 'hk426',
    email: 'hellenkeller@test.com'
};
const MOCKED_TUITS = [
    {
        tuit: "aaa",
        postedBy: hellen,
        stats: {dislikes: 10},
        _id: "1"
    },
    {
        tuit: "alice's tuit",
        postedBy: hellen,
        stats: {dislikes: 20},
        _id: "2"
    }
];
let newUser;
let uid;
let tid;

// setup test before running test
beforeAll(async () => {
    // remove any/all users to make sure we create it in the test
    await deleteUsersByUsername(hellen.username);
    newUser = await createUser(hellen);
    uid = newUser._id
    const newTuit = await createTuit(uid, {tuit: MOCKED_TUITS[1].tuit});
    tid = newTuit._id;
    await userDislikesTuit(uid, tid);
})

describe('static renders', () => {
    test('tuit list renders static tuit array', () => {
        render(
            <HashRouter>
                <Tuits tuits={MOCKED_TUITS}/>
            </HashRouter>);
        const linkElement = screen.getByText(/alice's tuit/i);
        expect(linkElement).toBeInTheDocument();
    });
});

describe('my dislikes screen renders disliked tuit mocked '
    + 'and also displays correct dislikes count', () => {
    const mock = jest.spyOn(api, 'get');

    afterEach(() => {
        mock.mockRestore();
    })

    test("render disliekd tuits", async () => {
        mock.mockImplementation(() => {
            return Promise.resolve({data: MOCKED_TUITS});
        });

        render(
            <HashRouter>
                <MyDislikes/>
            </HashRouter>
        )

        await waitFor(() => {
            MOCKED_TUITS.map(eachTuit => {
                let name = eachTuit.postedBy.username
                const dislikesCount = eachTuit.stats.dislikes
                const nameElements = screen.getAllByText(name, {exact: false});
                const tuitElements = screen.getAllByText(eachTuit.tuit, {exact: false});
                nameElements.forEach(e => expect(e).toBeInTheDocument());
                tuitElements.forEach(e => expect(e).toBeInTheDocument());
                expect(screen.getByText(dislikesCount)).toBeInTheDocument();
            })
        })
    })
});

// clean up after ourselves
afterAll(async () => {
    // delete the tuit we inserted
    await deleteTuit(tid);
    await userDislikesTuit(uid, tid);
    // remove user we created
    await deleteUsersByUsername(hellen.username);
});