
import { createStore } from 'framework7';

const store = createStore({
    state: {
        products: [
            {
                id: '1',
                product: 'Apple iPhone 8',
                detail: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
            },
            {
                id: '2',
                product: 'Apple iPhone 8 Plus',
                detail: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
            },
            {
                id: '3',
                product: 'Apple iPhone X',
                detail: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
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
