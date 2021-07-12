use super::base_actions::*;

pub static TEXT_BLOCK: [&'static char; 3] = [&'"', &'\'', &'`'];

pub fn find_end_of_q(text: &str, q_type: char) -> usize {
    let chars: Vec<char> = text.chars().collect();
    let length = len(text);
    for i in 0..length {
        if chars[i] == q_type && get_from_vec(&chars, i,1) != '\\' {
            return i + 1;
        }
    }

    length
}

fn is_any_def(text: &str, index: usize, length: usize, end_type: &Vec<&str>) -> bool{

    for i in end_type.iter() {
        if &&cut(text, index, usize::min(length, index + len(i))) == i {
            return true;
        }
    }

    false
}

pub fn find_end_of_def(text: &str, end_type: Vec<&str>) -> i32 {
    let chars: Vec<char> = text.chars().collect();
    let length = chars.len();

    let mut i = 0;
    while i < length {

        let char = chars[i];
        if TEXT_BLOCK.iter().any(|&x| x==&char) && get_from_vec(&chars, i,1) != '\\' {
            i += find_end_of_q(&cut_start(text, i+1), char);
        } else if is_any_def(text, i, length, &end_type) {
            return i as i32;
        }

        i+=1;
    }

    -1
}

pub fn find_end_of_def_char(text: &str, end_type: char) -> i32 {
    let chars: Vec<char> = text.chars().collect();
    let length = chars.len();

    let mut i = 0;
    while i < length {

        let char = chars[i];
        if TEXT_BLOCK.iter().any(|&x| x==&char) && get_from_vec(&chars, i,1) != '\\' {
            i += find_end_of_q(&cut_start(text, i+1), char);
        } else if char == end_type {
            return i as i32;
        }

        i+=1;
    }

    -1
}