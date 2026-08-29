
import { createStore } from 'framework7';
import { db } from 'db';

//"phone=83256474&product=1 Kilo de Papa&price=1000&detail=this is the message",
const store = createStore({
    state: {
        products: [],
        history: [],
    },
    getters: {
        products({ state }) {
            return state.products;
        },
        history({ state }) {
            return state.history;
        }
    },
    actions: {
        async initApp({ state }) {
            state.products = await db.products.toArray();
            state.history = (await db.history.toArray()).reverse();
        },

        // Products / QR Codes
        async addProduct({ state }, product) {
            const id = await db.products.add(product);
            state.products = [...state.products, { id, ...product }];
        },

        async updateProduct({ state }, updatedProduct) {
            await db.products.put(updatedProduct);
            state.products = state.products.map(product =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            );
        },

        async deleteProduct({ state }, id) {
            await db.products.delete(id);
        },

        // History
        async addHistoryItem({ state }, historyItem) {
            const id = await db.history.add(historyItem);
            state.history = [{ id, ...historyItem }, ...state.history];
        },

        async deleteHistoryItem({ state }, id) {
            await db.history.delete(id);
        }

    },
})
export default store;
