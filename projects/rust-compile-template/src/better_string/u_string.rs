use regex::Regex;

use super::r_string::RefString;

pub trait UString {
    fn substring(&self, start: usize, end: usize) -> Self;

    fn substring_start(&self, index: usize) -> Self;

    fn substring_end(&self, index: usize) -> Self;

    fn trim_start(&self) -> Self;

    fn trim_end(&self) -> Self;
      
    fn trim(&self) -> Self;

    fn include_char(&self, char: &char) -> bool;

    fn starts_with<T: UString>(&self, find: &T) -> bool;

    fn eq<T: UString>(&self, text: &T) -> bool;

    fn at(&self, index: usize) -> char;

    fn at_minus(&self, index: usize, minus: usize) -> char;

    fn len(&self) -> usize;

    fn is_empty(&self) -> bool;

    fn index_of_better<T: UString>(&self, find: &T) -> Option<usize>;

    fn index_of(&self, find: &str) -> Option<usize>;

    fn index_of_char(&self, find: &char) -> Option<usize>;

    fn search(&self, re: &Regex) -> Option<u32>;

    fn copy(&self) -> Self;

    fn to_string(&self) -> String;

    fn as_ref(&self) -> RefString;
}