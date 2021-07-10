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

fn is_any_def(text: &str, index: usize, end_type: &Vec<&str>) -> bool{

    for i in end_type.iter() {
        if &&cut(text,  i32::max(0, index as i32 - len(i) as i32) as usize, index) == i {
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
            i += find_end_of_q(&cut_start(text, i+1), char) + 1;
        } else if is_any_def(text, i, &end_type) {
            return i as i32 - 1;
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
            i += find_end_of_q(&cut_start(text, i+1), char) + 1;
        } else if i > 0 && chars[i-1] == end_type {
            return i as i32 - 1;
        }

        i+=1;
    }

    -1
}

// pub fn block_skip_text(text: &str, char_types: Vec<&char>) -> i32 {
//     let chars: Vec<char> = text.chars().collect();
//     let mut count_have = 1;
//     let mut i = 0;

//     let length = len(text);
//     loop {
//         let char = chars[i];
        
//         i += 1;
//         if i == length {
//             break;
//         }

//         if TEXT_BLOCK.iter().any(|&x| x==&char) {
//              i += (1 + block_text_search(&cut_start(text, i + 1), &vec![&char], &vec![])) as usize;
//             continue;
//         }

//         if char_types[0] == &char{
//             count_have+=1;
//         }

//         if char_types[1] == &char {
//             count_have-=1;
//             if count_have == 0 {
//                 return i as i32;
//             }
//         }

//     }

//     -1
// }