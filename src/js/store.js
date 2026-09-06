
import { createStore } from 'framework7';
import { db } from 'db';
import { encryptData, decryptData } from 'crypto';

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
            // note: foreach doesn't work well with async await
            // that's why we have to use map and Promise.all

            let products = await db.products.toArray();
            products = await Promise.all(
                products.map(async product => {
                    const { ciphertext, iv } = product.phone;
                    if(!ciphertext) return product;
                    const phone = await decryptData(ciphertext, iv);
                    return { ...product, phone };
                })
            );

            let history = await db.history.toArray();
            history = await Promise.all(
                history.reverse().map(async historyItem => {
                    const { ciphertext, iv } = historyItem.phone;
                    const phone = await decryptData(ciphertext, iv);
                    return { ...historyItem, phone };
                })
            );

            state.products = products;
            state.history = history;
        },

        // Products / QR Codes
        async addProduct({ state }, product) {
            const phone = await encryptData(product.phone);
            const id = await db.products.add({ ...product, phone });
            state.products = [...state.products, { id, ...product }];
        },

        async updateProduct({ state }, updatedProduct) {
            const phone = await encryptData(updatedProduct.phone);
            await db.products.put({ ...updatedProduct, phone });
            state.products = state.products.map(product =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            );
        },

        async deleteProduct({ state }, id) {
            await db.products.delete(id);
        },

        // History
        async addHistoryItem({ state }, historyItem) {
            const phone = await encryptData(historyItem.phone);
            const id = await db.history.add({ ...historyItem, phone });
            state.history = [{ id, ...historyItem }, ...state.history];
        },

        async deleteHistoryItem({ state }, id) {
            await db.history.delete(id);
        }

    },
})

// tests only
if (import.meta.env.DEV) {
    window.store = store;
}

export default store;
