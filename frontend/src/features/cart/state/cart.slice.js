import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload)
        },
        updateItem: (state, action) => {
            if (!action.payload) return
            const { _id, quantity } = action.payload
            const item = state.items.find(item => item._id === _id)
            if (item) {
                item.quantity = quantity
            }
        }
    }
})

export const { setCart, addItem, removeItem, updateItem } = cartSlice.actions

export default cartSlice.reducer    