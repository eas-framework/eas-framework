use crate::{
    actions::base_reader::{
        block_skip_text
    },
    better_string::{ b_string::BetterString},
};


pub struct MiniRazor {
    pub values: Vec<usize>,
    pub find: BetterString
}

impl MiniRazor {
    pub fn new(find: &str) -> Self {
        MiniRazor { 
            values: vec![], 
            find: BetterString::new(find)
        }
    }

    fn curly_brackets(&mut self, text: &BetterString, mut add_index: usize) {

        let start_switch = text.index_of_char(&'{').unwrap() + 1;
        let next = text.substring_start(start_switch);
        add_index += start_switch;

        let end_main = block_skip_text(&next, vec!['{', '}']) as usize;
    
        self.values.push(add_index);
        self.values.push(add_index + end_main);
        
        self.builder(&next.substring_start(end_main+1), add_index + end_main+1);
    }


    pub fn builder(&mut self, text: &BetterString, add_index: usize) {
        let index = text.index_of_better(&self.find);

        if index == None {
            return;
        }

        let start = index.unwrap();
        self.values.push(add_index);
        self.values.push(start+add_index);
        self.curly_brackets(&text.substring_start(start), start+add_index);
    }
}