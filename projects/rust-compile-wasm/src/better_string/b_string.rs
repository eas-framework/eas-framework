#![allow(dead_code)]

use std::{cmp::min, iter::FromIterator};

use regex::Regex;
use super::r_string::RefString;
use super::u_string::UString;

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

     pub fn repeat( char: char, length: usize) -> BetterString {
        let mut chars = vec![];

        for _ in 0..length {
            chars.push(char);
        }

        BetterString {
            chars,
            length
        }
    }

    pub fn concat<T: UString>(&self, text: &T) -> BetterString{
        let mut chars = self.chars.to_owned();
        chars.extend(text.to_string().chars());

        BetterString {
            chars,
            length: self.length + text.len(),
        }
    }
}

impl UString for BetterString {

     fn copy(&self) -> BetterString {
        BetterString {
            chars: self.chars.to_owned(),
            length: self.length,
        }
    }

     fn substring(&self, start: usize, end: usize) -> BetterString {
        BetterString {
            chars: self.chars[start..end].to_vec(),
            length: end - start,
        }
    }

     fn substring_start(&self, index: usize) -> BetterString {
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

     fn substring_end(&self, index: usize) -> BetterString {
        BetterString {
            chars: self.chars[..index].to_vec(),
            length: min(self.length, index),
        }
    }

     fn include_char(&self, char: &char) -> bool {
        self.chars.contains(char)
    }

     fn at(&self, index: usize) -> char {
        if self.length <= index {
            return ' ';
        }
        self.chars[index]
    }

     fn at_minus(&self, index: usize, minus: usize) -> char {
        if minus > index {
            return ' ';
        }
        self.chars[index - minus]
    }

     fn len(&self) -> usize {
        self.length
    }

     fn is_empty(&self) -> bool {
        self.length == 0
    }

    fn index_of_better<T: UString>(&self, find: &T) -> Option<usize> {
        let mut i = 0;

        'main: while i < self.length {
            let this_char = self.at(i);

            if find.at(0) == this_char {
                for c in 1..find.len() {
                    if find.at(c) != self.at(i + c) {
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

    fn starts_with<T: UString>(&self, find: &T) -> bool {
        if find.len() > self.length {
            return false;
        }

        for c in 0..find.len() {
            if find.at(c) != self.at(c) {
                return false
            }
        }

        true
    }

     fn trim_start(&self) -> BetterString {
        let mut i = 0;
        for current in 0..self.length {
            let c = self.chars[current];
            if c.is_whitespace() {
                i += 1;
            } else {
                break;
            }
        }

        self.substring_start(i)
    }

     fn trim_end(&self) -> BetterString {
        let mut i = 0;
        for current in self.length..0 {
            let c = self.chars[current];
            if c.is_whitespace() {
                i += 1;
            } else {
                break;
            }
        }

        self.substring(0, self.length - i)
    }

     fn trim(&self) -> BetterString {
        self.trim_start().trim_end()
    }

    fn eq<T: UString>(&self, text: &T) -> bool{
        if text.len() != self.length {
            return false;
        }

        self.starts_with(text)
    }

     fn index_of(&self, find: &str) -> Option<usize> {
        self.index_of_better(&BetterString::new(find))
    }

     fn index_of_char(&self, find: &char) -> Option<usize> {
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

     fn search(&self, re: &Regex) -> Option<u32> {
        let this_string = &self.to_string();
        let found = re.shortest_match(this_string);

        if found == None {
            return None;
        }

        let start = found.unwrap();

        Option::Some(this_string[..start].chars().count() as u32)
    }

     fn to_string(&self) -> String {
        String::from_iter(&self.chars)
    }

    fn as_ref(&self) -> RefString {
        RefString::new(&self.chars)
    }
}
