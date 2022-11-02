

export default {
    GET: {
        define: {
            number: parseInt
        },

        more: {

            func({number}, req, res){
                return number +' something';
            },
        }
    }
}