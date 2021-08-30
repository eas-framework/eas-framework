
export default {
    get: {
        'anime/cool': {
            validateURL: [String, Number],
            validateFunc([text, num], Request: Request | any, Response: Response | any){
                return true
            },
            func (Request: Request | any, Response: Response | any, [text, num]){
                return {text, num};

            }
        }
    }
}