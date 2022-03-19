import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_TUITS = [
    {tuit: "alice's tuit", _id: "1"},
    {tuit: "bob's tuit", _id: "2"},
    {tuit: "charlie's tuit", _id: "3"}
];

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

describe('renders mocked', () => {
    test('tuit list renders mocked', async () => {
        // TODO: implement this
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({data: {tuits: MOCKED_TUITS}}));
        const response = await findAllTuits();
        const mockedTuits = response.tuits;

        render(
            <HashRouter>
                <Tuits tuits={mockedTuits}/>
            </HashRouter>);
        const linkElement = screen.getByText(/alice's tuit/i);
        expect(linkElement).toBeInTheDocument();
    });
});
