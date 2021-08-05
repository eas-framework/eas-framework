use serde::{Deserialize, Serialize};
use std::iter::FromIterator;
use regex::Regex;
use super::super::actions::base_actions::*;

#[derive(Debug, Clone)]
#[derive(Serialize, Deserialize)]
pub struct CharTracker {
    pub text: char,
    pub info: String,
    pub line: usize,
    pub char: usize
}

impl CharTracker {
    fn Clone(self) -> CharTracker{
        CharTracker {
            text: self.text.clone(),
            info: self.info.clone(),
            line: self.line.clone(),
            char: self.char.clone()
        }
    }
}

#[derive(Debug, Clone)]
pub struct StringTracker {
    pub data_vector: Vec<CharTracker>
}

impl StringTracker {

    pub fn new(info: String, text: String) -> Self {
        let mut this = StringTracker {
            data_vector: vec![]
        };

        this.add_text(info, text);

        this
    }

    pub fn add_text(&mut self, info: String, text: String){
        let chars: Vec<char> = text.chars().collect();

        let mut line = 0;
        let mut char_count = 1;
        for i in chars.iter() {

            self.data_vector.push(CharTracker {
                text: i.to_owned(),
                info: info.to_owned(),
                line,
                char: char_count
            });

            if i == &'\n' {
                line+=1;
                char_count = 1;
            }
        }
    }

    pub fn at_char(self, index: usize) -> char {
        self.data_vector[index].text
    }

    pub fn cut(self, index_start: usize, index_end: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().skip(index_start).take(index_end-index_start).collect();

        StringTracker {
            data_vector: chars
        }
    }

    pub fn cut_start(self, index: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().skip(index).collect();

        StringTracker {
            data_vector: chars
        }
    }

    pub fn cut_end(self, index: usize) -> StringTracker{
        let chars: Vec<CharTracker>= self.data_vector.into_iter().take(index).collect();

        StringTracker {
            data_vector: chars
        }
    }

    pub fn len(self) -> usize{
        self.data_vector.len()
    }

    pub fn eq(self, other: StringTracker) -> bool {
        let my_len = self.data_vector.len();

        if my_len != other.data_vector.len() {
            return false;
        }

        for i in 0..my_len {
            if self.data_vector[i].text != other.data_vector[i].text {
                return false;
            }
        }

        true
    }

    pub fn index_of(self, find: &str) -> i32 {
        let find_chars: Vec<char> = find.chars().collect();
        let all_len =  self.data_vector.len();
        let find_len = find_chars.len();
        let mut i = 0;
    
        while i < all_len {
            let this_char =  self.data_vector[i].text;
    
            if find_chars[0] == this_char {
                let mut b = 1;
    
                while b < find_len && find_chars[b] == self.data_vector[i+b].text {
                    b += 1;
                }
    
                if b == find_len {
                    return i as i32;
                }
            }
    
            i+=1;
        }
    
        -1
    }

    pub fn split(self, find: &str, mut limit: usize) -> Vec<StringTracker> {
        let find_chars: Vec<char> = find.chars().collect();
        let all_len =  self.data_vector.len();
        let find_len = find_chars.len();
        let mut i = 0;

        let mut results = vec![];
    
        while i < all_len {
            let this_char =  self.data_vector[i].text;
    
            if find_chars[0] == this_char {
                let mut b = 1;
    
                while b < find_len && find_chars[b] == self.data_vector[i+b].text {
                    b += 1;
                }
    
                if b == find_len {
                    limit -= 1;

                   results.push(self.clone().cut(i, i + find_len));

                    if limit == 0 {
                        return results;
                    }
                }
            }
    
            i+=1;
        }
    
        results

    }

    pub fn search(self, find: &Regex) -> i32 {
        let as_string = self.to_string();
        let found = find.find(&as_string);

        if found == None {
            return -1;
        }

        let start = found.unwrap().start();

        let cut_start = &as_string[..start];

        start as i32 - (cut_start.len() - len(&cut_start)) as i32 
    }

    pub fn to_string(&self) -> String {
        let mut chars = vec![];

        for i in self.data_vector.iter() {
            chars.push(i.text);
        }

        String::from_iter(chars)
    }
}