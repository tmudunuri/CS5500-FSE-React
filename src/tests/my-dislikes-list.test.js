import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuitsDislikedByUser, userDislikesTuit} from "../services/likes-service";
import axios from "axios";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import {createTuit, deleteTuit} from "../services/tuits-service";

const MOCKED_TUITS = [
    {tuit: "aaa", _id: "1"},
    {tuit: "alice's tuit", _id: "2"},
];
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
    const dislikesTuit = await userDislikesTuit(uid, tid);
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

describe('async renders', () => {
    test('tuit list renders async', async () => {
        const allTuits = await findAllTuitsDislikedByUser(uid);
        render(
            <HashRouter>
                <Tuits tuits={allTuits}/>
            </HashRouter>);
        const linkElement = screen.getByText(/This is a test Tuit./i);
        expect(linkElement).toBeInTheDocument();
    })
});

describe('renders mocked', () => {
    test('tuit list renders mocked', async () => {
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementationOnce(() =>
            Promise.resolve({data: {tuits: MOCKED_TUITS}}));
        const response = await findAllTuitsDislikedByUser(uid);
        const mockedTuits = response;
        mock.mockRestore();

        render(
            <HashRouter>
                <Tuits tuits={mockedTuits}/>
            </HashRouter>);
        const linkElement = screen.getByText(/This is a test Tuit./i);
        expect(linkElement).toBeInTheDocument();
    });
});

// clean up after ourselves
afterAll(async () => {
    // delete the tuit we inserted
    await deleteTuit(tid);
    await userDislikesTuit(uid, tid);
    // remove user we created
    await deleteUsersByUsername(hellen.username);
});