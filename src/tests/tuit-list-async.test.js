import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";

describe('async renders', () => {
    test('tuit list renders async', async () => {
        // TODO: implement this
        const allTuits = await findAllTuits();
        render(
            <HashRouter>
                <Tuits tuits={allTuits}/>
            </HashRouter>);
        const linkElement = screen.getByText(/Mars rover landed and our Ingenuity helicopter took flight/i);
        expect(linkElement).toBeInTheDocument();
    })
});
