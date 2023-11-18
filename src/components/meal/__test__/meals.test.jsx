import Meals from "../meals";
import renderer from "react-test-renderer";
import i18n from "../../../util/i18n";
import { I18nextProvider } from "react-i18next";
import { getAuth } from "@/util/firebase";

// Mock the Firebase services
jest.mock("@/util/firebase", () => ({
    getAuth: jest.fn(),
    initializeApp: jest.fn(), // Mock initializeApp to avoid Firebase initialization
}));

// Mock the useRouter hook
jest.mock("next/router", () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

it("renders correctly", () => {
    // Mock Firebase services
    getAuth.mockReturnValue();
    const tree = renderer
        .create(
            <I18nextProvider i18n={i18n}>
                <Meals />
            </I18nextProvider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
