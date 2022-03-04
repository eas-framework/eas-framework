#![allow(dead_code)]

use std::{cmp::min, iter::FromIterator};

use regex::Regex;

pub struct BetterString {
    chars: Vec<char>,
    length: usize,
}

impl BetterString {
    pub fn new(s: &str) -> Self {
        let chars: Vec<char> = s.chars().collect();
        let length: usize = chars.len();

        BetterString { chars, length }
    }

    pub fn concat(&self, text: &BetterString) -> BetterString{
        let mut chars = self.chars.to_owned();
        chars.extend(&text.chars);

        BetterString {
            chars,
            length: self.length + text.length,
        }
    }

    pub fn clone(&self) -> BetterString {
        BetterString {
            chars: self.chars.to_owned(),
            length: self.length,
        }
    }

    pub fn substring(&self, start: usize, end: usize) -> BetterString {
        BetterString {
            chars: self.chars[start..end].to_vec(),
            length: end - start,
        }
    }

    pub fn substring_start(&self, index: usize) -> BetterString {
        if index >= self.length {
            return BetterString {
                chars: vec![],
                length: 0
            }
        }
        BetterString {
            chars: self.chars[index..].to_vec(),
            length: self.length - index,
        }
    }

    pub fn substring_end(&self, index: usize) -> BetterString {
        BetterString {
            chars: self.chars[..index].to_vec(),
            length: min(self.length, index),
        }
    }

    pub fn include_char(&self, char: &char) -> bool {
        self.chars.contains(char)
    }

    pub fn at(&self, index: usize) -> char {
        if self.length <= index {
            return ' ';
        }
        self.chars[index]
    }

    pub fn at_minus(&self, index: usize, minus: usize) -> char {
        if minus > index {
            return ' ';
        }
        self.chars[index - minus]
    }

    pub fn len(&self) -> usize {
        self.length
    }

    pub fn is_empty(&self) -> bool {
        self.length == 0
    }

    pub fn vec(&self) -> &Vec<char> {
        &self.chars
    }

    pub fn index_of_better(&self, find: &BetterString) -> Option<usize> {
        let mut i = 0;

        if self.length <= find.length {
            return None;
        }

        let length = self.length - find.length;

        'main: while i < length{
            let this_char = self.chars[i];

            if find.chars[0] == this_char {
                for c in 1..find.length {
                    if find.chars[c] != self.chars[i + c] {
                        i += 1;
                        continue 'main;
                    }
                }

                return Option::Some(i);
            }

            i += 1;
        }

        None
    }

    pub fn starts_with(&self, find: &BetterString) -> bool {
        if find.length > self.length {
            return false;
        }

        for c in 0..find.length {
            if find.chars[c] != self.chars[c] {
                return false
            }
        }

        true
    }

    pub fn trim_start(&self) -> BetterString {
        let mut i = 0;
        for current in 0..self.length {
            let c = self.chars[current];
            if c.is_whitespace() || c == '\t' || c == '\r' || c == '\n' {
                i += 1;
            } else {
                break;
            }
        }

        self.substring_start(i)
    }

    pub fn eq(&self, text: &BetterString) -> bool{
        if text.length != self.length {
            return false;
        }

        self.starts_with(text)
    }

    pub fn index_of(&self, find: &str) -> Option<usize> {
        self.index_of_better(&BetterString::new(find))
    }

    pub fn index_of_char(&self, find: &char) -> Option<usize> {
        let mut i = 0;

        while i < self.length {
            let this_char = self.chars[i];

            if find == &this_char {
                return Option::Some(i);
            }

            i += 1;
        }

        None
    }

    pub fn search(&self, re: &Regex) -> Option<u32> {
        let this_string = &self.to_string();
        let found = re.shortest_match(this_string);

        if found == None {
            return None;
        }

        let start = found.unwrap();

        Option::Some(this_string[..start].chars().count() as u32)
    }

    pub fn to_string(&self) -> String {
        String::from_iter(&self.chars)
    }
}
