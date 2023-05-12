const addItem = [];

const addItems = (state = addItem, action) => {
    switch (action.type) {
        case "ADDITEM" : return [
            ...state,
            action.payload
        ]
<<<<<<< HEAD
=======
        break;
>>>>>>> 8791da41297fbb2faa914de44ae113d5024217af

        case "DELITEM" :
            return state = state.filter((x)=>{
                return x.id !== action.payload.id
            })
<<<<<<< HEAD

        default: return state;
=======
        break;

        default: return state;
        break;
>>>>>>> 8791da41297fbb2faa914de44ae113d5024217af

        
    }
}

export default addItems;