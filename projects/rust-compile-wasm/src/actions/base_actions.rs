use crate::better_string::b_string::BetterString;

pub fn find_char_arr(arr: [&char; 3], value: &&char) -> bool{
    arr.iter().any(|x:&&char| x == value)
}

pub fn split_max_2(text: &BetterString, sp: &char) -> Vec<BetterString> {
    let split = text.index_of_char(sp);

    if split.is_none() {
        return vec![text.clone()];
    }
    
    let index = split.unwrap();

    vec![text.substring_end(index), text.substring_start(index+1)]
}

pub fn index_to_none_some(index: i32) -> Option<usize> {
    if index < 0 {
        return None;
    }

    Some(index as usize)
}