use crate::better_string::b_string::BetterString;
use crate::actions::base_actions::*;
use crate::actions::base_reader;
use crate::better_string::r_string::RefString;
use crate::better_string::u_string::UString;
use serde::{Deserialize, Serialize};
use std::fmt;
use regex::Regex;
use lazy_static::lazy_static;

lazy_static!{
    static ref HTML_TAG: Regex = Regex::new(r"[\pL]").unwrap();
    static ref HTML_SMALL_CLOSE_BETTER: BetterString = BetterString::new("</");
    static ref HTML_CLOSE_BETTER: BetterString = BetterString::new(">");
}

#[derive(Serialize, Deserialize)]
pub struct ErrorInfo {
    pub type_name: String,
    pub index: usize
}

pub struct ResultInsertComponent{
    search: String,
    index: usize,
    result_index: i32
}
pub struct InsertComponent {
    pub skip_special_tag: Vec<Vec<BetterString>>,
    pub simple_skip: Vec<BetterString>,
    pub error_vec: Vec<ErrorInfo>,
    cache: Vec<ResultInsertComponent>
}

impl InsertComponent {
    pub fn new(skip_special_tag: Vec<Vec<BetterString>>, simple_skip: Vec<BetterString>) -> Self {
        InsertComponent {
            skip_special_tag,
            simple_skip,
            error_vec: vec![],
            cache: vec![]
        }
    }

    fn find_special_tag<T: UString>(&self, tag: &T) -> Option<&Vec<BetterString>> {
        for i in self.skip_special_tag.iter() {            
            if tag.starts_with(&i[0]) {
                return Some(i);
            }
        }
        None
    }

    fn char_html_element_with_cache<T: UString, S: UString>(&mut self, text: &T, search: &S, search_string: &str, as_big_tag: bool,add_index: usize) -> i32 {
        let found = self.cache.iter().find(|x| x.index == add_index && x.search == search_string);

        if found.is_some() {
            return found.unwrap().result_index;
        }

        let get_index = self.find_close_char_html_element(text, search, as_big_tag, add_index, false);

        self.cache.push(ResultInsertComponent {
            search: search.to_string(),
            index: add_index,
            result_index: get_index
        });

        get_index
    }

    fn find_close_char_html_element<T: UString, S: UString>(&mut self, text: &T, search: &S, as_big_tag: bool,add_index: usize, in_tag: bool) -> i32 {
        let chars_len = text.len();
    
        if chars_len < search.len() {
            return -1;
        }
    
        let mut i: usize = 0;
        let length = chars_len - search.len();
        while i <= length {

            let this_char = text.at(i);
            
            if in_tag && find_char_arr(base_reader::TEXT_BLOCK, &&this_char) && text.at_minus( i, 1) != '\\'
            {
                i += base_reader::find_end_of_q(&text.substring_start(i+1), this_char);
            } else if text.substring(i, i + search.len()).eq(search) {
                return i as i32;
            } else if this_char == '<' {
                let copy_start_index = i + 1;
                let sub_text = text.substring_start(copy_start_index);
                let found_tag = self.find_special_tag(&sub_text);
    
                if found_tag.is_none() {
                    if as_big_tag && sub_text.at(0) == '/' || length > i+1 && !HTML_TAG.is_match(&text.at(i+1).to_string())
                    {
                        i += 1;
                        continue;
                    }
    
                     let found = self.find_close_char_html_element(&sub_text, &*HTML_CLOSE_BETTER, false, 0, true) as usize;
    
                    i += found;
    
                    if sub_text.at(found - 1) != '/'
                    {
                        let max_find = sub_text.substring_end(found);
                        let next_text = sub_text.substring_start(found+1);
                        
                        let tag_type = &split_max_2(&max_find, &' ')[0];
                        let mut end_tag_index;
                        let skip_tag = self.simple_skip.iter().any(|x| x.eq(tag_type));
                        
                        let find_end = &HTML_SMALL_CLOSE_BETTER.concat(tag_type);
    
                        let next_index_from_start =
                            add_index + copy_start_index + found + 1;
    
                        if skip_tag {
                            end_tag_index = base_reader::find_end_of_def(&next_text, vec![find_end]);
                        } else {

                            end_tag_index = self.char_html_element_with_cache(
                                &next_text,
                                find_end,
                                &find_end.to_string(),
                                true,
                                next_index_from_start,
                            );
                        }
                        if end_tag_index == -1 {
                            let index = copy_start_index + add_index;

                            if !self.error_vec.iter().any(|x|x.index == index) {
                                self.error_vec.push(ErrorInfo {
                                    type_name: tag_type.to_string(),
                                    index,
                                });
                            }
                        }  else {
                            if skip_tag {
                                end_tag_index += 1;
                            }

                            let next_text = next_text.substring_start(end_tag_index as usize);
    
                            i += end_tag_index as usize + base_reader::find_end_of_def_char(&next_text, &'>') as usize;
                        }
                    }
                } else {
                    let tag_info = found_tag.unwrap();
                    let len_tag_info0 = tag_info[0].len();
                    let len_tag_info1 = tag_info[1].len();
    
                    
                    let end_script = sub_text.substring_start(len_tag_info0).index_of_better(&tag_info[1].concat(&*HTML_CLOSE_BETTER));
                    if end_script != None {
                        i += end_script.unwrap() + len_tag_info0 + len_tag_info1 + 1;
                    } else {
                        i += sub_text.len();
                    }
                }
            }
            i += 1;
        }
        -1
    }

    pub fn find_close_char(&mut self, text: &str, search: &str)  -> i32 {
        self.find_close_char_html_element(&RefString::new(&text.chars().collect()), &RefString::new(&search.chars().collect()), false, 0, true)

    }

    pub fn public_html_element(&mut self, text: &str, search: &str) -> i32 {
        let be_search = "</".to_owned() + search;
        self.find_close_char_html_element(&RefString::new(&text.chars().collect()), &RefString::new(&be_search.chars().collect()), false, 0, false)
    }

    pub fn clear(&mut self) {
        self.error_vec = vec![];
        self.cache = vec![];
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
