
import { createStore } from 'framework7';

//"phone=83256474&product=1 Kilo de Papa&price=1000&detail=this is the message",
const store = createStore({
    state: {
        products: [
            {
                id: '1',
                phone: 83256474,
                name: '1 Kilo de Tomate',
                price: 3000,
                detail: '1 Kilo de tomate de Vendedor Juan. 20260819'
            },

        ]
    },
    getters: {
        products({ state }) {
            return state.products;
        }
    },
    actions: {
        // async initApp({ state }) {
        //   state.items = await db.items.toArray();
        // },


        addProduct({ state }, product) {
            // const id = await db.items.add(newItem);
            state.products = [...state.products, product];


        },
    },
})
export default store;
