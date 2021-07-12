use super::actions::base_actions::*;
use super::actions::base_reader;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Serialize, Deserialize)]
pub struct ErrorInfo {
    pub type_name: String,
    pub index: usize,
}

pub struct InsertComponent {
    pub skip_special_tag: Vec<Vec<String>>,
    pub simple_skip: Vec<String>,
    pub error_vec: Vec<ErrorInfo>,
    pub map_ele: Vec<usize>,
}

impl InsertComponent {
    pub fn new(skip_special_tag: Vec<Vec<String>>, simple_skip: Vec<String>) -> Self {
        InsertComponent {
            skip_special_tag,
            simple_skip,
            error_vec: vec![],
            map_ele: vec![],
        }
    }

    fn find_special_tag(&self, tag: &str) -> Option<&Vec<String>> {
        for i in self.skip_special_tag.iter() {
            if cut_end(tag, len(&i[0])) == i[0] {
                return Some(i);
            }
        }
        None
    }

    fn find_close_char_html_element(&mut self, text: &str, search: &str, search_len: usize, as_big_tag: bool,add_index: usize) -> i32 {
        let chars: Vec<char> = text.chars().collect();
        let chars_len = chars.len();
    
        if chars_len < search_len {
            return -1;
        }
    
        let mut i: usize = 0;
        let length = chars_len - search_len;
        while i < length {
            let this_char = chars[i];
            
            if find_char_arr(base_reader::TEXT_BLOCK, &&this_char) && get_from_vec(&chars, i, 1) != '\\'
            {
                i += base_reader::find_end_of_q(&cut_start(text, i + 1), this_char);
            } else if cut(&text, i, i + search_len) == search {
                return i as i32;
            } else if this_char == '<' {
                let copy_start_index = i + 1;
                let sub_text = cut_start(text, copy_start_index);
                let found_tag = self.find_special_tag(&sub_text);
    
                if found_tag.is_none() {
                    if as_big_tag && at(&sub_text, 0) == '/'
                    {
                        i += 1;
                        continue;
                    }
    
                    let found = self.find_close_char_html_element(&sub_text, &">", 1, false, 0) as usize;
    
                    i += found;
    
                    if at(&sub_text, found - 1) != '/'
                    {
                        let max_find = cut_end(&sub_text, found);
                        let next_text = cut_start(&sub_text, found + 1);

                        //println!("poo {:?}", next_text);
                        
                        let tag_type = split_max_2(&max_find, ' ')[0];
                        let mut end_tag_index;
                        let skip_tag = self.simple_skip.iter().any(|x| x == &tag_type);
                        let find_end = &("</".to_owned() + tag_type);
    
                        let next_index_from_start =
                            add_index + copy_start_index + found + 1;
    
                        if skip_tag {
                            end_tag_index =
                                base_reader::find_end_of_def(&next_text, vec![find_end]);
                        } else {
                            end_tag_index = self.find_close_char_html_element(
                                &next_text,
                                find_end,
                                2 + len(tag_type),
                                true,
                                next_index_from_start,
                            );
                        }
                        if end_tag_index == -1 {
                            self.error_vec.push(ErrorInfo {
                                type_name: String::from(tag_type),
                                index: copy_start_index + add_index,
                            });
                        }  else {
                            if skip_tag {
                                end_tag_index += 1;
                            }

                            let next_text = cut_start(&next_text, end_tag_index as usize);
    
                            i += end_tag_index as usize + base_reader::find_end_of_def_char(&next_text, '>') as usize;
                        }
                    }
                } else {
                    let tag_info = found_tag.unwrap();
                    let len_tag_info0 = len(&tag_info[0]);
                    let len_tag_info1 = len(&tag_info[1]);
    
                    let end_script = index_of(
                        &cut_start(&sub_text, len_tag_info0),
                        &(tag_info[1].to_owned() + ">"),
                    );
                    if end_script != -1 {
                        i += end_script as usize + len_tag_info0 + len_tag_info1 + 1;
                    } else {
                        i += len(&sub_text);
                    }
                }
            }
            i += 1;
        }
        -1
    }

    pub fn find_close_char(&mut self, text: &str, search: &str)  -> i32 {
        self.find_close_char_html_element(text, search, len(search), false, 0)

    }

    pub fn public_html_element(&mut self, text: &str, search: &str) -> i32 {
        let be_search = "</".to_owned() + search;
        self.find_close_char_html_element(text, &be_search, 2 + len(search), false, 0)
    }

    pub fn clear(&mut self) {
        self.error_vec = vec![];
        // self.map_ele = vec![];
    }
}

impl fmt::Debug for ErrorInfo {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        fmt.debug_struct("ErrorInfo")
            .field("type name", &self.type_name)
            .field("index", &self.index)
            .finish()
    }
}
