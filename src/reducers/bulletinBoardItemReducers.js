import {
    BULLETIN_BOARD_ITEM_LIST_REQUEST,
    BULLETIN_BOARD_ITEM_LIST_FAILURE,
    BULLETIN_BOARD_ITEM_LIST_SUCCESS,
    BULLETIN_BOARD_ITEM_DETAIL_REQUEST,
    BULLETIN_BOARD_ITEM_DETAIL_FAILURE,
    BULLETIN_BOARD_ITEM_DETAIL_SUCCESS
} from '../constants/actionTypes';


export const bulletinBoardItemListReducer = function(state = [], action = {}) {
    switch (action.type) {
        case BULLETIN_BOARD_ITEM_LIST_REQUEST:
            return Object.assign({}, state, action.payload);

        case BULLETIN_BOARD_ITEM_LIST_FAILURE:
            return Object.assign({}, state, action.payload);

        case BULLETIN_BOARD_ITEM_LIST_SUCCESS:
            return Object.assign({}, state, action.payload);

        default:
            return state;
    }
}


export const bulletinBoardItemDetailReducer = function(state = [], action = {}) {
    switch (action.type) {
        case BULLETIN_BOARD_ITEM_DETAIL_REQUEST:
            return Object.assign({}, state, action.payload);

        case BULLETIN_BOARD_ITEM_DETAIL_FAILURE:
            return Object.assign({}, state, action.payload);

        case BULLETIN_BOARD_ITEM_DETAIL_SUCCESS:
            return Object.assign({}, state, action.payload);

        default:
            return state;
    }
}
