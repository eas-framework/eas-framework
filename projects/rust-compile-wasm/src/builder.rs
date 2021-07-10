use super::actions::base_actions::*;
use super::actions::base_reader;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Serialize, Deserialize)]
pub struct ErrorInfo {
    pub type_name: String,
    pub index: usize,
}

// #[derive(Debug)]
// #[derive(Serialize, Deserialize)]
// pub struct HTMLAttribute {
//     name: String,
//     value: String,
//     char_type: char
// }

// #[derive(Debug)]
// pub struct HTMLElement {
//     pub name: String,
//     pub text_before: String,
//     pub children_text: String,
//     pub children: Vec<HTMLElement>,
//     pub attributes: Vec<HTMLAttribute>,
// }

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

    pub fn find_close_char(
        &mut self,
        text: &str,
        search: &str,
        open: &str,
        close: &str,
        char_before_end: &char,
        as_big_tag: bool,
        add_index: usize,
    ) -> i32 {
        let mut i: usize = 0;
        let chars: Vec<char> = text.chars().collect();
        let length: i32 = chars.len() as i32 - len(search) as i32;
        let len_open = len(open);
        let len_close = len(close);
        while i < length as usize {
            //println!("i {}, length {}", i, length);
            let this_char = chars[i];
            //println!("search {:?}, need: {:?}", cut(&text, i, i + len(search)), search);
            if find_char_arr(base_reader::TEXT_BLOCK, &&this_char)
                && get_from_vec(&chars, i, 1) != '\\'
            {
                i += base_reader::find_end_of_q(&cut_start(text, i + 1), this_char) + 1;
            } else if cut(&text, i, i + len(search)) == search {
                return i as i32;
            } else if cut(&text, i, i + len_open) == open {
                let copy_start_index = i + len_open;
                let sub_text = cut_start(text, copy_start_index);
                let found_tag = self.find_special_tag(&sub_text);
                if found_tag.is_none() {

                    if char_before_end != &' ' && as_big_tag && &at(&sub_text, 0) == char_before_end
                    {
                        i += 1;
                        continue;
                    }

                    let found = base_reader::find_end_of_def(&sub_text, vec![close]);
                    //println!("subtext: {:?}, found: {:?}", sub_text, found);

                    i = (i as i32 + found - 1) as usize + len_close + len_open;

                    if char_before_end == &' ' || &at(&sub_text, (found - 1) as usize) != char_before_end
                    {
                        let max_find = cut_end(&sub_text, found as usize);
                        let next_text = cut_start(&sub_text, found as usize + len_close);

                        let mut end_tag_index;

                        let tag_type = split_max_2(&max_find, ' ')[0];
                        let skip_tag = self.simple_skip.iter().any(|x| x == &tag_type);
                        let find_end = &("</".to_owned() + tag_type);

                        let next_index_from_start =
                            add_index + copy_start_index + found as usize + len_close;

                        if skip_tag {
                            end_tag_index =
                                base_reader::find_end_of_def(&next_text, vec![find_end]);
                        } else {
                            end_tag_index = self.find_close_char(
                                &next_text,
                                find_end,
                                open,
                                close,
                                char_before_end,
                                true,
                                next_index_from_start,
                            );
                        }
                        if end_tag_index == -1 {
                            self.error_vec.push(ErrorInfo {
                                type_name: String::from(tag_type),
                                index: copy_start_index + add_index,
                            });
                        } else {
                            // let mut push_size = next_index_from_start + end_tag_index as usize;
                            if skip_tag {
                                end_tag_index += 1; //(2 + len(tag_type)) as i32;
                                                    // push_size -= len(find_end);
                            }
                            // self.map_ele.push(push_size);
                            let next_text = cut_start(&next_text, end_tag_index as usize);

                            i += end_tag_index as usize
                                + base_reader::find_end_of_def(&next_text, vec![&close]) as usize
                                + len_close
                                - 1;
                        }
                    }
                } else {
                    let tag_info = found_tag.unwrap();
                    let len_tag_info0 = len(&tag_info[0]);
                    let len_tag_info1 = len(&tag_info[1]);

                    let end_script = index_of(
                        &cut_start(&sub_text, len_tag_info0),
                        &(tag_info[1].to_owned() + close),
                    );
                    if end_script != -1 {
                        i += end_script as usize
                            + len_tag_info0
                            + len_tag_info1
                            + len_open
                            + len_close
                            - 1;
                    } else {
                        i += len(&sub_text);
                    }
                }
            }
            i += 1;
        }
        -1
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
                i += base_reader::find_end_of_q(&cut_start(text, i + 1), this_char) + 1;
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
    
                    let found = base_reader::find_end_of_def_char(&sub_text, '>') as usize;
    
                    i += found + 1;
    
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
                            // let mut push_size = next_index_from_start + end_tag_index as usize;
                            if skip_tag {
                                end_tag_index += 1; //(2 + len(tag_type)) as i32;
                                                    // push_size -= len(find_end);
                            }
                            // self.map_ele.push(push_size);
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

    pub fn public_html_element(&mut self, text: &str, search: &str) -> i32 {
        let be_search = "</".to_owned() + search;
        self.find_close_char_html_element(text, &be_search, 2 + len(search), false, 0)
    }

    //[start_key, end_key, start_value, end_value, char as code]
    pub fn get_attribute(text: &str) -> Vec<Vec<usize>> {
        let mut attributes: Vec<Vec<usize>> = vec![];
        let mut text_build = text.to_owned();

        while !text_build.is_empty() {
            let mut i = 0;
            let text_len = len(&text_build);
            let chars: Vec<char> = text_build.chars().collect();

            while i < text_len {
                let this_char = chars[i];

                if find_char_arr(base_reader::TEXT_BLOCK, &&this_char) && get_from_vec(&chars, i, 1) != '\\' {
                    i += base_reader::find_end_of_q(&cut_start(&text_build, i + 1), this_char) + 1;
                    break;
                }

                if i > 0 && text_len > 0 && chars[i - 1] == ' ' {
                    i -= 1;
                    break;
                }

                i += 1;
            }

            let use_split = cut_end(&text_build, i);

            let found_attributes: Vec<&str> = split_max_2(&use_split, '=');

            let mut push_vec = vec![i, i + len(found_attributes[0])];

            if found_attributes.len() > 1 {
                let char0 = at(found_attributes[1], 0);

                if find_char_arr(base_reader::TEXT_BLOCK, &&char0) {
                    let end_index = base_reader::find_end_of_q(&cut_start(found_attributes[1], 1), char0);

                    let start = push_vec[1] + 2;
                    push_vec.push(start);
                    push_vec.push(start + end_index);
                    push_vec.push(char0 as usize);
                } else {

                    let start = push_vec[1] + 1;
                    push_vec.push(start);
                    push_vec.push(start + len(found_attributes[1]));
                }
            }

            attributes.push(push_vec);
            text_build = cut_start(&text_build, i).trim().to_owned();
        }

        attributes
    }

    // pub fn html_parser(
    //     &mut self,
    //     text: &str,
    //     search: &str,
    //     add_index: usize,
    // ) -> (i32, Vec<HTMLElement>) {
    //     let mut i: usize = 0;
    //     let length: i32 = len(text) as i32;
    //     let chars: Vec<char> = text.chars().collect();
    //     let mut children = vec![];

    //     let mut last_found = 0;

    //     while i < length as usize {
    //         //println!("i {}, length {}", i, length);

    //         let this_char = chars[i];

    //         //println!("search {:?}, need: {:?}", cut(&text, i, i + len(search)), search);
    //         if find_char(&base_reader::TEXT_BLOCK.to_vec(), &&this_char)
    //             && get_from_vec(&chars, i, 1) != '\\'
    //         {
    //             i += base_reader::find_end_of_q(&cut_start(text, i + 1), this_char) + 1;
    //         } else if !search.is_empty() && cut(&text, i, i + len(search)) == search {
    //             return (i as i32, children);
    //         } else if this_char == '<' {
    //             let copy_start_index = i + 1;
    //             let sub_text = cut_start(text, copy_start_index);

    //             let found_tag = &self.find_special_tag(&sub_text);

    //             if found_tag.is_none() {
    //                 // found special tag
    //                 let found = base_reader::find_end_of_def(&sub_text, vec![">"]); // getting the end of the tag

    //                 i = (i as i32 + found - 1) as usize + 1 + 1;

    //                 let max_find = cut_end(&sub_text, found as usize);
    //                 let mut split_info = split_max_2(&max_find, ' '); // splitting to name and next

    //                 let tag_type = split_info[0];

    //                 let is_small_tag = at(&sub_text, (found - 1) as usize) == '/'; // checking if this small tag <small/>

    //                 if is_small_tag {
    //                     split_info[1] = &split_info[1][..split_info[1].len() - 1];
    //                     // removing the last char - /
    //                 }

    //                 let this_elem = HTMLElement {
    //                     // creating this element
    //                     name: tag_type.to_owned(),
    //                     text_before: cut(text, last_found, copy_start_index - 1),
    //                     children_text: "".to_owned(),
    //                     children: vec![],
    //                     attributes: self.get_attribute(&split_info[1]),
    //                 };

    //                 children.push(this_elem);
    //                 last_found = i;

    //                 if is_small_tag {
    //                     continue;
    //                 }

    //                 let next_text = cut_start(&sub_text, found as usize + 1); // getting the next info, after this tag

    //                 let mut end_tag_index;

    //                 let skip_tag = self.simple_skip.iter().any(|x| x == &tag_type);
    //                 let find_end = &("</".to_owned() + tag_type); // creating a search

    //                 let next_index_from_start = add_index + copy_start_index + found as usize + 1; // next location

    //                 if skip_tag {
    //                     end_tag_index = base_reader::find_end_of_def(&next_text, vec![find_end]);
    //                 // skip special tags
    //                 } else {
    //                     let (index, child) =
    //                         self.html_parser(&next_text, &find_end, next_index_from_start);
    //                     end_tag_index = index;
    //                     children.extend(child);
    //                 }

    //                 if end_tag_index == -1 {
    //                     // error close tag not found!
    //                     self.error_vec.push(ErrorInfo {
    //                         type_name: String::from(tag_type),
    //                         index: copy_start_index + add_index,
    //                     });
    //                 } else {
    //                     let mut push_size = next_index_from_start + end_tag_index as usize;

    //                     if skip_tag {
    //                         end_tag_index += 1; //(2 + len(tag_type)) as i32;

    //                         push_size -= len(find_end);
    //                     }

    //                     self.map_ele.push(push_size);

    //                     let next_text = cut_start(&next_text, end_tag_index as usize);

    //                     i += end_tag_index as usize
    //                         + base_reader::find_end_of_def(&next_text, vec![&">"]) as usize
    //                         + 1
    //                         - 1;
    //                 }
    //             } else {
    //                 let tag_info = found_tag.unwrap();
    //                 let len_tag_info0 = len(&tag_info[0]);
    //                 let len_tag_info1 = len(&tag_info[1]);

    //                 let mut end_script = index_of(
    //                     &cut_start(&sub_text, len_tag_info0),
    //                     &(tag_info[1].to_owned() + ">"),
    //                 );

    //                 if end_script == -1 {
    //                     end_script = len(&sub_text) as i32;
    //                 }

    //                 let this_elem = HTMLElement {
    //                     // creating this element
    //                     name: tag_info[0].to_owned(),
    //                     text_before: cut(text, last_found, copy_start_index - 1),
    //                     children_text: cut(
    //                         text,
    //                         copy_start_index + len_tag_info0,
    //                         copy_start_index + end_script as usize,
    //                     ),
    //                     children: vec![],
    //                     attributes: vec![],
    //                 };

    //                 children.push(this_elem);

    //                 i += end_script as usize + len_tag_info0 + len_tag_info1 + 1 + 1 - 1;
    //             }
    //         }

    //         i += 1;
    //     }

    //     (-1, children)
    // }

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
