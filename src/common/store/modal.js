const Modal = {
    state: {
        input: '',
        output: ''
    },
    mutations: {
        SETMODALINPUT: (state, data) => {
            state.input = data
        },
        SETMODALOUTPUT: (state, data) => {
            state.output = data
        },
        CLEARMODALDATA: (state) => {
            state.input = state.input = ''
        }
    }
}

export default Modal