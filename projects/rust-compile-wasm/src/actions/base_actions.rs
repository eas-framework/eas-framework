use crate::better_string::b_string::BetterString;

pub fn get_from_vec(arr: &Vec<char>, num: usize, minus: usize) -> char {
    if minus > num {
        return ' ';
    }

    arr[num - minus]
}

pub fn find_char_arr(arr: [&char; 3], value: &&char) -> bool{
    arr.iter().any(|x:&&char| x == value)
}

pub fn len(text: &str) -> usize {
    text.chars().count()
}

pub fn at(text: &str, index: usize) -> char {
    text.chars().skip(index).next().unwrap()
}

pub fn cut(text: &str, start: usize, end: usize) -> String {
    text.chars().skip(start).take(end-start).collect()
}

pub fn cut_start(text: &str, start: usize) -> String{
    text.chars().skip(start).collect()
}

pub fn cut_end(text: &str, end: usize) -> String{
    text.chars().take(end).collect()
}

pub fn index_of(text: &str, find: &str) -> i32 {
    let chars: Vec<char> = text.chars().collect();
    let find_chars: Vec<char> = find.chars().collect();
    let all_len = chars.len();
    let find_len = find_chars.len();
    let mut i = 0;

    while i < all_len {
        let this_char = chars[i];

        if find_chars[0] == this_char {
            let mut b = 1;

            while b < find_len && find_chars[b] == chars[i+b] {
                b += 1;
            }

            if b == find_len {
                return i as i32;
            }
        }

        i+=1;
    }

    -1
}

pub fn split_max_2(text: &BetterString, sp: char) -> Vec<BetterString> {
    let split = text.index_of_char(sp);

    if split.is_none() {
        return vec![text.clone()];
    }
    
    let index = split.unwrap() as usize;

    vec![text.substring_end(index), text.substring_start(index+1)]
}