#![allow(dead_code)]

use std::{cmp::min, iter::FromIterator};

use regex::Regex;

use super::u_string::UString;

pub struct RefString {
    start_skip: usize,
    chars: *const Vec<char>,
    length: usize,
}

impl RefString {
    pub fn new(chars: &Vec<char>) -> Self {
        let length: usize = chars.len();

        RefString {
            start_skip: 0,
            chars,
            length,
        }
    }

    pub fn eq(&self, text: &RefString) -> bool {
        if self.length == text.length
        {
            if self.start_skip == text.start_skip && self.chars == text.chars {
                return true;
            }
            return self.starts_with(text);
        }

        false
    }

    fn search_start(&self, re: &Regex) -> Option<u32> {
        let this_string = &self.to_string();
        let found = re.find(this_string);

        if found == None {
            return None;
        }

        let start = found.unwrap().start();

        Option::Some(this_string[..start].chars().count() as u32)
    }
}

impl UString for RefString {
    fn substring(&self, start: usize, end: usize) -> RefString {
        RefString {
            start_skip: self.start_skip + start,
            chars: self.chars,
            length: end - start,
        }
    }

    fn substring_start(&self, index: usize) -> RefString {
        if index >= self.length {
            return RefString {
                start_skip: 0,
                chars: self.chars,
                length: 0,
            };
        }
        RefString {
            start_skip: self.start_skip + index,
            chars: self.chars,
            length: self.length - index,
        }
    }

    fn substring_end(&self, index: usize) -> RefString {
        RefString {
            start_skip: self.start_skip,
            chars: self.chars,
            length: min(self.length, index),
        }
    }


    fn trim_start(&self) -> RefString {
        let mut i = 0;
        for current in 0..self.length {
            let c = self.at(current);
            if c.is_whitespace() {
                i += 1;
            } else {
                break;
            }
        }

        self.substring_start(i)
    }

     fn trim_end(&self) -> RefString {
        let mut i = 0;
        for current in self.length..0 {
            let c = self.at(current);
            if c.is_whitespace() {
                i += 1;
            } else {
                break;
            }
        }

        self.substring(0, self.length - i)
    }

     fn trim(&self) -> RefString {
        self.trim_start().trim_end()
    }


    fn include_char(&self, char: &char) -> bool {
        unsafe { (*self.chars).contains(char) }
    }

    fn starts_with<T: UString>(&self, find: &T) -> bool {
        if find.len() > self.length {
            return false;
        }

        for c in 0..find.len() {
            if find.at(c) != self.at(c) {
                return false;
            }
        }

        true
    }

    fn eq<T: UString>(&self, text: &T) -> bool {
        if text.len() != self.length {
            return false;
        }

        self.starts_with(text)
    }

    fn at(&self, index: usize) -> char {
        unsafe { (*self.chars)[index + self.start_skip] }
    }

    fn at_minus(&self, index: usize, minus: usize) -> char {
        if minus > index {
            return ' ';
        }
        self.at(index - minus)
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
                    if find.at(c) != self.at(c + i) {
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

    fn index_of(&self, find: &str) -> Option<usize> {
        self.index_of_better(&RefString::new(&find.chars().collect()))
    }

    fn index_of_char(&self, find: &char) -> Option<usize> {
        let mut i = 0;

        while i < self.length {
            let this_char = self.at(i);

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

    fn copy(&self) -> RefString {
        RefString {
            start_skip: self.start_skip,
            chars: self.chars.clone(),
            length: self.length,
        }
    }

    fn to_string(&self) -> String {
        String::from_iter(unsafe {
            ((*self.chars)[self.start_skip..(self.start_skip + self.length)]).iter()
        })
    }

    fn as_ref(&self) -> RefString {
        self.copy()
    }
}
