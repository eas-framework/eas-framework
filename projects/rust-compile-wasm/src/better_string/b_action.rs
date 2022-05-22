use super::u_string::UString;

pub fn index_default_plus(index: Option<usize>, plus: usize) -> usize {
    if index == None {
        return plus - 1;
    }

    index.unwrap() + plus
}

pub fn first_non_alphabetic<T: UString>(text: &T, find: char, skip: Vec<char>) -> i32 {
    for i in 0..text.len() {
        let c = text.at(i);

        if !c.is_alphabetic() && !skip.contains(&c) {
            if find == c {
                return i as i32;
            }
            break;
        }
    }

    -1
}