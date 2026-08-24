
import { createStore } from 'framework7';
import { db } from 'db';

//"phone=83256474&product=1 Kilo de Papa&price=1000&detail=this is the message",
const store = createStore({
    state: {
        products: [
            // {
            //     id: '1',
            //     phone: 83256474,
            //     name: '1 Kilo de Tomate',
            //     price: 3000,
            //     detail: '1 Kilo de tomate de Vendedor Juan. 20260819'
            // },
        ]
    },
    getters: {
        products({ state }) {
            return state.products;
        }
    },
    actions: {
        async initApp({ state }) {
            state.products = await db.products.toArray();
            console.log(state.products);

        },

        async addProduct({ state }, product) {
            const id = await db.products.add(product);
            state.products = [...state.products, { id, ...product }];
        },

        async updateProduct({ state }, product) {
            await db.products.put(product);
        },

        async deleteProduct({ state }, id) {
            await db.products.delete(id);
        }
    },
})
export default store;
