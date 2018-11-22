import * as d3 from 'd3'
import { getMinAmountOfBooks, getMaxAmountOfBooks } from './amountOfBooks'

export const getNormalColorScale = () => {
    return d3.scaleLog()
        .base(30)
        .domain([getMinAmountOfBooks(), getMaxAmountOfBooks()])
        .range(['#66FCF1', '#2F2FA2'])
}

export const getHoverColorScale = () => {
    return d3.scaleLog()
        .base(30)
        .domain([getMinAmountOfBooks(), getMaxAmountOfBooks()])
        .range(['#0ffae9', '#232379'])
}