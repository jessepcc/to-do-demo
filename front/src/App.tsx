import { Typography } from "antd";
import CreateItem from "./components/createItem";
import ItemList from "./components/itemList";

const { Title } = Typography;

function App() {
    // const {defaultAlgorithm, darkAlgorithm} = theme;
    return (
        <main>
            <Title style={{ textAlign: "center" }}>To do List</Title>
            <CreateItem />
            <ItemList />
        </main>
    );
}

export default App;
