import http from 'http'
export default {
    POST: {
        'anime/cool': {
            validateURL: [String, Number],
            validateFunc([text, num], Request: Request | any, Response: Response | any){
                return true
            },
            func (Request: Request | any, Response: Response | any, [text, num]){
                return {text, num};

            }
        },

        'be': {
            'me': {
                func (Request: Request | any, Response: Response | any, [text, num]){
                    return http.METHODS;
    
                }   
            },
            func (Request: Request | any, Response: Response | any, [text, num]){
                return 'mooo';

            }        
        }
    },

    func (Request: Request | any, Response: Response | any){
        Response.sendStatus(404);
    }
}