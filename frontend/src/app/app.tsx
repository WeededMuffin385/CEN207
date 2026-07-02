import styles from './app.module.css'
import Footer from "./footer/footer.tsx";
import {Route, Routes} from "react-router";
import Catalog from "./catalog/catalog.tsx";
import Authentication from "./authentication/authentication.tsx";
import Product from "./catalog/product/product.tsx";
import Navigation from "./navigation/navigation.tsx";
import Carts from "./carts/carts.tsx";
import Profile from "./profile/profile.tsx";

function App() {

    return (
        <div className={styles.App}>
            <Navigation/>

            <Routes>
                <Route path="/" element={<Catalog/>}/>
                <Route path="/auth" element={<Authentication/>}/>
                <Route path="/profile" element={<Profile/>}/>

                <Route path="/carts/*" element={<Carts/>}/>

                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/catalog/:productId" element={<Product/>}/>
            </Routes>

            <Footer/>
        </div>
    )
}

export default App
