use crate::better_string::b_string::BetterString;

use super::base_actions::*;

pub static TEXT_BLOCK: [&'static char; 3] = [&'"', &'\'', &'`'];

pub fn find_end_of_q(text: &BetterString, q_type: char) -> usize {
    let length = text.len();
    for i in 0..length {
        if text.at(i) == q_type && text.at_minus(i, 1) != '\\' {
            return i + 1;
        }
    }

    length
}

pub fn find_end_of_def(text: &BetterString, end_type: Vec<&BetterString>) -> i32 {
    let length = text.len();

    let mut i = 0;
    while i < length {

        let char = text.at(i);
        if TEXT_BLOCK.iter().any(|&x| x==&char) && text.at_minus( i,1) != '\\' {
            i += find_end_of_q(&text.substring_start( i+1), char) + 1;
            continue;
        } 

        let next = text.substring_start(i);

        if end_type.iter().any(|x| next.starts_with(x)) {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn find_end_of_def_char(text: &BetterString, end_type: char) -> i32 {
    let length = text.len();

    let mut i = 0;
    while i < length {

        let char = text.at(i);
        if TEXT_BLOCK.iter().any(|&x| x==&char) && text.at_minus( i,1) != '\\' {
            i += find_end_of_q(&text.substring_start(i+1), char);
        } else if char == end_type {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn block_skip_text(text: &BetterString, char_types: Vec<char>) -> i32 {
    let mut count_have = 1;
    let mut i = 0;

    let length = text.len();
    while i < length {
        let char = text.at(i);
        
        if TEXT_BLOCK.iter().any(|&x| x==&char) {
             i += find_end_of_q(&text.substring_start( i + 1), char) + 1;
            continue;
        }

        if char_types[0] == char{
            count_have+=1;
        }

        if char_types[1] == char {
            count_have-=1;
            if count_have == 0 {
                return i as i32;
            }
        }

        i += 1;

    }

    -1
}
