use crate::better_string::{b_string::BetterString, u_string::UString};

pub static TEXT_BLOCK: [&'static char; 3] = [&'"', &'\'', &'`'];

fn not_escaped<T: UString>(text: &T, index: usize) -> bool {
    let back_one: char = text.at_minus(index, 1);
    back_one != '\\' || back_one == '\\' && text.at_minus(index, 2) == '\\'
}

pub fn find_end_of_q<T: UString>(text: &T, q_type: char) -> usize {
    let length = text.len();
    for i in 0..length {
        if text.at(i) == q_type && not_escaped(text, i) {
            return i + 1;
        }
    }

    length
}

pub fn find_end_of_def<T: UString, V: UString>(text: &T, end_type: Vec<&V>) -> i32 {
    let length = text.len();

    let mut i = 0;
    while i < length {

        let char = text.at(i);
        if TEXT_BLOCK.iter().any(|&x| x==&char) && not_escaped(text, i) {
            i += find_end_of_q(&text.substring_start( i+1), char) + 1;
            continue;
        } 

        let next = text.substring_start(i);

        if end_type.iter().any(|x| next.starts_with(x.to_owned())) {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn find_end_of_def_word<T: UString, E: UString>(text: &T, end_type: &E) -> i32 {
    let length = text.len();

    let mut i = 0;
    while i < length {

        let char = text.at(i);
        if TEXT_BLOCK.iter().any(|&x| x==&char) && not_escaped(text, i) {
            i += find_end_of_q(&text.substring_start( i+1), char) + 1;
            continue;
        } 

        if !text.at_minus(i,1).is_alphabetic() && !text.at(i+end_type.len()).is_alphabetic() && text.substring_start(i).starts_with(end_type) {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn find_end_of_word<T: UString>(text: &T) -> usize {
    let length = text.len();

    let mut i = 0;
    while i < length {
        let c = text.at(i);

        if !c.is_alphabetic() {
            return i;
        }

        i+=1;
    }

    length
}

pub fn find_end_of_def_char<T: UString>(text: &T, end_type: &char) -> i32 {
    let length = text.len();

    let mut i = 0;
    while i < length {

        let char = text.at(i);
        if TEXT_BLOCK.iter().any(|&x| x==&char) && not_escaped(text, i) {
            i += find_end_of_q(&text.substring_start(i+1), char);
        } else if &char == end_type {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn block_skip_text<T: UString>(text: &T, char_types: Vec<char>) -> i32 {
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