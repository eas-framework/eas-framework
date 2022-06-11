use crate::better_string::{b_string::BetterString, u_string::UString};

pub fn find_char_arr(arr: [&char; 3], value: &&char) -> bool {
    arr.iter().any(|x: &&char| x == value)
}

pub fn split_max_2<T: UString>(text: &T, sp: &char) -> Vec<T> {
    let split = text.index_of_char(sp);

    if split.is_none() {
        return vec![text.copy()];
    }

    let index = split.unwrap();

    vec![text.substring_end(index), text.substring_start(index + 1)]
}

pub fn index_to_none_some(index: i32) -> Option<usize> {
    if index < 0 {
        return None;
    }

    Some(index as usize)
}

pub fn find_min_but<T: num::Integer>(all: Vec<T>, but: T) -> T {
    all.into_iter().filter(|x| x != &but).min().unwrap()
}

pub fn find_min_but_none<T: num::Integer>(all: Vec<Option<T>>) -> Option<T> {
    all.into_iter().filter(|x| x.is_some()).map(|x| x.unwrap()).min()
}
